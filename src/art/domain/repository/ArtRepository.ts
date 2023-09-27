import Specification from "../../../specification";
import { ArtSnapshots } from "../entity/ArtSnapshot";
import Art from "../entity/Art";
import Slug from "../valueobject/Slug";

export default interface ArtRepository {
  getNewArt(): Promise<ArtSnapshots>;
  getArt(slug: Slug): Promise<Art | undefined>;
  getArts(specification: Specification): Promise<ArtSnapshots>;
  saveArt(art: Art): Promise<void>;
  updateArt(art: Art): Promise<void>;
  deleteArt(slug: Slug): Promise<void>;
  countArt(specification: Specification): Promise<number>;
  countArtBySeries(
    specification: Specification,
    series: string
  ): Promise<number>;
  getArtBySeries(
    specification: Specification,
    series: string
  ): Promise<ArtSnapshots>;
}
