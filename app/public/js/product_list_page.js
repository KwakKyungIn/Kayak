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

  const updateHeartStatus = async () => {
    try {
      const response = await fetch('/api/heart');
      const heartedProducts = await response.json(); // 찜된 제품 목록
      const heartButtons = document.querySelectorAll('.heart-button');
  
      heartButtons.forEach((button) => {
        const productCode = button.dataset.productCode;
        if (heartedProducts.some((product) => product.product_code === productCode)) {
          button.classList.add('hearted'); // 찜된 상태
          button.textContent = '❤️';
        } else {
          button.classList.remove('hearted'); // 찜되지 않은 상태
          button.textContent = '♡';
        }
      });
    } catch (error) {
      console.error('찜 상태 업데이트 오류:', error);
    }
  };
  
  // 페이지 로드 시 찜 상태 업데이트
  updateHeartStatus();

  const toggleHeart = async (productCode, button) => {
    try {
      if (button.classList.contains('hearted')) {
        // 찜 해제 요청
        console.log("코드", productCode);
        await fetch(`/api/heart/remove/${productCode}`, { method: 'DELETE' });
        button.classList.remove('hearted');
        button.textContent = '♡';
      } else {
        // 찜 추가 요청
        await fetch('/api/heart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_code: productCode }),
        });
        button.classList.add('hearted');
        button.textContent = '❤️';
      }
    } catch (error) {
      console.error('찜 상태 변경 오류:', error);
    }
  };
  