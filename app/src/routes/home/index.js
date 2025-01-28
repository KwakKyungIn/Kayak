"use strict";
const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

// 페이지 라우팅
router.get("/", ctrl.home);
router.get("/book_page", ctrl.book_page);
router.get("/product_info_page", ctrl.product_info_page);
router.get("/product_list_page", ctrl.product_list_page);
router.get("/book_done", ctrl.book_done);
router.get("/counsel_book", ctrl.counsel_book);
router.get("/inquiry", ctrl.inquiry);

// 메인세트 및 서브세트 라우팅
router.get("/main_set_flower", ctrl.main_set_flower);
router.get("/main_set_frame", ctrl.main_set_frame);
router.get("/main_set_pillar", ctrl.main_set_pillar);
router.get("/main_set_stair", ctrl.main_set_stair);
router.get("/main_set_temporary_wall", ctrl.main_set_temporary_wall);

router.get("/sub_set_birdal_waiting_room", ctrl.sub_set_birdal_waiting_room);
router.get("/sub_set_photo_table", ctrl.sub_set_photo_table);
router.get("/center_piece_virgin_road", ctrl.center_piece_virgin_road);
router.get("/etc_chair", ctrl.etc_chair);
router.get("/etc_etc", ctrl.etc_etc);

// 장바구니 API 라우팅
router.post("/api/cart/add", ctrl.addToCart);
router.delete("/api/cart/remove/:id", ctrl.removeFromCart);
router.get("/api/cart", ctrl.getCart);
//서랍 API 라우팅
router.post("/api/drawer/add", ctrl.addToDrawer);
router.delete("/api/drawer/remove/:id", ctrl.removeFromDrawer);
router.get("/api/drawer", ctrl.getDrawer);
// 찜 목록 API 라우팅
router.post("/api/heart/add", ctrl.addToHeart); // 찜 추가
router.delete("/api/heart/remove/:product_code", ctrl.removeFromHeart); // 찜 삭제
router.get("/api/heart", ctrl.getHeart); // 찜 조회

// 샘플 제품 API
router.get("/api/products", ctrl.getProducts);

module.exports = router;
