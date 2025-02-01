 // URL의 id 파라미터 추출
 const urlParams = new URLSearchParams(window.location.search);
 const productId = urlParams.get('id');

 // JSON 데이터 가져와서 콘텐츠 동적으로 생성
 fetch('/data/products.json')
     .then(response => response.json())
     .then(data => {
         // 해당 ID의 제품 데이터 검색
         const product = data.find(item => item.e_name === productId);

         if (product) {
             // 제품명, 코드, 설명 및 메인 이미지 설정
             document.getElementById('product-name').textContent = product.name;
             document.getElementById('product-code').textContent = productId;
             document.getElementById('product-main-image').src = `/image/products_info/${productId}/${product.mainImage}`;
             document.getElementById('product-description').textContent = product.description;

             const sliderContainer = document.getElementById('product-slider');
             //디버깅 코드들
            //  console.log(product.sliderImages);
            //  console.log('sliderImages:', product.sliderImages);
            //  console.log(sliderContainer); // sliderContainer가 제대로 로드되었는지 확인
            //  console.log('Product ID:', productId);
            //  console.log('Data:', data);
            //  console.log('Found Product:', product);
            //  console.log('supplements:', product.supplements);

             // 슬라이더 이미지 추가
             product.sliderImages.forEach((image, index) => {
                 const imgElement = document.createElement('img');
                 
                 imgElement.src = `/image/products_info/${productId}/slider_image/${image}`;
                 imgElement.alt = `Product Image ${index + 1}`; // 순서에 따라 고유한 alt 설정
                 sliderContainer.appendChild(imgElement);
             });
             // 슬라이더 초기화 함수 호출
             initializeSlider();

             // 본품 구성 추가
            //  const supplementsContainer = document.getElementById('product-supplements');
            //  product.supplements.forEach(supplement => {
            //      const supplementElement = document.createElement('div');
            //      supplementElement.classList.add('content-product');
            //      supplementElement.innerHTML = `
            //          <img src="/image/products_info/${productId}/supplements/${supplement.image}" alt="${supplement.name}">
            //          <p>${supplement.name}</p>
            //      `;
            //      supplementsContainer.appendChild(supplementElement);
            //  });
         } else {
             alert('해당 제품을 찾을 수 없습니다.');
         }
     })
     .catch(error => {
         console.error('Error fetching product data:', error);
     });




     //여기서부터 있던거
// window.onload = () => {
//  // 드롭다운 버튼 클릭 이벤트
//  document.querySelector('.dropbtn').onclick = () => {
//      dropdown();
//  };

//  // 각 메뉴 항목에 클릭 이벤트 추가
//  let fastfoods = document.getElementsByClassName('fastfood');
//  for (let i = 0; i < fastfoods.length; i++) {
//      fastfoods[i].onclick = function () {
//          showMenu(this.innerText); // 선택된 메뉴의 텍스트를 전달
//      };
//  }
// };

// // 드롭다운 열고 닫기
// let dropdown = () => {
//  let v = document.querySelector('.dropdown-content');
//  let dropbtn = document.querySelector('.dropbtn');
//  v.classList.toggle('show');
//  dropbtn.style.borderColor = v.classList.contains('show') ? '#3992a8' : 'rgb(94, 94, 94)';
// };

// // 선택된 메뉴 표시
// let showMenu = (value) => {
//  let dropbtn_icon = document.querySelector('.dropbtn_icon');
//  let dropbtn_content = document.querySelector('.dropbtn_content');
//  let dropbtn = document.querySelector('.dropbtn');

//  dropbtn_icon.innerText = '';
//  dropbtn_content.innerText = value;
//  dropbtn_content.style.color = '#252525';
//  dropbtn.style.borderColor = '#3992a8';
// };

// // 드롭다운 외부 클릭 시 닫기
// window.onclick = (e) => {
//  if (!e.target.matches('.dropbtn')) {
//      let dropdowns = document.getElementsByClassName('dropdown-content');
//      for (let i = 0; i < dropdowns.length; i++) {
//          let openDropdown = dropdowns[i];
//          if (openDropdown.classList.contains('show')) {
//              openDropdown.classList.remove('show');
//          }
//      }
//  }
// };

