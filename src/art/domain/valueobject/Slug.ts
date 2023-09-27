import crypto from "crypto";

export default class Slug {
  private _value: string = "";
  constructor(title?: string) {
    if (title !== undefined) {
      this._value =
        title.toLowerCase().replace(/\s+/g, "-") +
        "-" +
        crypto.randomBytes(6).toString("hex");
    }
  }
  public get value(): string {
    return this._value;
  }
  public rebuild(value: string): Slug {
    this._value = value;
    return this;
  }
}
