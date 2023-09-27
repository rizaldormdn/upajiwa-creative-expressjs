import Image from "../../../images/domain/entity/Image";
import ArtworkDate from "../valueobject/ArtworkDate";
import Dimension from "../valueobject/Dimension";
import Slug from "../valueobject/Slug";
import { Styles } from "../valueobject/Style";
import { ArtSnapshots } from "./ArtSnapshot";

export default class Art {
  private _slug: Slug;
  private _title: string;
  private _description: string;
  private _series: string;
  private _medium: string;
  private _material: string;
  private _image: Image;
  private _dimension: Dimension;
  private _style: Styles = [];
  private _relatedArt: ArtSnapshots = [];
  private _date: ArtworkDate = new ArtworkDate();
  constructor(
    slug: Slug,
    title: string,
    description: string,
    series: string,
    medium: string,
    material: string,
    image: Image,
    dimension: Dimension,
    style?: Styles,
    date?: ArtworkDate,
    relatedArt?: ArtSnapshots
  ) {
    if (title === "") {
      throw new Error("Title cannot be empty");
    }
    if (description === "") {
      throw new Error("Description cannot be empty");
    }
    if (series === "") {
      throw new Error("Series cannot be empty");
    }
    if (medium === "") {
      throw new Error("Media cannot be empty");
    }
    if (material === "") {
      throw new Error("Material cannot be empty");
    }
    if (style !== undefined) {
      this._style = style;
    }
    if (relatedArt !== undefined) {
      this._relatedArt = relatedArt;
    }
    if (date !== undefined) {
      this._date = date;
    }

    this._slug = slug;
    this._title = title;
    this._description = description;
    this._series = series;
    this._medium = medium;
    this._material = material;
    this._image = image;
    this._dimension = dimension;
  }

  public get slug(): Slug {
    return this._slug;
  }

  public get title(): string {
    return this._title;
  }

  public get description(): string {
    return this._description;
  }

  public get series(): string {
    return this._series;
  }

  public get medium(): string {
    return this._medium;
  }

  public get material(): string {
    return this._material;
  }

  public get style(): Styles {
    return this._style;
  }

  public get relatedArt(): ArtSnapshots {
    return this._relatedArt.slice(0, 4);
  }

  public get image(): Image {
    return this._image;
  }

  public get dimension(): Dimension {
    return this._dimension;
  }

  public get date(): ArtworkDate {
    return this._date;
  }
}
