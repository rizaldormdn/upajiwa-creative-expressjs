export default class Specification {
  private _search: string;
  private _page: number;

  constructor(search: string, page: number) {
    this._search = search;
    this._page = page;
  }
  get search(): string {
    return this._search;
  }
  get page(): number {
    return this._page;
  }
}
