import { DUPLICATE_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION, WRONG_CREDENTIALS_EXCEPTION } from '../exception';
import { CreateUserDto, User } from '../user';
import { AuthDto, AuthResponse } from './auth.model';
import { RefreshToken } from './refresh-token.model';
import { createAccessToken, createRefreshToken, renewRefreshToken } from './Tokenize';

export class AuthService {
  private _userModel = User;
  private _refTokenModel = RefreshToken;

  public async register(body: CreateUserDto): Promise<User> {
    const userWithUsernameFound = await this._userModel.findOne({ username: body.username });;
    if (userWithUsernameFound) {
      throw new DUPLICATE_EXCEPTION('username is not available')
    }
    const newUser = new User({ ...body });
    const savedUser = await newUser.save();
    if (!savedUser) {
      throw new INTERNAL_SERVER_EXCEPTION('Failed to save user!');
    }
    return savedUser;
  }

  public async login(authDto: AuthDto): Promise<AuthResponse> {
    const { username, password, ipAddress } = authDto;
    const foundUser = await this._userModel.findOne({ username }) as User;
    if (!foundUser) {
      throw new WRONG_CREDENTIALS_EXCEPTION();
    }
    const passwordsMatched = await foundUser.validatePassword(password);
    if (!passwordsMatched) {
      throw new WRONG_CREDENTIALS_EXCEPTION();
    }
    const createdAccessToken = await createAccessToken(foundUser);
    if (!createdAccessToken) {
      throw 'Failed to generate access token';
    }
    const createdRefreshToken = await createRefreshToken(foundUser, ipAddress);
    if (!createdRefreshToken) {
      throw 'Failed to generate refresh token';
    }
    try {
      foundUser.set({ lastLoggedInAt: new Date().toISOString() });
      await foundUser.save();
      return {
        accessToken: createdAccessToken.token,
        refreshToken: createdRefreshToken.token,
      } as AuthResponse;
    } catch (error) {
      throw new INTERNAL_SERVER_EXCEPTION(error);
    }
  }

  public async refreshToken({ tokenStr, ipAddress }) {
    try {
      const { token: refreshToken, payload } = await renewRefreshToken(tokenStr, ipAddress);
      const { token: accessToken } = await createAccessToken(payload);
      if (!accessToken) {
        throw 'Failed to generate access token';
      }
      return <AuthResponse>{ refreshToken, accessToken };
    } catch (error) {
      throw new INTERNAL_SERVER_EXCEPTION(error);
    }
  }

  public async expireRefreshToken({ token, ipAddress }) {
    try {
      const refreshToken = await this._refTokenModel.findOne({ token });
      refreshToken.updatedByIp = ipAddress;
      await refreshToken.save();
    } catch (error) {
      throw new INTERNAL_SERVER_EXCEPTION(error);
    }
  }

  public async expireAllRefreshTokens(userId: string) {
    const foundUser = await this.getUserById(userId);
    if (!foundUser) {
      throw new NOT_FOUND_EXCEPTION('User not found');
    }
    try {
      await this._refTokenModel.deleteMany({ user: userId });
    } catch (error) {
      throw new INTERNAL_SERVER_EXCEPTION(error);
    }
  }

  public async getUserRefreshTokenList(userId: string) {
    const foundUser = await this.getUserById(userId);
    if (!foundUser) {
      throw new NOT_FOUND_EXCEPTION('User not found');
    }
    try {
      const refreshTokens = await this._refTokenModel
        .find({ user: foundUser._id } as any)
        .sort('created.ip');
      return refreshTokens;
    } catch (error) {
      throw new INTERNAL_SERVER_EXCEPTION(error);
    }
  }

  public async getUserById(userId: string) {
    return await this._userModel.findById(userId).select('-password');
  }
}
