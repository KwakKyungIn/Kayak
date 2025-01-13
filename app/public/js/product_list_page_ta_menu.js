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
  