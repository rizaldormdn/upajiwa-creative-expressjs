import Dimension from "./Dimension";

type dimension = {
  height: number;
  width: number;
};

describe("Constructor", () => {
  test("should set height and width correctly", () => {
    const rectangle = new Dimension(10, 20);

    expect(rectangle.height).toEqual(10);
    expect(rectangle.width).toEqual(20);
  });

  test("invalid dimensions", () => {
    let invalidDimensions: dimension[] = [
      {
        height: 0,
        width: 0,
      },
      {
        height: 0,
        width: 10,
      },
      {
        height: 10,
        width: 0,
      },
    ];

    for (let invalidDimension of invalidDimensions) {
      expect(
        () => new Dimension(invalidDimension.height, invalidDimension.width)
      ).toThrowError();
    }
  });
});

describe("Getters", () => {
  let rectangle: Dimension;

  beforeEach(() => {
    rectangle = new Dimension(10, 20);
  });

  test("should return the correct height", () => {
    expect(rectangle.height).toEqual(10);
  });

  test("should return the correct width", () => {
    expect(rectangle.width).toEqual(20);
  });
});
