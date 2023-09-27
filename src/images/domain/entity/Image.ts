import ImageUrl from "../valuobject/ImageUrl";
import { v4 as uuidv4 } from "uuid";
export default class Image {
  private _id: string;
  private _url: ImageUrl;
  private _alt: string;
  constructor(url: ImageUrl, alt: string, id?: string) {
    if (alt === "") {
      throw new Error("alt cannot be empty");
    }
    this._id = uuidv4();
    this._url = url;
    this._alt = alt;

    if (id !== undefined && id !== "") {
      this._id = id;
    }
  }

  get id(): string {
    return this._id;
  }

  get url(): ImageUrl {
    return this._url;
  }

  get alt(): string {
    return this._alt;
  }
}
export type Images = Image[];
