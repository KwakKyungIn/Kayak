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
const confirm_reservation = (req, res) => res.render("confirm_reservation");
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
    const { product_id } = req.params; // product_id 가져오기
    const session_id = req.session?.id; // session_id 가져오기


    // 유효성 검사
    if (!product_id || !session_id) {
      console.error("Invalid parameters: product_id or session_id is missing.");
      return res.status(400).json({ 
        message: `잘못된 요청입니다. 누락된 값: ${
          !product_id ? "product_id" : ""
        } ${!session_id ? "session_id" : ""}`.trim() 
      });
    }

    const query = "DELETE FROM cart WHERE product_id = ? AND session_id = ?";
    const [result] = await db.execute(query, [product_id, session_id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "장바구니에서 삭제되었습니다." });
    } else {
      res.status(404).json({ message: "삭제할 항목이 없습니다." });
    }
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};


const getCart = async (req, res) => {
  try {
    const session_id = req.session.id;

    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }

    // 필요한 데이터를 가져오는 SQL 쿼리
    const query = `
      SELECT 
        c.quantity, 
        p.product_name, 
        p.product_code, 
        p.product_color, 
        p.product_price, 
        p.discount_price
      FROM cart c
      JOIN products p ON c.product_id = p.product_code
      WHERE c.session_id = ?
    `;

    // 쿼리 실행
    const [rows] = await db.execute(query, [session_id]);

    // 결과가 배열 형태인지 확인
    if (!Array.isArray(rows)) {
      return res.status(500).json({ message: "데이터베이스 응답이 잘못되었습니다." });
    }

    // 클라이언트에 데이터 반환
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
      SELECT product_code 
      FROM heart 
      WHERE session_id = ?
    `;
    const [rows] = await db.execute(query, [session_id]);

    const productCodes = rows.map(row => row.product_code);

    res.status(200).json({ product_codes: productCodes });
  } catch (error) {
    console.error("찜 목록 조회 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

//서랍 관련 컨트롤러
// 장바구니 관련 컨트롤러
const addToDrawer = async (req, res) => {
  try {
    const { product_id } = req.body;
    const session_id = req.session.id;

    if (!req.session.initialized) {
      req.session.initialized = true; // 세션 초기화 여부 설정
    }

    // 데이터베이스 확인 쿼리
    const checkQuery = `
      SELECT quantity 
      FROM drawer 
      WHERE product_id = ? AND session_id = ?
    `;
    const [rows] = await db.execute(checkQuery, [product_id, session_id]);

    if (rows.length > 0) {
      // 데이터가 존재하면 quantity를 증가
      const updateQuery = `
        UPDATE drawer
        SET quantity = quantity + 1
        WHERE product_id = ? AND session_id = ?
      `;
      await db.execute(updateQuery, [product_id, session_id]);
      res.status(200).json({ message: "서랍에 제품을 추가했습니다." });
    } else {
      // 데이터가 없으면 새로 삽입
      const insertQuery = `
        INSERT INTO drawer (product_id, quantity, session_id)
        VALUES (?, ?, ?)
      `;
      await db.execute(insertQuery, [product_id, 1, session_id]);
      res.status(200).json({ message: "서랍에 제품이 추가되었습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};



const removeFromDrawer = async (req, res) => {
  try {
    const { product_id } = req.params; // product_id 가져오기
    const session_id = req.session?.id; // session_id 가져오기


    // 유효성 검사
    if (!product_id || !session_id) {
      console.error("Invalid parameters: product_id or session_id is missing.");
      return res.status(400).json({ 
        message: `잘못된 요청입니다. 누락된 값: ${
          !product_id ? "product_id" : ""
        } ${!session_id ? "session_id" : ""}`.trim() 
      });
    }

    const query = "DELETE FROM drawer WHERE product_id = ? AND session_id = ?";
    const [result] = await db.execute(query, [product_id, session_id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "장바구니에서 삭제되었습니다." });
    } else {
      res.status(404).json({ message: "삭제할 항목이 없습니다." });
    }
  } catch (error) {
    console.error("Error in removeFromDrawer:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};


const getDrawer = async (req, res) => {
  try {
    const session_id = req.session.id;

    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }

    // 필요한 데이터를 가져오는 SQL 쿼리
    const query = `
      SELECT 
        d.quantity, 
        p.product_name, 
        p.product_code, 
        p.product_color, 
        p.product_price, 
        p.discount_price
      FROM drawer d
      JOIN products p ON d.product_id = p.product_code
      WHERE d.session_id = ?
    `;

    // 쿼리 실행
    const [rows] = await db.execute(query, [session_id]);

    // 결과가 배열 형태인지 확인
    if (!Array.isArray(rows)) {
      return res.status(500).json({ message: "데이터베이스 응답이 잘못되었습니다." });
    }

    // 클라이언트에 데이터 반환
    res.status(200).json(rows);
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

//서랍에서 카트로 옮기는 api
const moveDrawerToCart = async (req, res) => {
  let connection; // connection 객체 선언
  try {
    // pool에서 connection 가져오기
    connection = await db.getConnection();

    // 트랜잭션 시작
    await connection.beginTransaction();

    const session_id = req.session?.id;

    if (!session_id) {
      throw new Error("세션 ID가 없습니다.");
    }

    // 1. drawer 테이블에서 현재 세션과 관련된 모든 row 가져오기
    const [drawerItems] = await connection.execute(
      "SELECT product_id, quantity FROM drawer WHERE session_id = ?",
      [session_id]
    );

    if (drawerItems.length === 0) {
      return res.status(404).json({ message: "옮길 항목이 없습니다." });
    }

    // 2. cart 테이블로 데이터 삽입 또는 업데이트
    for (const item of drawerItems) {
      const query = `
        INSERT INTO cart (product_id, quantity, session_id)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `;
      await connection.execute(query, [item.product_id, item.quantity, session_id]);
    }

    // 3. drawer 테이블에서 관련 row 삭제
    await connection.execute("DELETE FROM drawer WHERE session_id = ?", [session_id]);

    // 트랜잭션 커밋
    await connection.commit();

    res.status(200).json({ message: "drawer에서 cart로 이동이 완료되었습니다." });
  } catch (error) {
    if (connection) {
      // 트랜잭션 롤백
      await connection.rollback();
    }
    console.error("Error in moveDrawerToCart:", error);
    res.status(500).json({ message: "서버 오류" });
  } finally {
    if (connection) {
      // connection 반환
      connection.release();
    }
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
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { change } = req.body;
    const session_id = req.session?.id;

    if (!session_id || !productId || !change) {
      return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    const query = `
      UPDATE cart 
      SET quantity = GREATEST(quantity + ?, 1) -- 최소 1로 제한
      WHERE product_id = ? AND session_id = ?
    `;
    const [result] = await db.execute(query, [change, productId, session_id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: '수량이 업데이트되었습니다.' });
    } else {
      res.status(404).json({ message: '해당 제품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};
const updateDrawerQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { change } = req.body;
    const session_id = req.session?.id;

    if (!session_id || !productId || !change) {
      return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    const query = `
      UPDATE drawer 
      SET quantity = GREATEST(quantity + ?, 1) -- 최소 1로 제한
      WHERE product_id = ? AND session_id = ?
    `;
    const [result] = await db.execute(query, [change, productId, session_id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: '수량이 업데이트되었습니다.' });
    } else {
      res.status(404).json({ message: '해당 제품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('Error updating drawer quantity:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};


const addReservationWithProducts = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction(); // 🔥 트랜잭션 시작

  try {
    const session_id = req.session.id;

    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }
    
    const {
      reservation_id,
      customer_name,
      phone_number,
      backup_phone_number,
      rental_date,
      counsel_date,
      email,
      venue_address,
      requests,
    } = req.body;

    if (!reservation_id || !customer_name || !phone_number || !rental_date || !counsel_date || !session_id) {
      throw new Error("필수 필드가 누락되었습니다.");
    }

    // 1️⃣ reservations 테이블에 INSERT
    const insertReservationQuery = `
      INSERT INTO reservations (
        reservation_id, customer_name, phone_number, backup_phone_number,
        rental_date, counsel_date, email, venue_address, requests, session_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(insertReservationQuery, [
      reservation_id,
      customer_name,
      phone_number,
      backup_phone_number || null,
      rental_date,
      counsel_date,
      email || null,
      venue_address || null,
      requests || null,
      session_id
    ]);

    // 2️⃣ session_id로 cart 테이블에서 product_id 및 quantity 목록 가져오기
    const cartQuery = `SELECT product_id, quantity FROM cart WHERE session_id = ?`;
    const [cartRows] = await connection.execute(cartQuery, [session_id]);

    if (cartRows.length === 0) {
      throw new Error("해당 session_id의 장바구니가 비어 있습니다.");
    }

    // 🛒 장바구니에서 가져온 product_id (실제 product_code) 및 quantity
    const productData = cartRows.map(row => ({ product_id: row.product_id, quantity: row.quantity }));
    console.log("🔍 장바구니 product 목록 (실제 product_code 및 수량):", productData);

    const productIds = productData.map(row => row.product_id);
    const placeholders = productIds.map(() => "?").join(", "); // (?, ?, ?)

    // 3️⃣ products 테이블에서 **product_code** 기준으로 가격 정보 가져오기
    const productsQuery = `
      SELECT product_code AS product_id, product_price, discount_price
      FROM products
      WHERE product_code IN (${placeholders}) 
    `;

    const [products] = await connection.execute(productsQuery, productIds);
    
    if (products.length === 0) {
      throw new Error("해당 상품 정보를 찾을 수 없습니다.");
    }

    // 4️⃣ reservation_products 테이블에 데이터 삽입 (quantity 포함)
    const insertProductQuery = `
      INSERT INTO reservation_products (reservation_id, product_id, product_price_at_booking, discount_price_at_booking, quantity)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const product of products) {
      const cartItem = productData.find(item => item.product_id === product.product_id);
      await connection.execute(insertProductQuery, [
        reservation_id,
        product.product_id,  // ✅ 이제 product_code가 들어감!
        product.product_price,
        product.discount_price || 0.00,
        cartItem.quantity // ✅ 수량 추가
      ]);
    }

    await connection.commit(); // 🔥 트랜잭션 완료
    // 5️⃣ 트랜잭션 완료 후 cart 테이블에서 해당 session_id 데이터 삭제
    try {
      const deleteCartQuery = `DELETE FROM cart WHERE session_id = ?`;
      await connection.execute(deleteCartQuery, [session_id]);
      console.log("🗑️ 장바구니 데이터 삭제 완료");
    } catch (deleteError) {
      console.error("⚠️ 장바구니 삭제 실패:", deleteError);
    }
    res.status(201).json({ message: "예약 및 상품 추가 완료" });

  } catch (error) {
    await connection.rollback(); // 🚨 오류 발생 시 롤백
    console.error("❌ 오류 발생:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    connection.release(); // 🔚 연결 해제
  }
};

//예약된 데이터 가져오기
const fetchReservationData = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const session_id = req.session.id;
    if (!session_id) {
      return res.status(400).json({ message: "세션 ID가 없습니다." });
    }

    // 1️⃣ 가장 최근의 reservations 데이터 가져오기
    const reservationQuery = `
      SELECT reservation_id, customer_name, phone_number, backup_phone_number, 
             rental_date, email, venue_address, requests, counsel_date 
      FROM reservations 
      WHERE session_id = ? 
      ORDER BY id DESC 
      LIMIT 1;
    `;
    const [reservationRows] = await connection.execute(reservationQuery, [session_id]);

    if (reservationRows.length === 0) {
      return res.status(404).json({ message: "해당 세션의 예약 정보가 없습니다." });
    }
    const reservation = reservationRows[0];

    // 2️⃣ reservation_id로 reservation_products 테이블에서 제품 정보 가져오기
    const productQuery = `
      SELECT product_id, quantity, product_price_at_booking, discount_price_at_booking 
      FROM reservation_products 
      WHERE reservation_id = ?;
    `;
    const [productRows] = await connection.execute(productQuery, [reservation.reservation_id]);

    if (productRows.length === 0) {
      return res.status(404).json({ message: "예약된 제품 정보가 없습니다." });
    }

    // 3️⃣ products 테이블에서 추가 정보 가져오기
    const productIds = productRows.map(row => row.product_id);
    const placeholders = productIds.map(() => "?").join(", ");
    const productDetailsQuery = `
      SELECT product_code, product_name, product_color 
      FROM products 
      WHERE product_code IN (${placeholders});
    `;
    const [productDetails] = await connection.execute(productDetailsQuery, productIds);

    // 4️⃣ productRows와 productDetails 매칭
    const products = productRows.map(product => {
      const details = productDetails.find(p => p.product_code === product.product_id);
      return {
        product_name: details ? details.product_name : null,
        product_code: details ? details.product_code : null,
        product_color: details ? details.product_color : null,
        quantity: product.quantity,
        product_price_at_booking: product.product_price_at_booking,
        discount_price_at_booking: product.discount_price_at_booking
      };
    });

    // 5️⃣ 최종 응답 데이터 구성
    res.status(200).json({
      customer: reservation,
      products: products
    });
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    connection.release();
  }
};

//예약번호를 통해 데이터 가져오기
const fetchReservationById = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { reservation_id } = req.body;
    if (!reservation_id) {
      return res.status(400).json({ message: "예약 ID가 없습니다." });
    }

    // 1️⃣ reservation_id로 reservations 데이터 가져오기
    const reservationQuery = `
      SELECT reservation_id, customer_name, phone_number, backup_phone_number, 
             rental_date, email, venue_address, requests, counsel_date 
      FROM reservations 
      WHERE reservation_id = ?;
    `;
    const [reservationRows] = await connection.execute(reservationQuery, [reservation_id]);

    if (reservationRows.length === 0) {
      return res.status(404).json({ message: "해당 예약 정보가 없습니다." });
    }
    const reservation = reservationRows[0];

    // 2️⃣ reservation_id로 reservation_products 테이블에서 제품 정보 가져오기
    const productQuery = `
      SELECT product_id, quantity, product_price_at_booking, discount_price_at_booking 
      FROM reservation_products 
      WHERE reservation_id = ?;
    `;
    const [productRows] = await connection.execute(productQuery, [reservation_id]);

    if (productRows.length === 0) {
      return res.status(404).json({ message: "예약된 제품 정보가 없습니다." });
    }

    // 3️⃣ products 테이블에서 추가 정보 가져오기
    const productIds = productRows.map(row => row.product_id);
    const placeholders = productIds.map(() => "?").join(", ");
    const productDetailsQuery = `
      SELECT product_code, product_name, product_color 
      FROM products 
      WHERE product_code IN (${placeholders});
    `;
    const [productDetails] = await connection.execute(productDetailsQuery, productIds);

    // 4️⃣ productRows와 productDetails 매칭
    const products = productRows.map(product => {
      const details = productDetails.find(p => p.product_code === product.product_id);
      return {
        product_name: details ? details.product_name : null,
        product_code: details ? details.product_code : null,
        product_color: details ? details.product_color : null,
        quantity: product.quantity,
        product_price_at_booking: product.product_price_at_booking,
        discount_price_at_booking: product.discount_price_at_booking
      };
    });

    // 5️⃣ 최종 응답 데이터 구성
    res.status(200).json({
      customer: reservation,
      products: products
    });
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    connection.release();
  }
};

//문의하기 api
const addInquiry = async (req, res) => {
  try {
    const { customer_name, phone_number, email, inquiry_type, inquiry_details } = req.body;

    // 필수 데이터 검증
    if (!customer_name || !phone_number || !email || !inquiry_type) {
      return res.status(400).json({ message: "필수 입력값이 누락되었습니다." });
    }

    // SQL 쿼리 작성
    const query = `
      INSERT INTO inquiry_customers (customer_name, phone_number, email, inquiry_type, inquiry_details)
      VALUES (?, ?, ?, ?, ?)
    `;

    // 쿼리 실행
    await db.execute(query, [customer_name, phone_number, email, inquiry_type, inquiry_details]);

    res.status(201).json({ message: "문의가 성공적으로 등록되었습니다." });
  } catch (error) {
    console.error("문의 등록 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
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
  moveDrawerToCart,
  updateCartQuantity,
  updateDrawerQuantity,
  addReservationWithProducts,
  fetchReservationData,
  confirm_reservation,
  fetchReservationById,
  addInquiry,
};
