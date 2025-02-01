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
router.get("/confirm_reservation", ctrl.confirm_reservation);
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
router.delete("/api/cart/remove/:product_id", ctrl.removeFromCart);
router.get("/api/cart", ctrl.getCart);
router.put("/api/cart/update/:productId", ctrl.updateCartQuantity);
router.put("/api/drawer/update/:productId", ctrl.updateDrawerQuantity);

//서랍 API 라우팅
router.post("/api/drawer/add", ctrl.addToDrawer);
router.delete("/api/drawer/remove/:product_id", ctrl.removeFromDrawer);
router.get("/api/drawer", ctrl.getDrawer);
// 찜 목록 API 라우팅
router.post("/api/heart/add", ctrl.addToHeart); // 찜 추가
router.delete("/api/heart/remove/:product_code", ctrl.removeFromHeart); // 찜 삭제
router.get("/api/heart", ctrl.getHeart); // 찜 조회
//서랍에서 장바구니 가는거 라우팅
// 새 API 경로 추가
router.post("/api/move-drawer-to-cart", ctrl.moveDrawerToCart);
//문의하기 라우팅
router.post("/api/add-inquiry", ctrl.addInquiry);


// 샘플 제품 API
router.get("/api/products", ctrl.getProducts);
//예약제품 관련 API 라우팅
router.post("/api/reservations/add-with-products", ctrl.addReservationWithProducts);
router.get("/api/reservation-data", ctrl.fetchReservationData);
router.post("/api/reservation-by-id", ctrl.fetchReservationById);
module.exports = router;
