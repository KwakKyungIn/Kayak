"use strict";
const db = require("../../config/db"); // DB 연결 객체
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// 홈 관련 컨트롤러
const home = (req, res) => res.render("home/index");
const book_page = (req, res) => res.render("book_page");
const product_info_page = (req, res) => res.render("product_info_page");
const product_list_page = (req, res) => res.render("product_list_page");
const book_done = (req, res) => res.render("book_done");
const counsel_book = (req, res) => res.render("counsel_book");
const inquiry = (req, res) => res.render("inquiry");

// 장바구니 관련 컨트롤러
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!req.session.initialized) {
      req.session.initialized = true; // 세션 초기화 여부 설정
    }
    const session_id = req.session.id;

    const query = `
      INSERT INTO cart (product_id, quantity, session_id)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;
    await db.execute(query, [product_id, quantity, session_id]);

    res.status(200).json({ message: "장바구니에 추가되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const session_id = req.session.id;

    const query = "DELETE FROM cart WHERE id = ? AND session_id = ?";
    await db.execute(query, [id, session_id]);

    res.status(200).json({ message: "장바구니에서 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

const getCart = async (req, res) => {
  try {
    const session_id = req.session.id;

    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }
    console.log("세션값", session_id);
    const query = `
      SELECT c.id, c.quantity, p.product_name, p.product_price, p.discount_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.session_id = ?
    `;

    const result = await db.execute(query, [session_id]);
    console.log("db.execute 반환값:", result);

    const rows = result[0]; // 결과 데이터는 첫 번째 요소
    if (!Array.isArray(rows)) {
      return res.status(500).json({ message: "데이터베이스 응답이 잘못되었습니다." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
//찜 관련 컨트롤러
const addToHeart = async (req, res) => {
  try {
    const { product_code } = req.body;
    const session_id = req.session.id;

    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }

    const query = `
      INSERT INTO heart (product_code, session_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE product_code = product_code
    `;
    await db.execute(query, [product_code, session_id]);

    res.status(200).json({ message: "찜 목록에 추가되었습니다." });
  } catch (error) {
    console.error("찜 추가 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 찜 목록에서 삭제
const removeFromHeart = async (req, res) => {
  try {
    const { product_code } = req.params;
    const session_id = req.session.id;

    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }

    const query = "DELETE FROM heart WHERE product_code = ? AND session_id = ?";
    await db.execute(query, [product_code, session_id]);

    res.status(200).json({ message: "찜 목록에서 삭제되었습니다." });
  } catch (error) {
    console.error("찜 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 찜 목록 조회
const getHeart = async (req, res) => {
  try {
    const session_id = req.session.id;

    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }

    const query = `
      SELECT h.product_code, p.product_name, p.product_price, p.discount_price
      FROM heart h
      JOIN products p ON h.product_code = p.product_code
      WHERE h.session_id = ?
    `;
    const [rows] = await db.execute(query, [session_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("찜 목록 조회 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
//서랍 관련 컨트롤러
// 장바구니 관련 컨트롤러
const addToDrawer = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!req.session.initialized) {
      req.session.initialized = true; // 세션 초기화 여부 설정
    }
    const session_id = req.session.id;

    const query = `
      INSERT INTO drawer (product_id, quantity, session_id)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;
    await db.execute(query, [product_id, quantity, session_id]);

    res.status(200).json({ message: "장바구니에 추가되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

const removeFromDrawer = async (req, res) => {
  try {
    const { id } = req.params;
    const session_id = req.session.id;

    const query = "DELETE FROM drawer WHERE id = ? AND session_id = ?";
    await db.execute(query, [id, session_id]);

    res.status(200).json({ message: "장바구니에서 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

const getDrawer = async (req, res) => {
  try {
    const session_id = req.session.id;

    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }
    console.log("세션값", session_id);
    const query = `
      SELECT d.id, d.quantity, p.product_name, p.product_price, p.discount_price
      FROM drawer d
      JOIN products p ON d.product_id = p.id
      WHERE d.session_id = ?
    `;

    const result = await db.execute(query, [session_id]);
    console.log("db.execute 반환값:", result);

    const rows = result[0]; // 결과 데이터는 첫 번째 요소
    if (!Array.isArray(rows)) {
      return res.status(500).json({ message: "데이터베이스 응답이 잘못되었습니다." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 제품 관련 샘플 데이터 생성
const getProducts = (req, res) => {
  const dataPath = path.join(__dirname, "../../../public/image/product_list/product");
  const sampleProducts = [];

  fs.readdir(dataPath, (err, files) => {
    if (err) {
      console.error("이미지 파일 읽기 오류:", err);
      return res.status(500).json({ error: "서버 오류" });
    }

    files.forEach((file, index) => {
      sampleProducts.push({
        id: index + 1,
        name: `제품 ${index + 1}`,
        image: `/image/product_list/product/${file}`,
      });
    });

    res.json(sampleProducts);
  });
};


// 메인세트/서브세트 관련 컨트롤러
const main_set_flower = (req, res) => res.render("product_list/main_set/flower");
const main_set_frame = (req, res) => res.render("product_list/main_set/frame");
const main_set_pillar = (req, res) => res.render("product_list/main_set/pillar");
const main_set_stair = (req, res) => res.render("product_list/main_set/stair");
const main_set_temporary_wall = (req, res) =>
  res.render("product_list/main_set/temporary_wall");

const sub_set_birdal_waiting_room = (req, res) =>
  res.render("product_list/sub_set/bridal_waiting_room");
const sub_set_photo_table = (req, res) =>
  res.render("product_list/sub_set/photo_table");
const center_piece_virgin_road = (req, res) =>
  res.render("product_list/center_piece/virgin_road");
const etc_etc = (req, res) => res.render("product_list/etc/etc");
const etc_chair = (req, res) => res.render("product_list/etc/chair");

module.exports = {
  home,
  book_page,
  product_info_page,
  product_list_page,
  book_done,
  counsel_book,
  inquiry,
  addToCart,
  removeFromCart,
  getCart,
  addToDrawer,
  removeFromDrawer,
  getDrawer,
  addToHeart,
  removeFromHeart,
  getHeart,
  getProducts,
  main_set_flower,
  main_set_frame,
  main_set_pillar,
  main_set_stair,
  main_set_temporary_wall,
  sub_set_birdal_waiting_room,
  sub_set_photo_table,
  center_piece_virgin_road,
  etc_chair,
  etc_etc,
};
