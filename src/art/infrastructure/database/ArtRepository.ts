import { Connection } from "mysql2";
import * as ArtRepositoryInterface from "../../domain/repository/ArtRepository";
import { Styles } from "./../../domain/valueobject/Style";
require("dotenv").config();

import Image from "../../../images/domain/entity/Image";
import ImageUrl from "../../../images/domain/valuobject/ImageUrl";
import Specification from "../../../specification";
import Art from "../../domain/entity/Art";
import ArtSnapshot, { ArtSnapshots } from "../../domain/entity/ArtSnapshot";
import ArtworkDate from "../../domain/valueobject/ArtworkDate";
import Dimension from "../../domain/valueobject/Dimension";
import Slug from "../../domain/valueobject/Slug";
import Style from "../../domain/valueobject/Style";

export default class ArtRepository implements ArtRepositoryInterface.default {
  private _connection: Connection;
  constructor(connection: Connection) {
    this._connection = connection;
  }

  private _styles(_styles: Styles): string {
    let styles = "";
    for (let style of _styles) {
      if (styles !== "") {
        styles += ",";
      }
      styles += style.value;
    }
    return styles;
  }

  private _getArt(slug: Slug): Promise<Art | undefined> {
    return new Promise<Art | undefined>((resolve, reject) => {
      this._connection.query(
        `SELECT 
            slug, 
            title,
            description,
            series, 
            medium,
            material,
            BIN_TO_UUID(image_id) AS image_id, 
            original_url,
            alt,
            height,
            width,
            styles,
            art.created_at AS created_at,
            art.updated_at AS updated_at
        FROM art 
        JOIN images ON images.id = art.image_id 
        WHERE slug = ? LIMIT 1`,
        [slug.value],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get an art"));
          }
          if (result.length > 0) {
            let styles: Styles = [];
            if (result[0].styles.length > 1) {
              for (let style of result[0].styles.split(",")) {
                styles.push(new Style(style));
              }
            }
            resolve(
              new Art(
                slug,
                result[0].title,
                result[0].description,
                result[0].series,
                result[0].medium,
                result[0].material,
                new Image(new ImageUrl(result[0].original_url), result[0].alt),
                new Dimension(result[0].height, result[0].width),
                styles,
                new ArtworkDate(result[0].created_at, result[0].updated_at)
              )
            );
          }

          resolve(undefined);
        }
      );
    });
  }

  private _getRelatedArt(art: Art): Promise<ArtSnapshots> {
    return new Promise<ArtSnapshots>((resolve, reject) => {
      if (art.style.length <= 0) {
        resolve([]);
      }

      let styleQuery = "";
      let styleValues: string[] = [];

      for (let i = 0; i < art.style.length; i++) {
        if (styleQuery !== "") {
          styleQuery += " OR ";
        }
        styleQuery += "styles LIKE ?";

        if (i <= 0) {
          styleValues.push(`${art.style[i].value},%`);
        } else if (i >= art.style.length - 1) {
          styleValues.push(`%,${art.style[i].value}`);
        } else {
          styleValues.push(`%,${art.style[i].value},%`);
        }
      }

      this._connection.query(
        `SELECT 
          slug, 
          title, 
          series,
          height,
          width,
          original_url, 
          styles
        FROM art 
        JOIN images ON images.id = art.image_id
        WHERE slug != ? AND (${styleQuery})
        ORDER BY art.updated_at DESC LIMIT ?`,
        [art.slug.value, ...styleValues, Number(process.env.LIMIT_RELATED_ART)],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get an related art"));
          }

          let relatedArts: ArtSnapshots = [];

          if (result.length > 0) {
            for (let entry of result) {
              let styles: Styles = [];
              for (let style of entry.styles.split(",")) {
                styles.push(new Style(style));
              }
              let relatedArt = new ArtSnapshot(
                new Slug().rebuild(entry.slug),
                entry.title,
                entry.series,
                new Dimension(entry.height, entry.width),
                entry.original_url,
                styles
              );
              relatedArts.push(relatedArt);
            }
          }
          resolve(relatedArts);
        }
      );
    });
  }

  public countArt(specification: Specification): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._connection.query(
        "SELECT COUNT(slug) AS total FROM art WHERE title LIKE ?",
        [`%${specification.search}%`],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get an art"));
          }
          if (result.length > 0) {
            resolve(Number(result[0].total));
          }
        }
      );
    });
  }

  public countArtBySeries(
    specification: Specification,
    series: string
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._connection.query(
        "SELECT COUNT(slug) AS total FROM art WHERE title LIKE ? AND series = ?",
        [`%${specification.search}%`, series],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);

            reject(new Error("failed count articles by series"));
          }
          if (result.length > 0) {
            resolve(Number(result[0].total));
          }

          resolve(0);
        }
      );
    });
  }

  public getArt(slug: Slug): Promise<Art | undefined> {
    return new Promise<Art | undefined>(async (resolve, reject) => {
      try {
        let art: Art | undefined = await this._getArt(slug);

        if (!art) {
          resolve(undefined);

          return;
        }

        let relatedArt = await this._getRelatedArt(art);

        resolve(
          new Art(
            art.slug,
            art.title,
            art.description,
            art.series,
            art.medium,
            art.material,
            art.image,
            art.dimension,
            art.style,
            art.date,
            relatedArt
          )
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  public getArtBySeries(
    specification: Specification,
    series: string
  ): Promise<ArtSnapshots> {
    return new Promise<ArtSnapshots>((resolve, reject) => {
      let limit = Number(process.env.LIMIT_ART);
      let offset = (specification.page - 1) * limit;
      this._connection.query(
        `SELECT 
          slug, 
          title, 
          series, 
          height,
          width,
          styles,
          original_url 
        FROM art 
        JOIN images ON images.id = art.image_id 
        WHERE title LIKE ? 
        AND art.series = ?
        ORDER BY art.updated_at DESC LIMIT ?, ?`,
        [`%${specification.search}%`, series, offset, limit],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get an art"));
          }

          let artSnapshot: ArtSnapshots = [];

          if (result.length > 0) {
            for (let entry of result) {
              let styles: Styles = [];
              for (let style of entry.styles.split(",")) {
                styles.push(new Style(style));
              }
              let art = new ArtSnapshot(
                new Slug().rebuild(entry.slug),
                entry.title,
                entry.series,
                new Dimension(entry.height, entry.width),
                entry.original_url,
                styles
              );
              artSnapshot.push(art);
            }
          }
          resolve(artSnapshot);
        }
      );
    });
  }

  public getNewArt(): Promise<ArtSnapshots> {
    return new Promise<ArtSnapshots>((resolve, reject) => {
      this._connection.query(
        `SELECT
          slug,
          title,
          series,
          height,
          width,
          styles,
          original_url
        FROM art
        JOIN images ON images.id = art.image_id
        ORDER BY art.updated_at DESC LIMIT ?
      `,
        [Number(process.env.LIMIT_NEW_ART)],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get new art work"));
          }
          let newArtwork: ArtSnapshots = [];
          if (result.length > 0) {
            for (let entry of result) {
              let styles: Styles = [];
              for (let style of entry.styles.split(",")) {
                styles.push(new Style(style));
              }
              let newArt = new ArtSnapshot(
                new Slug().rebuild(entry.slug),
                entry.title,
                entry.series,
                new Dimension(entry.height, entry.width),
                entry.original_url,
                styles
              );
              newArtwork.push(newArt);
            }
          }
          resolve(newArtwork);
        }
      );
    });
  }

  public getArts(specification: Specification): Promise<ArtSnapshots> {
    return new Promise<ArtSnapshots>((resolve, reject) => {
      let limit = Number(process.env.LIMIT_ART);
      let offset = (specification.page - 1) * limit;

      this._connection.query(
        `SELECT 
            slug,
            title,
            series,
            height,
            width,
            styles,
            original_url
            FROM art 
            JOIN images ON images.id = art.image_id 
            WHERE title like ?
            ORDER BY art.updated_at DESC LIMIT ?, ?`,
        [`%${specification.search}%`, offset, limit],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed get an art"));
          }

          let artSnapshot: ArtSnapshots = [];

          if (result.length > 0) {
            for (let entry of result) {
              let styles: Styles = [];
              for (let style of entry.styles.split(",")) {
                styles.push(new Style(style));
              }
              let art = new ArtSnapshot(
                new Slug().rebuild(entry.slug),
                entry.title,
                entry.series,
                new Dimension(entry.height, entry.width),
                entry.original_url,
                styles
              );
              artSnapshot.push(art);
            }
          }
          resolve(artSnapshot);
        }
      );
    });
  }

  public saveArt(art: Art): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        `INSERT INTO art (
          slug, 
          title, 
          description, 
          height, 
          width, 
          series, 
          medium,
          material, 
          styles,
          image_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?))`,
        [
          art.slug.value,
          art.title,
          art.description,
          art.dimension.height,
          art.dimension.width,
          art.series,
          art.medium,
          art.material,
          this._styles(art.style),
          art.image.id,
        ],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);
            reject(new Error("failed save an Art"));
          }
          resolve(result);
        }
      );
    });
  }
  public updateArt(art: Art): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        `UPDATE art SET title = ?, description = ?, series = ?, medium = ?, material = ?, image_id = UUID_TO_BIN(?), dimension = ?, styles = ? WHERE slug = ?`,
        [
          art.title,
          art.description,
          art.series,
          art.medium,
          art.material,
          art.image.id,
          art.dimension,
          this._styles(art.style),
          art.slug.value,
        ],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);

            reject(new Error("failed update an art"));
          }
          resolve(result);
        }
      );
    });
  }
  public deleteArt(slug: Slug): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._connection.query(
        `DELETE FROM art WHERE slug = ?`,
        [slug.value],
        (err: any | null, result: any) => {
          if (err) {
            console.error(err);

            reject(new Error("failed delete an art"));
          }

          resolve(result);
        }
      );
    });
  }
}
