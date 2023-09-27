import {
  art,
  description,
  dimension,
  image,
  media,
  series,
  title,
} from "../../../testdata";
import Art from "./Art";
describe("Art", () => {
  it("should have a slug based on the art title", () => {
    expect(art.slug.value).toMatch("/^this-is-title-[a-f0-9]+/");
  });

  it("should have title, description, series, media, dimension, image, date", () => {
    expect(art.title).toEqual(title);
    expect(art.description).toEqual(description);
    expect(art.series).toEqual(series);
    expect(art.media).toEqual(media);
    expect(art.image).toEqual(image);
    expect(art.dimension).toEqual(dimension);
    expect(art.date).toBeDefined();
  });

  it("should have predefined title, description, series, media, dimension, image, date", () => {
    let buildArt: Art = new Art(
      art.slug,
      art.title,
      art.description,
      art.series,
      art.media,
      art.image,
      art.dimension,
      art.date
    );

    expect(buildArt.title).toEqual(title);
    expect(buildArt.description).toEqual(description);
    expect(buildArt.series).toEqual(series);
    expect(buildArt.media).toEqual(media);
    expect(buildArt.image).toEqual(image);
    expect(buildArt.dimension).toEqual(dimension);
    expect(buildArt.date).toBeDefined();
  });
});
