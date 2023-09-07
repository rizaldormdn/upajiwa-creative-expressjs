require("dotenv").config();
import crypto from "crypto";

export default class ResetPasswordToken {
  private _token: string;
  private _tokenExpiry: Date;
  constructor(token?: string, tokenExpiry?: Date) {
    this._token = crypto.randomBytes(48).toString("hex");
    if (token !== undefined && token !== "") {
      this._token = String(token);
    }
    this._tokenExpiry = new Date();
    this._tokenExpiry.setHours(
      this._tokenExpiry.getHours() +
        Number(process.env.RESET_PASSWORD_EXPIRATION)
    );
    if (tokenExpiry !== undefined) {
      this._tokenExpiry = tokenExpiry;
    }
  }

  public get token(): string {
    return this._token;
  }

  public get tokenExpiry(): Date {
    return this._tokenExpiry;
  }

  public isValid(): boolean {
    if (new Date() > this._tokenExpiry) {
      return false;
    }
    return true;
  }
}
