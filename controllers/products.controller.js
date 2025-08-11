import { validationResult } from "express-validator";
import Product from "../model/product.model.js";
import httpStatusText from "../utils/httpStatusText.js";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import appError from "../utils/appError.js";

export const getAllProducts = asyncWrapper(async (req, res) => {
  const { title, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const query = {};

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    query.price = {};
    if (!isNaN(minPrice)) query.price.$gte = Number(minPrice);
    if (!isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
  }

  const [products, total] = await Promise.all([
    Product.find(query, { __v: 0 })
      .limit(limitNum)
      .skip(skip)
      .lean()
      .then((docs) =>
        docs.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }))
      ),
    ,
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      products,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        lastPage: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    },
  });
});

export const getSingleProduct = asyncWrapper(async (req, res, next) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);

  if (!product) {
    const error = appError.create(
      "product not found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.json({ status: httpStatusText.SUCCESS, data: { product } });
});

export const addNewProduct = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);

  console.log(req.file);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 404, httpStatusText.FAIL);

    return next(error);
  }

  const { title, description, price, hasDiscount, discountPercentage } =
    req.body;

  const parsedHasDiscount =
    hasDiscount === "true" || hasDiscount === "1" ? true : false;
  const parsedDiscountPercentage = Number(discountPercentage);

  const newProduct = await Product.create({
    title,
    description,
    price,
    image: req.file.filename,
    hasDiscount: parsedHasDiscount,
    discountPercentage: parsedDiscountPercentage,
  });

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { product: newProduct } });
});

export const updateProduct = asyncWrapper(async (req, res, next) => {
  const productId = req.params.productId;
  const productContent = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    const error = appError.create(
      "product not found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const productUpdated = await Product.updateOne(
    { _id: product },
    { $set: productContent }
  );

  return res.status(200).json(productUpdated);
});

export const deleteProduct = asyncWrapper(async (req, res, next) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);

  if (!product) {
    const error = appError.create(
      "product not found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  await Product.deleteOne({ _id: productId });

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});
