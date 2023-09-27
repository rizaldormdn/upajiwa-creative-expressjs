import { alt, image, url } from "../../../testdata";
import Image from "./Image";

describe("image", () => {
  it("should have unique id", () => {
    let image: Image = new Image(url, alt);

    expect(image.id).toBeDefined();
    expect(typeof image.id).toBe("string");
  });

  it("should have a defined id", () => {
    let id = "abc123";
    let image = new Image(url, alt, id);

    expect(image.id).toBe(id);
  });

  it("should have image url", () => {
    expect(image.url).toBe(url);
  });

  it("should have alt", () => {
    expect(image.alt).toBe(alt);
    expect(() => new Image(url, ""));
  });
});
