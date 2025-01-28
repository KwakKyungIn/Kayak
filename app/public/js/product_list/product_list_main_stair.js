//페이지 생성 추가
fetch('/data/product_list/main_set/stair/products.json') // JSON 파일 경로
.then((response) => response.json())
.then((data) => {
  const productGrid = document.querySelector('.product-grid');

  data.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    // a 태그 생성
    const linkElement = document.createElement('a');
    linkElement.href = `/product_info_page?id=${product.e_name}`; // 상세 페이지 링크
    linkElement.target = '_self'; // 같은 창에서 열기

    // img 태그 생성
    const imgElement = document.createElement('img');
    imgElement.src = `/image/product_list/product/${product.file_name}`; // 파일 이름 기반 이미지 경로
    imgElement.alt = product.name;

    // a 태그에 img 태그 추가
    linkElement.appendChild(imgElement);

    // p 태그 생성
    const description = document.createElement('p');
    description.textContent = product.name;

      // 찜 버튼 생성
    const heartButton = document.createElement('button');
    heartButton.classList.add('heart-button');
    heartButton.dataset.productCode = product.e_name; // 제품 코드 저장
    heartButton.textContent = '♡'; // 기본 상태

      // 찜 버튼 클릭 이벤트
    heartButton.addEventListener('click', () => toggleHeart(product.e_name, heartButton));

    // div.product에 요소 추가
    productElement.appendChild(linkElement); // a 태그 추가
    productElement.appendChild(description); // p 태그 추가
    productElement.appendChild(heartButton); // 찜 버튼 추가
    // .product-grid에 product 추가
    productGrid.appendChild(productElement);
  });
})
.catch((error) => console.error('데이터 로드 중 오류:', error));
