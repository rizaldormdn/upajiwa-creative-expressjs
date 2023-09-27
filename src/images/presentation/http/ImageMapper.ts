import Image, { Images } from "../../domain/entity/Image";

export type ImageJSON = {
  id: string;
  url: {
    original: string;
  };
  alt: string;
};

export type ImagesJSON = ImageJSON[];

export class ImagesMapper {
  public static toJSON(images: Images): ImagesJSON {
    let imagesJSON: ImagesJSON = [];

    for (let image of images) {
      imagesJSON.push({
        id: image.id,
        url: {
          original: image.url.original,
        },
        alt: image.alt,
      });
    }

    return imagesJSON;
  }
}

export default class ImageMapper {
  public static toJSON(image: Image): ImageJSON {
    return {
      id: image.id,
      url: {
        original: image.url.original,
      },
      alt: image.alt,
    };
  }
}
