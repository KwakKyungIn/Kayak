"use strict";
const express = require("express");
const app = express();
const db = require('./src/config/db'); // 데이터베이스 연결 가져오기
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({},db);
app.use(
    session({
        secret: process.env.SESSION_SECRET, // 암호화 키
        resave: false, // 세션 데이터가 변경되지 않아도 다시 저장하지 않음
        saveUninitialized: false, // 초기화되지 않은 세션을 저장하지 않음
        store: sessionStore, // MySQL 세션 저장소 사용
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1주일 (ms 단위)
            secure: false, // HTTPS 환경에서는 true로 설정
        },
    })
);
const path = require('path'); //api 관련 코드
require('dotenv').config();

// JSON 파싱 미들웨어 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // URL-encoded 데이터도 처리

const home = require("./src/routes/home"); //라우팅

app.use(express.static("public"));


app.set("views", "./src/views");
app.set("view engine", "ejs");


app.use("/",home);//미들웨어 등록하는 메소드



//정적 파일 제공 설정 api 관련
// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;