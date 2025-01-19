"use strict";
const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

router.get("/", ctrl.home);
 
router.get("/book_page", ctrl.book_page);
router.get("/product_info_page", ctrl.product_info_page);
router.get("/product_list_page",ctrl.product_list_page);
router.get("/book_done",ctrl.book_done);
router.get("/counsel_book",ctrl.counsel_book);
router.get("/inquiry",ctrl.inquiry);

router.get("/main_set_flower",ctrl.main_set_flower);
router.get("/main_set_frame",ctrl.main_set_flower);
router.get("/main_set_temporary_wall",ctrl.main_set_temporary_wall);
router.get("/main_set_pillar",ctrl.main_set_pillar);
router.get("/main_set_stair",ctrl.main_set_stair);

router.get("/sub_set_birdal_waiting_room",ctrl.sub_set_birdal_waiting_room);
router.get("/sub_set_photo_table",ctrl.sub_set_photo_table);

router.get("/center_piece_virgin_road",ctrl.center_piece_virgin_road);

router.get("/etc_chair",ctrl.etc_chair);
router.get("/etc_etc",ctrl.etc_etc);
//새로운 api 만들기 
// /api/products 경로에서 JSON 데이터 제공
router.get('/api/products', ctrl.getProducts); //웹페이지 자동 생성관련 api


module.exports = router;