// 슬라이더 초기화 함수
function initializeSlider() {
 const slider = document.querySelector(".slider");
 const images = document.querySelectorAll(".slider img");
 const pagination = document.querySelector(".pagination");

 if (images.length === 0) {
     console.error('No images found for slider!');
     return;
 }

 let currentIndex = 0;
 const slideCount = images.length;
 const slideWidth = images[0].clientWidth;

 // 앞뒤로 이미지를 복제
 const firstClone = images[0].cloneNode(true);
 const lastClone = images[images.length - 1].cloneNode(true);
 slider.appendChild(firstClone);
 slider.insertBefore(lastClone, slider.firstChild);

 // 초기 위치 설정
 slider.style.transform = `translateX(-${slideWidth}px)`;

 // 페이지 인디케이터 생성
 function createPagination() {
     for (let i = 0; i < slideCount; i++) {
         const dot = document.createElement("div");
         dot.classList.add("dot");
         if (i === 0) dot.classList.add("active");
         pagination.appendChild(dot);

         // 동그라미 클릭 이벤트
         dot.addEventListener("click", function () {
             currentIndex = i;
             updateSlider();
         });
     }
 }

 createPagination();

 // 슬라이더와 페이지 인디케이터 업데이트
 function updateSlider() {
     const dots = document.querySelectorAll(".pagination .dot");
     slider.style.transition = "transform 0.3s ease-in-out";
     slider.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`;

     // 모든 동그라미 비활성화 후 현재 동그라미 활성화
     dots.forEach(dot => dot.classList.remove("active"));
     dots[currentIndex].classList.add("active");
 }

 // 무한 스크롤 처리
 slider.addEventListener("transitionend", function () {
     const dots = document.querySelectorAll(".pagination .dot");
     if (currentIndex === -1) {
         slider.style.transition = "none";
         currentIndex = slideCount - 1;
         slider.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`;
     } else if (currentIndex === slideCount) {
         slider.style.transition = "none";
         currentIndex = 0;
         slider.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`;
     }

     // 페이지 인디케이터 업데이트 추가
     dots.forEach(dot => dot.classList.remove("active"));
     dots[currentIndex].classList.add("active");
 });

 // 화살표 클릭 이벤트
//  document.querySelector(".arrow.next").addEventListener("click", function () {
//      currentIndex++;
//      if (currentIndex > slideCount) currentIndex = 0; // 안전 처리
//      updateSlider();
//  });

//  document.querySelector(".arrow.prev").addEventListener("click", function () {
//      currentIndex--;
//      if (currentIndex < -1) currentIndex = slideCount - 1; // 안전 처리
//      updateSlider();
//  });

 // 화면 크기 조정 시 위치 재조정
 window.addEventListener("resize", function () {
     slider.style.transition = "none";
     slider.style.transform = `translateX(-${(currentIndex + 1) * images[0].clientWidth}px)`;
 });
}

//여기서 부터 제품 크기 코드
// 모든 토글 버튼에 클릭 이벤트 추가
document.querySelectorAll('.toggle-button').forEach(button => {
 button.addEventListener('click', () => {
     const content = button.parentElement.nextElementSibling;

     // 상세 정보 표시/숨기기
     if (content.style.display === 'block') {
         content.style.display = 'none';
         button.textContent = '+'; // 버튼 텍스트를 '+'로 변경
     } else {
         content.style.display = 'block';
         button.textContent = '-'; // 버튼 텍스트를 '-'로 변경
     }
 });
});
// "서랍 넣기" 버튼 이벤트 리스너 추가
document.querySelector('.custom-inquire-button').addEventListener('click', async () => {
    try {
      // API 요청 보내기
      const response = await fetch('/api/drawer/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId, // URL에서 추출한 product_id
        }),
      });
  
      // 응답 처리
      if (response.ok) {
        const data = await response.json();
        alert(data.message); // 성공 메시지 표시
      } else {
        const errorData = await response.json();
        alert(`오류: ${errorData.message}`); // 오류 메시지 표시
      }
    } catch (error) {
      console.error('서랍 추가 중 오류:', error);
      alert('서랍에 넣는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
  });