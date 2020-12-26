import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

import { DUPLICATE_EXCEPTION, INTERNAL_SERVER_EXCEPTION, WRONG_CREDENTIALS_EXCEPTION } from '../exception';
import { CreateUserDto, User, userModel } from '../user';
import { LogInDto } from './login.dto';
import { generateAccessToken, generateRefreshToken } from './Tokenize';

export class AuthService {
  private _userModel = userModel;

  public async register(body: CreateUserDto): Promise<{ user: User }> {
    const userWithUsernameFound = await this._userModel.findOne({ username: body.username });

    if (userWithUsernameFound) {
      throw new DUPLICATE_EXCEPTION(body.username);
    }

    const hashedPassword = await bcryptHash(body.password, 10);
    const newUser = new userModel({ ...body, password: hashedPassword });
    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new INTERNAL_SERVER_EXCEPTION('Failed to save user!');
    }

    return { user: savedUser };
  }

  public async login(body: LogInDto): Promise<AuthResponse> {

    const foundUser = await this._userModel.findOne({ username: body.username }) as User;
    const passwordsMatched: boolean = await bcryptCompare(body.password, foundUser.password);

    if (!foundUser || !passwordsMatched) {
      throw new WRONG_CREDENTIALS_EXCEPTION();
    }

    try {
      const accessTokenStr = await generateAccessToken(foundUser);
      const refreshTokenObj = await generateRefreshToken(foundUser, body.ipAddress);

      if (!accessTokenStr || !refreshTokenObj) {
        throw 'Failed to generate tokens';
      }

      foundUser.set({ lastLoggedInAt: new Date().toISOString() });
      await foundUser.save();

      return { accessToken: accessTokenStr, refreshToken: refreshTokenObj.token };
    } catch (error) {
      throw error;
    }
  }
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}