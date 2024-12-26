"use strict";

const home = (req, res) => {
    res.render("home/index");
}

const book_page = (req,res)=>{
    res.render("book_page");
};
const product_info_page =(req,res)=>{
    res.render("product_info_page");
};
const product_list_page =  (req,res)=>{
    res.render("product_list_page");
};
module.exports={
    home,
    book_page,
    product_info_page,
    product_list_page,
};