export default class ImageUrl {
  private _original: string;

  constructor(original: string) {
    if (original === "") {
      console.log("original url cannot be empty");
    }
    this._original = original;
  }
  public get original(): string {
    return this._original;
  }
}
