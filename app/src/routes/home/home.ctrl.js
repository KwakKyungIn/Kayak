"use strict";

const home = (req, res) => {
    res.render("home/index");
}

const book_page = (req,res)=>{
    res.render("book_page");
};
const product_info_page =(req,res)=>{
    res.render("product_info_page");
};
const product_list_page =  (req,res)=>{
    res.render("product_list_page");
};
const book_done =  (req,res)=>{
    res.render("book_done");
};
const counsel_book =  (req,res)=>{
    res.render("counsel_book");
};
const inquiry =  (req,res)=>{
    res.render("inquiry");
};
const main_set_flower=  (req,res)=>{
    res.render("product_list/main_set/flower");
};
const main_set_frame=  (req,res)=>{
    res.render("product_list/main_set/frame");
};
const main_set_pillar =  (req,res)=>{
    res.render("product_list/main_set/pillar");
};
const main_set_stair =  (req,res)=>{
    res.render("product_list/main_set/stair");
};
const main_set_temporary_wall =  (req,res)=>{
    res.render("product_list/main_set/temporary_wall");
};

const sub_set_birdal_waiting_room=  (req,res)=>{
    res.render("product_list/sub_set/bridal_waiting_room");
};
const sub_set_photo_table=  (req,res)=>{
    res.render("product_list/sub_set/photo_table");
};
const center_piece_virgin_road=  (req,res)=>{
    res.render("product_list/center_piece/virgin_road");
};
const etc_etc=  (req,res)=>{
    res.render("product_list/etc/etc");
};
const etc_chair=  (req,res)=>{
    res.render("product_list/etc/chair");
};

//새로운 api 생성
const path = require('path');
const fs = require('fs');

// 샘플 데이터 제공
const getProducts = (req, res) => {
  const dataPath = path.join(__dirname, '../../../public/image/product_list/product'); // 이미지 폴더 경로
  const sampleProducts = [];

  // 이미지 폴더의 파일들을 읽어와 JSON 데이터 생성
  fs.readdir(dataPath, (err, files) => {
    if (err) {
      console.error('이미지 파일 읽기 오류:', err);
      return res.status(500).json({ error: '서버 오류' });
    }

    // 파일명을 기반으로 제품 데이터 생성
    files.forEach((file, index) => {
      sampleProducts.push({
        id: index + 1,
        name: `제품 ${index + 1}`,
        image: `/image/product_list/product/${file}`,
      });
    });

    // JSON 응답 반환
    res.json(sampleProducts);
  });
};

module.exports={
    home,
    book_page,
    product_info_page,
    product_list_page,
    book_done,
    counsel_book,
    inquiry,
    //새로운 api
    getProducts,
    //product_list 페이지들
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