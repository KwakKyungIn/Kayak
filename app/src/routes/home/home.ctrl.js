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
const book_done =  (req,res)=>{
    res.render("book_done");
};
const counsel_book =  (req,res)=>{
    res.render("counsel_book");
};

module.exports={
    home,
    book_page,
    product_info_page,
    product_list_page,
    book_done,
    counsel_book,
};