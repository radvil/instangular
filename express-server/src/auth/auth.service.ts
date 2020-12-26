import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

import { DUPLICATE_EXCEPTION, INTERNAL_SERVER_EXCEPTION, WRONG_CREDENTIALS_EXCEPTION } from '../exception';
import { CreateUserDto, User, userModel } from '../user';
import { LogInDto } from './login.dto';

export class AuthService {
  private _userModel = userModel;

  public async register(body: CreateUserDto): Promise<{user: User}> {
    const userWithEmailFound = await this._userModel.findOne({ email: body.email });

    if (userWithEmailFound) {
      throw new DUPLICATE_EXCEPTION(body.email);
    }

    const hashedPassword = await bcryptHash(body.password, 10);
    const newUser = new userModel({ ...body, password: hashedPassword });
    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new INTERNAL_SERVER_EXCEPTION('Failed to save user!');
    }

    return { user: savedUser };
  }

  public async login(body: LogInDto): Promise<{user: User}> {
    const foundUser = await this._userModel.findOne({ email: body.email }) as User;
    const passwordsMatched: boolean = await bcryptCompare(body.password, foundUser.password);

    if (!passwordsMatched) {
      throw new WRONG_CREDENTIALS_EXCEPTION();
    }

    return { user: foundUser };
  }
}