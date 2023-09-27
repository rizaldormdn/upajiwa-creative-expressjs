import Specification from "../../../specification";
import Image, { Images } from "../entity/Image";

export default interface ImageRepository {
  countImages(specification: Specification): Promise<number>;
  getImage(id: string): Promise<Image | undefined>;
  getImages(specification: Specification): Promise<Images>;
  saveImage(image: Image): Promise<void>;
}
