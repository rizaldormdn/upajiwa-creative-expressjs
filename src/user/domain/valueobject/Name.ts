export default class Name {
  private _first_name: string;
  private _last_name: string;
  constructor(firstName: string, lastName: string = "") {
    this._first_name = firstName;
    this._last_name = lastName;
  }

  public get first(): string {
    return this._first_name;
  }

  public get last(): string {
    return this._last_name;
  }

  public full(): string {
    if (this._last_name === "") {
      return this._first_name;
    }
    return this._first_name + " " + this._last_name;
  }
}
