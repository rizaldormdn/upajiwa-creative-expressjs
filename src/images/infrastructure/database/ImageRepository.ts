import { Connection } from "mysql2";
import * as ImageRepositoryInterface from "../../domain/repository/imageRepository";
import Specification from "../../../specification";
import Image, { Images } from "../../domain/entity/Image";
import ImageUrl from "../../domain/valuobject/ImageUrl";

export default class ImageRepository
  implements ImageRepositoryInterface.default
{
  private _connection: Connection;
  constructor(connection: Connection) {
    this._connection = connection;
  }

  public countImages(specification: Specification): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._connection.query(
        `SELECT COUNT(id) AS total FROM images WHERE alt LIKE ?`,
        [`%${specification.search}%`],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);

            reject(new Error("failed count images"));
          }
          if (result.length > 0) {
            resolve(Number(result[0].total));
          }
          resolve(0);
        }
      );
    });
  }

  public getImages(specification: Specification): Promise<Images> {
    return new Promise<Images>((resolve, reject) => {
      let limit = Number(process.env.LIMIT_IMAGES);
      let offset: number = (specification.page - 1) * limit;
      this._connection.query(
        `SELECT BIN_TO_UUID(id) AS id, original_url, alt FROM images WHERE alt LIKE ? ORDER BY images.updated_at DESC LIMIT ?, ?`,
        [`%${specification.search}%`, offset, limit],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);

            reject(new Error("failed get images"));
          }
          let images: Images = [];
          if (result.length > 0) {
            for (let entry of result) {
              images.push(
                new Image(new ImageUrl(entry.original_url), entry.alt, entry.id)
              );
            }
          }
          resolve(images);
        }
      );
    });
  }

  public getImage(id: string): Promise<Image | undefined> {
    return new Promise<Image | undefined>((resolve, reject) => {
      this._connection.query(
        "SELECT original_url, alt FROM images WHERE BIN_TO_UUID(id) = ? LIMIT 1",
        [id],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get image"));
          }
          if (result.length > 0) {
            resolve(
              new Image(new ImageUrl(result[0].original_url), result[0].alt, id)
            );
          }
          resolve(undefined);
        }
      );
    });
  }

  public saveImage(image: Image): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        "INSERT INTO images (id, original_url, alt) VALUES (UUID_TO_BIN(?), ?, ?)",
        [image.id, image.url.original, image.alt],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed save an image"));
          }
          resolve(result);
        }
      );
    });
  }
}
