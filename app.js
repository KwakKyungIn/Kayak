const express = require("express");
const app = express();

app.use(express.static("public"));


app.set("views", "./views");
app.set("view engine", "ejs");


app.get("/", (req,res)=>{
    res.render("home/index");
});
 
app.get("/book_page", (req,res)=>{
    res.render("book_page");
});
app.get("/product_info_page", (req,res)=>{
    res.render("product_info_page");
});
app.get("/product_list_page", (req,res)=>{
    res.render("product_list_page");
});

app.listen(3000,function() {
console.log("서버 가동")
});