import Dimension from "../valueobject/Dimension";
import Slug from "../valueobject/Slug";
import { Styles } from "../valueobject/Style";

export default class ArtSnapshot {
  private _slug: Slug;
  private _title: string;
  private _series: string;
  private _dimension: Dimension;
  private _originalURL: string;
  private _styles: Styles;
  constructor(
    slug: Slug,
    title: string,
    series: string,
    dimension: Dimension,
    original_url: string,
    styles: Styles
  ) {
    if (title === "") {
      throw new Error("Title cannot be empty");
    }
    if (series === "") {
      throw new Error("Series cannot be empty");
    }

    this._slug = slug;
    this._title = title;
    this._series = series;
    this._dimension = dimension;
    this._originalURL = original_url;
    this._styles = styles;
  }

  public get slug(): Slug {
    return this._slug;
  }
  public get title(): string {
    return this._title;
  }
  public get series(): string {
    return this._series;
  }
  public get dimension(): Dimension {
    return this._dimension;
  }
  public get originalURL(): string {
    return this._originalURL;
  }
  public get styles(): Styles {
    return this._styles;
  }
}
export type ArtSnapshots = ArtSnapshot[];
