export default class Content {
  private _title: string;
  private _description: string;
  constructor(title: string, description: string) {
    this._title = title;
    this._description = description;

    if (title === "") {
      throw new Error("title cannot be empty");
    }
    if (description === "") {
      throw new Error("description cannot be empty");
    }
  }
  public get title(): string {
    return this._title;
  }
  public get description(): string {
    return this._description;
  }
}
