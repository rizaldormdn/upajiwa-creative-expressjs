import Email from "../valueobject/Email";
import Name from "../valueobject/Name";
import Password from "../valueobject/Password";
import ResetPasswordToken from "../valueobject/ResetPasswordToken";

export default class User {
  protected _name: Name;
  protected _email: Email;
  protected _isAdministrator: boolean = false;
  protected _password?: Password;
  protected _resetPasswordToken?: ResetPasswordToken;

  constructor(
    name: Name,
    email: Email,
    isAdministrator?: boolean,
    password?: Password,
    resetPasswordToken?: ResetPasswordToken
  ) {
    this._name = name;
    this._email = email;
    this._password = password;
    this._resetPasswordToken = resetPasswordToken;

    if (isAdministrator !== undefined) {
      this._isAdministrator = isAdministrator;
    }
  }

  public get name(): Name {
    return this._name;
  }

  public get email(): Email {
    return this._email;
  }

  public changeName(name: Name) {
    this._name = name;
  }

  public get password(): Password | undefined {
    return this._password;
  }

  public updatePassword(password: Password) {
    this._password = password;
  }

  public get resetPasswordToken(): ResetPasswordToken | undefined {
    return this._resetPasswordToken;
  }

  public clearResetPasswordToken() {
    this._resetPasswordToken = undefined;
  }

  public get isAdministrator(): boolean {
    return this._isAdministrator;
  }
}
