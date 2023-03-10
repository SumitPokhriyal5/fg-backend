const {ProductModel} = require("../models/ProductsModel");
const {verifyTokenAndAdmin}=require("../middlewares/VerifyTokenAndAdmin");
const { hash } = require("bcrypt");
const ProductsRoute = require("express").Router();

//CREATE ,  Only Admin Authorised middleware(verifyTokenAndAdmin)

ProductsRoute.post("/add",verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new ProductModel(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).send(savedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

//UPDATE, Only Admin Authorised, middleware(verifyTokenAndAdmin)

ProductsRoute.patch("/update/:id",verifyTokenAndAdmin, async (req, res) => {
    console.log(req.body)
    console.log(req.params.id)
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

//DELETE   Only Admin Authorised, middleware(verifyTokenAndAdmin)

ProductsRoute.delete("/delete/:id",verifyTokenAndAdmin, async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Product has been deleted...");
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET , Product by id ,Anyone can access

ProductsRoute.get("/:id", async (req, res) => { 
  console.log(req.params.id)
  try {
    const product = await ProductModel.findById(req.params.id);
    product?res.status(200).send(product):
    res.status(200).send("Product is not available");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//GET ALL ,Product, Anyone can access

ProductsRoute.get("/", async (req, res) => {
  const query=req.body
  const qNew = req.query.new;
  const qCategory = req.query.categories;
  console.log({qCategory})
  const price=req.query.price
  const color=req.query.color
  const sort=req.query.order
  console.log({sort})
  try {
    let products;
   
    if(price!==undefined &&color!==undefined && qCategory!==undefined){
      products=await ProductModel.find({$and:[{categories:{$in:[qCategory]}},{price:{$lte:price}},{color:{$regex:`${color}`,$options:"i"}}]})
    }
    else if(qCategory!==undefined && price!==undefined){
      products=await ProductModel.find({$and:[{categories:{$in:[qCategory]}},{price:{$lte:price}}]})
    }
    else if(qCategory!==undefined&&color!==undefined){
      products=await ProductModel.find({$and:[{categories:{$in:[qCategory]}},{color:{$regex:`${color}`,$options:"i"}}]})
    }
    else if(color!==undefined && price!==undefined){
      products=await ProductModel.find({$and:[{price:{$lte:price}},{color:{$regex:`${color}`,$options:"i"}}]})
    }
    else {
      if(qCategory!==undefined){
        products = await ProductModel.find({
            categories:{
              $in:[qCategory],
            },
        })
      }
      else if(color!==undefined){
        products=await ProductModel.find({color})
        // products.reverse();
      }
      else if(price!==undefined){
        products=await ProductModel.find({price})
        // products.reverse();
      }
      else{
        products=await ProductModel.find()
        // products.reverse();
      }
    }
    
   if(sort!==undefined){
    if(sort=='asc'){
      products.sort((a,b)=>a.price-b-price)
    }
    else{
      products.sort((a,b)=>b.price-a.price)
    }
   }
    products.length>0?res.status(200).send(products):res.status(200).send("There is no products")
  } catch (err) {
    res.status(500).send(err);
  }
});

// ProductsRoute.get("/", async (req, res) => {
//   const query = req.query;

//   try {
//    let products=await ProductModel.find(query);
//    res.status(200).send(products);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// ProductsRoute.get("/", async (req, res) => {
//   const query=req.body
//   const qNew = req.query.new;
//   const qCategory = req.query.categories;
//   console.log({qCategory})
//   const price=req.query.price
//   const color=req.query.color
//   const sort=req.query.order
//   try {
//     let products;
   
//     if(price!==undefined &&color!==undefined && qCategory!==undefined){
//       products=await ProductModel.find({$and:[{categories:{$in:[qCategory]}},{price:{$lte:price}},{color:{$regex:`${color}`,$options:"i"}}]})
//     }
//     else if(qCategory!==undefined && price!==undefined){
//       products=await ProductModel.find({$and:[{categories:{$in:[qCategory]}},{price:{$lte:price}}]})
//     }
//     else if(qCategory!==undefined&&color!==undefined){
//       products=await ProductModel.find({$and:[{categories:{$in:[qCategory]}},{color:{$regex:`${color}`,$options:"i"}}]})
//     }
//     else if(color!==undefined && price!==undefined){
//       products=await ProductModel.find({$and:[{price:{$lte:price}},{color:{$regex:`${color}`,$options:"i"}}]})
//     }
//     else {
//       if(qCategory!==undefined){
//         products = await ProductModel.find({
//             categories:{
//               $in:[qCategory],
//             },
//         });
//       }
//       else if(color!==undefined){
//         products=await ProductModel.find({color})
//       }
//       else if(price!==undefined){
//         products=await ProductModel.find({price})
//       }
//       else {
//         products=await ProductModel.find()
//       }
//     }
    
//    if(sort!==undefined){
//     if(sort=='asc'){
//       products.sort((a,b)=>a.price-b-price)
//     }
//     else{
//       products.sort((a,b)=>b.price-a.price)
//     }
//    }
//     products.length>0?res.status(200).send(products):res.status(200).send("There is no products")
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

module.exports = {ProductsRoute};