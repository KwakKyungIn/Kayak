"use strict";
const express = require("express");
const app = express();
const path = require('path'); //api 관련 코드

const home = require("./src/routes/home"); //라우팅

app.use(express.static("public"));


app.set("views", "./src/views");
app.set("view engine", "ejs");


app.use("/",home);//미들웨어 등록하는 메소드

//정적 파일 제공 설정 api 관련
// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;