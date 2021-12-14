const Category = require("../models/category"); 

exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "category not found in DB"
            })
        }
        req.category = category;
        next();
    });
};

exports.createCategory = (req,res)=>{
    const category = new Category(req.body);
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "Not able to save category in DB"
            });
        }
        res.json({
            category
        });
    });
};

exports.getCategory = (req,res)=>{
    return res.json(req.category);
}

exports.getAllCategory = (req,res)=>{
    Category.find({}).exec((err,data)=>{
        if(err){
            return res.json({
                error: "No categories found"
            });
        }
        return res.json(data);
    })
}

//??we are able to grab req.category because of middleware - getCategoryById
exports.updateCategory = (req,res)=>{
    const category = req.category;
    category.name = req.body.name;

    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                error: "Failed to update category"
            })
        }
        res.json(updatedCategory);
    });
};

exports.deleteCategory = (req,res)=>{
    console.log("deleting "+req.body);
    const category = req.category;
    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "Failed to delete category"
            });
        }
        res.json({
            message: `Succesfully deleted category: ${category.name}`
        });
    });
};