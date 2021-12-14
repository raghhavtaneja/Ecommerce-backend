const Product = require("../models/product");
const formidable = require("formidable"); 
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error : "cannot find product"
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req,res)=>{
    //use form data
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error: "problem with the image"
            });
        }
        //destructure on the fields
        const { name, description, price, category, quantity } = fields;

        //TODO: use express validator
        if(!name || !description || !price || !category || !quantity){
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        let product = new Product(fields);
        //handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                //greater than 3MB
                return res.status(400).json({
                    error: "File size is very large"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type 
        }
        console.log(product);
        //save to the DB
        product.save((err,item)=>{
            if(err){
                console.log(err);
                res.status(400).json({
                    error: "saving item in DB failed!"
                })
            }
            res.json(item);
        })
    });
}

exports.getProduct = (req,res)=>{
    req.product.photo = undefined; //because loading photo is a bulky process[writing a middleware]
    return res.json(req.product);
}

//MIDDLEWARE TO LOAD PHOTO
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.updateProduct = (req,res)=>{
    //similar to createProduct
    //use form data
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error: "problem with the image"
            });
        }

        //updating the product
        let product = req.product; //getProductById [params]
        product = _.extend(product, fields);

        //handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                //greater than 3MB
                return res.status(400).json({
                    error: "File size is very large"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type 
        }
        // console.log(product);
        //save to the DB
        product.save((err,item)=>{
            if(err){
                return res.status(400).json({
                    error: "saving item in DB failed!"
                });
            }
            res.json(item);
        })
    });

}

exports.deleteProduct = (req,res)=>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error: "Error deleting the product"
            });
        }
        res.json({
            message: "Deletion Succesul!",
            deletedProduct
        });
    });
}

exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit):8;
    let sortBy = req.query.sortBy ? req.query.sortBy:"_id";

    Product.find()
    .select("-photo")//dont select photo
    .populate("category")//populate category
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error: "Error in fetching products"
            });
        }
        res.json(data);
    })
}