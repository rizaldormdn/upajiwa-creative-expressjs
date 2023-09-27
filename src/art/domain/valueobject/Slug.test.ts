import Slug from "./Slug";

describe("Slug", () => {
  it("should have a correct value", () => {
    let slug: Slug = new Slug("this is title");
    expect(slug.value).toContain("this-is-title");
  });

  it("could rebuild", () => {
    let slug: Slug = new Slug().rebuild("this-is-title");
    expect(slug.value).toContain("this-is-title");
  });
});
