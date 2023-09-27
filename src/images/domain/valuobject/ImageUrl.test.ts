import { url } from "../../../testdata";
import ImageUrl from "./ImageUrl";

describe("ImageUrl", () => {
  it("should have original URL", () => {
    let imageURL: ImageUrl = new ImageUrl("http://example.com/original.jpg");
    expect(imageURL.original).toBe("http://example.com/original.jpg");
  });
});
