document.querySelectorAll('.tab-item > a').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault(); // 기본 동작 방지
      const dropdown = tab.nextElementSibling;
  
      // 모든 드롭다운 닫기
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu !== dropdown) menu.style.display = 'none';
      });
  
      // 현재 드롭다운 표시/숨기기
      if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
      } else {
        dropdown.style.display = 'flex';
      }
    });
  });
  
  // 페이지 외부 클릭 시 드롭다운 닫기
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tab-item')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
      });
    }
  });
  //탭 메뉴 끝~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //페이지 생성 추가
  fetch('/data/products.json') // JSON 파일 경로
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

      // div.product에 요소 추가
      productElement.appendChild(linkElement); // a 태그 추가
      productElement.appendChild(description); // p 태그 추가

      // .product-grid에 product 추가
      productGrid.appendChild(productElement);
    });
  })
  .catch((error) => console.error('데이터 로드 중 오류:', error));
