import * as EmailValidator from "email-validator";

export default class Email {
  private _local: string;
  private _domain: string;

  constructor(email: string) {
    if (!EmailValidator.validate(email)) {
      throw new Error("Email is invalid");
    }

    const emailParts = email.split("@");
    this._local = emailParts.slice(0, emailParts.length - 1).join();
    this._domain = emailParts[emailParts.length - 1];
  }

  public get local(): string {
    return this._local;
  }

  public get domain(): string {
    return this._domain;
  }

  public toString(): string {
    return this._local + "@" + this._domain;
  }
}
