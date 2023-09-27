import { Connection } from "mysql2";
import * as MerchandiseRepositoryInterface from "../../domain/repository/MerchandiseRepository";
import Merchandise from "../../domain/entity/Merchandise";
import Slug from "../../domain/valueobject/Slug";
import Image from "../../../images/domain/entity/Image";
import ImageUrl from "../../../images/domain/valuobject/ImageUrl";

export default class MerchandiseRepository
  implements MerchandiseRepositoryInterface.default
{
  private _connection: Connection;
  constructor(connection: Connection) {
    this._connection = connection;
  }
  private _getMerchandise(slug: Slug): Promise<Merchandise | undefined> {
    return new Promise<Merchandise | undefined>((resolve, reject) => {
      this._connection.query(
        "SELECT slug, title, description, BIN_TO_UUID(image_id) AS image_id, original_url, alt FROM merchandise JOIN images ON images.id = merchandise.image_id WHERE slug = ?",
        [slug.value],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get an merchandise"));
          }
          resolve(
            new Merchandise(
              slug,
              result[0].title,
              result[0].description,
              new Image(new ImageUrl(result[0].original_url), result[0].alt)
            )
          );
          resolve(undefined);
        }
      );
    });
  }
  public getMerchandise(slug: Slug): Promise<Merchandise | undefined> {
    return new Promise<Merchandise | undefined>(async (resolve, reject) => {
      try {
        let merchandise: Merchandise | undefined = await this._getMerchandise(
          slug
        );
        if (!merchandise) {
          return resolve(undefined);
        }
        resolve(
          new Merchandise(
            merchandise.slug,
            merchandise.title,
            merchandise.description,
            merchandise.image
          )
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  public saveMerchandise(merchandise: Merchandise): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        "INSERT INTO merchandise (slug, title, description, image_id) VALUES (?, ?, ?, UUID_TO_BIN(?))",
        [
          merchandise.slug.value,
          merchandise.title,
          merchandise.description,
          merchandise.image.id,
        ],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed save an merchandise"));
          }
          resolve(result);
        }
      );
    });
  }
}
