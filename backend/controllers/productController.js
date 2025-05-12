import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import dotenv from 'dotenv'
import orderModel from "../models/orderModel.js";
dotenv.config();
//payment Geteway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required " });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required " });
      case !quantity:
        return res.status(400).send({ error: "Quantity is Required " });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and Should be less then 1MB" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.contentType = photo.type;
    }
    await products.save();

    return res.status(200).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      error,
      message: "Error in creating Product ",
    });
  }
};

//get Product

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      // .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messageP: "Error While getting Products",
      error,
    });
  }
};

//Get Single Product

export const singleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Featch Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error While Getting Single Product",
      error,
    });
  }
};

//Produt Photo controller

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Product Photo",
      error,
    });
  }
};

//Delete Product Controller

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    return res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Deleting Product",
      error,
    });
  }
};

//Update Product Controller

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required " });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required " });
      case !quantity:
        return res.status(400).send({ error: "Quantity is Required " });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ error: "photo is Required and Should be less then 1MB" });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.contentType = photo.type;
    }
    await products.save();

    return res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error while Updating Product",
      error,
    });
  }
};

//Filter Product Controller
export const productFiltersController = async (req, res) => {
  try {

    const { checked, radio } = req.body
    let args = {}
    if (checked.length > 0) args.category = checked
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
    const products = await productModel.find(args)
    res.status(200).send({
      success: true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While  Filtering products",
      error
    })
  }
}

//product count 
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success: true,
      total,
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Product Count",
      error,
      success: false
    })
  }
}

//proudct list base on page

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1
    const products = await productModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Product per page Count",
      error
    })
  }
}


//Search Product Controller

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: 'i' } }
      ],
    }).select("_photo name slug description price category quantity shipping _id");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Search product ",
      error
    })

  }
}

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params
    const products = await productModel.find({
      category: cid,
      _id: { $ne: pid }
    }).select('-photo').limit(3).populate('category')
    res.status(200).send({
      success: true,
      products,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while fetching Related Product',
      error
    })
  }
}

export const proudctCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug })
    const products = await productModel.find({ category }).populate('category')
    res.status(200).send({
      success: true,
      category,
      products,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Fetching Category Wise Product",
      error
    })
  }

}

//payment geteway API
//token
export const barintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    })

  } catch (error) {
    console.log(error);
  }
}

//payment

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body
    let total = 0;
    cart.map(i => { total += i.price; });
    let newTransection = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      },
    },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save()
          res.json({ ok: true })
        } else {
          res.status(500).send(error);
        }
      })
  } catch (error) {
    console.log(error);
  }
}
