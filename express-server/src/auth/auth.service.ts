import { DUPLICATE_EXCEPTION, INTERNAL_SERVER_EXCEPTION, WRONG_CREDENTIALS_EXCEPTION } from '../exception';
import { CreateUserDto, User, userModel } from '../user';
import { AuthDto, AuthResponse } from './auth.model';
import { RefreshToken } from './refresh-token.model';
import { generateAccessToken, generateRefreshToken } from './Tokenize';

export class AuthService {
  private _userModel = userModel;
  private _refTokenModel = RefreshToken;

  public async register(body: CreateUserDto): Promise<{ user: User }> {
    const userWithUsernameFound = await this._userModel.findOne({ username: body.username });
    if (userWithUsernameFound) {
      throw new DUPLICATE_EXCEPTION(body.username);
    }
    const newUser = new userModel({ ...body });
    const savedUser = await newUser.save();
    if (!savedUser) {
      throw new INTERNAL_SERVER_EXCEPTION('Failed to save user!');
    }
    return { user: savedUser };
  }

  public async login(body: AuthDto): Promise<AuthResponse> {
    const foundUser = await this._userModel.findOne({ username: body.username }) as User;
    const passwordsMatched: boolean = await foundUser.validatePassword(body.password);
    if (!foundUser || !passwordsMatched) {
      throw new WRONG_CREDENTIALS_EXCEPTION();
    }
    try {
      const accessTokenObj = await generateAccessToken(foundUser);
      const refreshTokenObj = await generateRefreshToken(foundUser, body.ipAddress);
      if (!accessTokenObj || !refreshTokenObj) {
        throw 'Failed to generate tokens';
      }
      foundUser.set({ lastLoggedInAt: new Date().toISOString() });
      await foundUser.save();
      return {
        accessToken: accessTokenObj.token,
        refreshToken: refreshTokenObj.token,
      } as AuthResponse;
    } catch (error) {
      throw error;
    }
  }

  public async refreshToken({ token, ipAddress }: { token: Buffer | string, ipAddress: string }) {
    try {
      const refreshToken = await this.getRefreshToken(token);
      const newRefreshToken = await generateRefreshToken(refreshToken.user, ipAddress);
      if (!newRefreshToken) {
        throw 'Failed to generate new refresh token';
      }
      refreshToken.revoked.date = Date.now();
      refreshToken.revoked.ip = ipAddress;
      refreshToken.replacementToken = refreshToken.token;
      await refreshToken.save();
      const accessToken = await generateAccessToken(refreshToken.user);
      if (!accessToken) {
        throw 'Failed to generate access token';
      }
      return <AuthResponse>{
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
      };
    } catch (error) {
      throw error;
    }
  }

  public async expireRefreshToken({ token, ipAddress }) {
    try {
      const refreshToken = await this.getRefreshToken(token);
      refreshToken.revoked.date = Date.now();
      refreshToken.revoked.ip = ipAddress;
      await refreshToken.save();
    } catch (error) {
      throw (error);
    }
  }

  public async expireAllRefreshTokens(userId: string) {
    try {
      const foundUser = await this.getUserById(userId);
      if (!foundUser) {
        throw 'User not found';
      }
      await this._refTokenModel.deleteMany({ user: userId });
    } catch (error) {
      throw error;
    }
  }

  public async getUserById(userId: string) {
    return await this._userModel.findById(userId);
  }

  public async updateUserPassword({ userId, oldPassword, newPassword }) {
    try {
      const foundUser = await this._userModel.findById(userId);
      if (!foundUser) {
        throw 'User not found!';
      }
      const passwordsMatched = await foundUser.validatePassword(oldPassword);
      if (!passwordsMatched) {
        throw 'Invalid password';
      }
      foundUser.password = newPassword;
      foundUser.updatedAt = new Date().toISOString();
      return await foundUser.save();
    } catch (error) {
      throw error;
    }
  }

  public async getUserRefreshTokenList(userId: string) {
    try {
      const foundUser = await this.getUserById(userId);
      if (!foundUser) {
        throw 'User not found!'
      }
      const refreshTokens = await this._refTokenModel
        .find({ user: foundUser._id } as any)
        .sort('created.ip');
      return refreshTokens;
    } catch (error) {
      throw (error)
    }
  }

  protected async getRefreshToken(token: Buffer | string) {
    const refreshTokenObj = await this._refTokenModel.findOne({ token }).populate('user');
    if (!refreshTokenObj && refreshTokenObj.isActive) {
      throw 'Invalid refresh token';
    }
    return refreshTokenObj;
  }
}
