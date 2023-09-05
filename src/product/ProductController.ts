import { Request, Response, Router } from "express";
import Middleware from "../Middleware";
import ProductsModels from "./ProductsModels";
import Status from "../Status";
import { body, validationResult } from "express-validator";

export default class ProductControllers {
  public static router(): Router {
    const router: Router = Router();

    // get product
    router.get("/product", async (req: Request, res: Response) => {
      try {
        const product = await ProductsModels.find().populate("images");
        if (!product) {
          return res.status(400).json({
            status: Status.Fail,
            message: "Product tidak ditemukan",
          });
        }
        return res.status(200).json({
          status: Status.Success,
          product,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          status: Status.Error,
        });
      }
    });

    // get product by slug
    router.get(
      "/product/:slug",
      [Middleware.authentication, Middleware.authenticationRole("admin")],
      async (req: Request, res: Response) => {
        try {
          const product = await ProductsModels.find({
            slug: req.params.slug,
          }).populate("images");
          
          if (!product) {
            return res.status(500).json({
              message: "Product tidak ditemukan",
            });
          }
          return res.status(200).json({
            message: "success",
            product,
          });
        } catch (error) {
          res.status(500).json({
            status: Status.Error,
          });
        }
      }
    );

    // create product
    router.post(
      "/product",
      [Middleware.authentication, Middleware.authenticationRole("admin")],
      body("title").notEmpty().withMessage("Title is required"),
      body("price").notEmpty().withMessage("Price is required"),
      body("gender").notEmpty().withMessage("Gender is required"),
      body("category").notEmpty().withMessage("Category is required"),
      body("description").notEmpty().withMessage("Description is required"),
      body("images").notEmpty().withMessage("Image is required"),
      body("is_active").notEmpty().withMessage("Is_Active is required"),
      body("availableSize")
        .notEmpty()
        .withMessage("Available Size is required"),
      async (req: Request, res: Response) => {
        try {
          const {
            title,
            price,
            gender,
            category,
            description,
            images,
            is_active,
            availableSize,
          } = req.body;

          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(428).json({
              status: Status.Fail,
              error: errors.array(),
            });
          }
          // product exist
          const productExist = await ProductsModels.findOne({ title });
          if (productExist) {
            return res.status(428).json({
              status: Status.Fail,
              message: "Product is exist",
            });
          }
          const stok = availableSize.reduce(
            (total: number, size: any) => total + size.quantity,
            0
          );

          const slug = title
            .toLowerCase() // Convert to lowercase
            .replace(/[^a-zA-Z0-9]+/g, "-") // Replace non-alphanumeric characters with '-'
            .replace(/^-+|-+$/g, "") // Remove leading and trailing '-'
            .trim();

          const newProduct = new ProductsModels({
            slug,
            title,
            price,
            stock: stok,
            description,
            gender,
            category,
            images,
            is_active,
            availableSize,
          });

          const data = await newProduct.save();
          if (!data) {
            throw new Error("failed");
          }

          return res.status(200).json({
            status: Status.Success,
            data,
          });
        } catch (error) {
          return res.status(500).json({
            status: Status.Error,
          });
        }
      }
    );

    // update product
    router.put(
      "/product",
      [Middleware.authentication, Middleware.authenticationRole("admin")],
      async (req: Request, res: Response) => {}
    );

    // delete product
    router.delete(
      "/product",
      [Middleware.authentication, Middleware.authenticationRole("admin")],
      async (req: Request, res: Response) => {}
    );
    return router;
  }
}
