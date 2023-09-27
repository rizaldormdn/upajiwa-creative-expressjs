import Merchandise from "./../../domain/entity/Merchandise";

export type MerchandiseJSON = {
  slug: string;
  title: string;
  description: string;
  image: {
    id: string;
    url: {
      original: string;
    };
    alt: string;
  };
};

export default class MerchandiseMapper {
  public static toJSON(merchandise: Merchandise): MerchandiseJSON {
    return {
      slug: merchandise.slug.value,
      title: merchandise.title,
      description: merchandise.description,
      image: {
        id: merchandise.image.id,
        url: {
          original: merchandise.image.url.original,
        },
        alt: merchandise.image.alt,
      },
    };
  }
}
