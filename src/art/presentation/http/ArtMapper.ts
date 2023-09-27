import { ArtSnapshots } from "../../domain/entity/ArtSnapshot";
import Art from "../../domain/entity/Art";
import { Styles } from "../../domain/valueobject/Style";

export type ArtJSON = {
  slug: string;
  title: string;
  description: string;
  series: string;
  detail: {
    medium: string;
    material: string;
    style: string[];
    size: {
      height: number;
      width: number;
    };
  };
  image: {
    id: string;
    url: {
      original: string;
    };
    alt: string;
  };
  related_art: ArtsJSON[];
  date: {
    created_at: Date;
    updated_at: Date;
  };
};

export type ArtsJSON = {
  slug: string;
  title: string;
  series: string;
  dimension: {
    height: number;
    width: number;
  };
  originalURL: string;
  style: string[];
};

export class StyleMapper {
  public static toJSON(styles: Styles): string[] {
    let stylesJSON: string[] = [];

    for (let style of styles) {
      stylesJSON.push(style.value);
    }

    return stylesJSON;
  }
}

export default class ArtMapper {
  public static toJSON(art: Art): ArtJSON {
    return {
      slug: art.slug.value,
      title: art.title,
      description: art.description,
      series: art.series,
      detail: {
        medium: art.medium,
        material: art.material,
        style: StyleMapper.toJSON(art.style),
        size: {
          height: art.dimension.height,
          width: art.dimension.width,
        },
      },
      image: {
        id: art.image.id,
        alt: art.image.alt,
        url: {
          original: art.image.url.original,
        },
      },
      related_art: ArtsMapper.toJSON(art.relatedArt),
      date: {
        created_at: art.date.createdAt,
        updated_at: art.date.updatedAt,
      },
    };
  }
}

export class ArtsMapper {
  public static toJSON(artSnapshot: ArtSnapshots): ArtsJSON[] {
    let artsJSON: ArtsJSON[] = [];

    for (let art of artSnapshot) {
      artsJSON.push({
        slug: art.slug.value,
        title: art.title,
        series: art.series,
        dimension: {
          height: art.dimension.height,
          width: art.dimension.width,
        },
        originalURL: art.originalURL,
        style: StyleMapper.toJSON(art.styles),
      });
    }

    return artsJSON;
  }
}
