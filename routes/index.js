const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

const mongoose = require("mongoose");


router.get("/", function (req, res){
    let error = req.flash("error");
    res.render("index", {error, loggedin: false});
});

router.get("/shop", isloggedin, async function (req, res){
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop",{products, success });
});
router.get("/cart", isloggedin, async function (req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");

    // Check if cart is empty
    if (!user.cart || user.cart.length === 0) {
        return res.render("cart", { user, bill: 0 });  // You can set bill to 0 if cart is empty
    }

    // Calculate the total bill for each item in the cart
    let bill = 0;
    user.cart.forEach(item => {
        let itemTotal = Number(item.price) - Number(item.discount) + 20;  // Assuming discount + platform fee
        bill += itemTotal;
    });

    res.render("cart", { user, bill });
});

router.get("/addtocart/:productid", isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    const productId = req.params.productid;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        req.flash("error", "Invalid product ID");
        return res.redirect("/shop");
    }

    const productExists = await productModel.findById(productId);
    if (!productExists) {
        req.flash("error", "Product not found");
        return res.redirect("/shop");
    }

    
    user.cart.push(new mongoose.Types.ObjectId(productId));


    await user.save();

    req.flash("success", "Added to cart");
    res.redirect("/shop");
});



router.get("/logout", isloggedin, function (req, res){
    res.render("shop");
});

module.exports = router;