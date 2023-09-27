export default class Style {
  private _value: string;
  constructor(value: string) {
    this._value = value.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  }
  public get value(): string {
    return this._value;
  }
}
export type Styles = Style[];
