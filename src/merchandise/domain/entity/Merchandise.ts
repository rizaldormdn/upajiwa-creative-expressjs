import Image from "../../../images/domain/entity/Image";
import Slug from "../valueobject/Slug";

export default class Merchandise {
  private _slug: Slug;
  private _title: string;
  private _description: string;
  private _image: Image;
  constructor(slug: Slug, title: string, description: string, image: Image) {
    if (title === "") {
      throw new Error("title cannot be empty");
    }
    if (description === "") {
      throw new Error("description cannot be empty");
    }

    this._slug = slug;
    this._title = title;
    this._description = description;
    this._image = image;
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
  public get image(): Image {
    return this._image;
  }
}
export type Merchandises = Merchandise[];
