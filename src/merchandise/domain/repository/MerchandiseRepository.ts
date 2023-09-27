import Merchandise from "../entity/Merchandise";
import Slug from "../valueobject/Slug";

export default interface MerchandiseRepository {
  getMerchandise(slug: Slug): Promise<Merchandise | undefined>;
  saveMerchandise(merchandise: Merchandise): Promise<void>;
}
