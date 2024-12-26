"use strict";
const express = require("express");
const app = express();

const home = require("./src/routes/home"); //라우팅

app.use(express.static("public"));


app.set("views", "./src/views");
app.set("view engine", "ejs");


app.use("/",home);//미들웨어 등록하는 메소드

module.exports = app;