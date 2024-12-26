"use strict";
const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

router.get("/", ctrl.home);
 
router.get("/book_page", ctrl.book_page);
router.get("/product_info_page", ctrl.product_info_page);
router.get("/product_list_page",ctrl.product_list_page);

module.exports = router;