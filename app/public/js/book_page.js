  // tabs.js
  document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // 모든 버튼과 탭에서 활성화 상태 제거
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabPanes.forEach((pane) => pane.classList.remove("active"));

            // 클릭된 버튼과 연결된 탭 활성화
            button.classList.add("active");
            const tabId = button.getAttribute("data-tab");
            const activeTab = document.getElementById(tabId);
            activeTab.classList.add("active");

            // 추가된 연동 탭 활성화/비활성화 처리
            if (tabId === "cart") {
                const linkedCartTab = document.getElementById("cart-linked");
                if (linkedCartTab) {
                    linkedCartTab.classList.add("active");
                }
            }

            if (tabId === "drawer") {
                const linkedDrawerTab = document.getElementById("drawer-linked");
                if (linkedDrawerTab) {
                    linkedDrawerTab.classList.add("active");
                }
            }
        });
    });
});

//데이터를 바탕응로 장바구니 테이블 동적 생성
async function loadCartItems() {
  try {
    const response = await fetch('/api/cart'); // API 호출
    const data = await response.json();

    // 특정 테이블의 tbody 선택 (ID를 사용하여 정확히 지정)
    const tableBody = document.querySelector('#dynamic-table-2 tbody');
    tableBody.innerHTML = ''; // 기존 내용을 비웁니다.

    // 숫자 포맷터 (소수점 제거 및 반점 추가)
    const formatPrice = (price) => {
      return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 });
    };

    // 총합 계산 변수 초기화
    let totalQuantity = 0;
    let totalOrderAmount = 0;
    let totalDiscount = 0;

    // 데이터 순회하며 동적으로 HTML 생성
    data.forEach((item, index) => {
      const paymentAmount = item.product_price - item.discount_price; // 결제 금액 계산

      // 총합 계산
      totalQuantity += item.quantity;
      totalOrderAmount += item.product_price * item.quantity;
      totalDiscount += item.discount_price * item.quantity;

      // 각 제품의 기본 정보를 나타내는 행 생성
      const productRow = `
        <tr>
          <td class="product-info-cell">
            <img src="/image/product_list/product/${item.product_code}_1.png" alt="제품 이미지">
            <div class="product-info-text">
              <p>${item.product_name}</p>
              <p>${item.product_code}</p>
              <p>수량: ${item.quantity}개</p>
              <p>컬러: ${item.product_color}</p>
              <p>${formatPrice(item.product_price)}원</p>
            </div>
          </td>
          <td>
            <p class="discount-amount">${formatPrice(item.discount_price)}원</p>
          </td>
          <td>
            <p class="payment-amount">${formatPrice(paymentAmount)}원</p>
          </td>
          <td>
            <div class="action-buttons">

              <button class="btn-delete" data-product-id="${item.product_code}">삭제</button> <!-- product_id 추가 -->
            </div>
          </td>
        </tr>
      `;

      // 옵션 정보를 나타내는 행 생성
      const optionRow = `
        <tr class="option-row" data-product-id="${item.product_code}"> <!-- 동일한 product_id 추가 -->
          <td colspan="3">
            선택${index + 1}: [${item.product_name} / ${formatPrice(item.product_price)}원] 
            [수량: ${item.quantity}개] 
            [컬러: ${item.product_color}]
          </td>
          <td class="quantity-control-cell">
            <div class="quantity-control">
              <button class="decrease1" data-product-id="${item.product_code}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="increase1" data-product-id="${item.product_code}">+</button>
            </div>
          </td>
        </tr>
      `;

      // 테이블에 행 추가
      tableBody.innerHTML += productRow + optionRow;
    });

    // 총 주문 금액 섹션 업데이트
    const orderSummaryContainer = document.querySelector('.order-summary-right');
    if (orderSummaryContainer) {
      orderSummaryContainer.innerHTML = `
        <div class="order-detail">
          <span class="label">주문 상품 수</span>
          <span class="value">${totalQuantity}</span>
          <span class="value2">개</span>
        </div>
        <div class="order-detail">
          <span class="label">주문 금액</span>
          <span class="value">${formatPrice(totalOrderAmount)}</span>
          <span class="value2">원</span>
        </div>
        <div class="order-detail">
          <span class="label">할인 금액</span>
          <span class="value">${formatPrice(totalDiscount)}</span>
          <span class="value2">원</span>
        </div>
        <hr> <!-- 구분선 -->
        <div class="order-detail total">
          <span class="label"><strong>최종 결제 금액</strong></span>
          <span class="value" style="color: red;"><strong>${formatPrice(totalOrderAmount - totalDiscount)}</strong></span>
          <span class="value2"><strong>원</strong></span>
        </div>
      `;
    }

    // 삭제 버튼 이벤트 추가
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const productId = event.target.dataset.productId;
        console.log("Deleting product with ID:", productId);

        try {
          const deleteResponse = await fetch(`/api/cart/remove/${productId}`, {
            method: 'DELETE',
          });

          if (deleteResponse.ok) {
            const data = await deleteResponse.json();

            // 성공 메시지(alert)
            alert(data.message); // API에서 전달된 메시지 표시
            // `productRow`와 `optionRow` 삭제
            const productRow = event.target.closest('tr');
            const optionRow = document.querySelector(
              `.option-row[data-product-id="${productId}"]`
            ); // productId로 optionRow 선택

            productRow.remove();
            if (optionRow) {
              optionRow.remove();
            }

            // 장바구니 데이터 다시 로드
            loadCartItems();
          } else {
            console.error('삭제 실패:', deleteResponse.statusText);
          }
        } catch (error) {
          console.error('삭제 요청 중 오류 발생:', error);
        }
      });
    });

    // 수량 조정 버튼 이벤트 추가
    const quantityButtons = document.querySelectorAll('.decrease1, .increase1');
    quantityButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const productId = event.target.dataset.productId;
        const isIncrease = event.target.classList.contains('increase1');

        try {
          // 서버로 수량 변경 요청
          const response = await fetch(`/api/cart/update/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ change: isIncrease ? 1 : -1 }), // 수량 증가 또는 감소
          });

          if (response.ok) {
            const data = await response.json();

            // 성공적으로 수량이 업데이트되었으면 UI 갱신
            loadCartItems();
          } else {
            console.error('수량 변경 실패:', response.statusText);
          }
        } catch (error) {
          console.error('수량 변경 요청 중 오류 발생:', error);
        }
      });
    });

  } catch (error) {
    console.error('장바구니 데이터를 불러오는 중 오류 발생:', error);
  }
}


// 데이터를 바탕으로 서랍 테이블 동적 생성
async function loadDrawerItems() {
  try {
    const response = await fetch('/api/drawer'); // API 호출
    const data = await response.json();

    // 특정 테이블의 tbody 선택 (ID를 사용하여 정확히 지정)
    const tableBody = document.querySelector('#dynamic-table-1 tbody');
    tableBody.innerHTML = ''; // 기존 내용을 비웁니다.

    // 숫자 포맷터 (소수점 제거 및 반점 추가)
    const formatPrice = (price) => {
      return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 });
    };

    // 데이터 순회하며 동적으로 HTML 생성
    data.forEach((item, index) => {
      const paymentAmount = item.product_price - item.discount_price; // 결제 금액 계산

      // 각 제품의 기본 정보를 나타내는 행 생성
      const productRow = `
        <tr>
          <td class="product-info-cell">
            <img src="/image/product_list/product/${item.product_code}_1.png" alt="제품 이미지">
            <div class="product-info-text">
              <p>${item.product_name}</p>
              <p>${item.product_code}</p>
              <p>수량: ${item.quantity}개</p>
              <p>컬러: ${item.product_color}</p>
              <p>${formatPrice(item.product_price)}원</p>
            </div>
          </td>
          <td>
            <p class="discount-amount">${formatPrice(item.discount_price)}원</p>
          </td>
          <td>
            <p class="payment-amount">${formatPrice(paymentAmount)}원</p>
          </td>
          <td>
            <div class="action-buttons">
            <button class="btn-delete" data-product-id="${item.product_code}">삭제</button> <!-- product_id 추가 -->
            </div>
          </td>
        </tr>
      `;

      // 옵션 정보를 나타내는 행 생성
      const optionRow = `
        <tr class="option-row" data-product-id="${item.product_code}"> <!-- 동일한 product_id 추가 -->
          <td colspan="3">
            선택${index + 1}: [${item.product_name} / ${formatPrice(item.product_price)}원] 
            [수량: ${item.quantity}개] 
            [컬러: ${item.product_color}]
          </td>
          <td class="quantity-control-cell">
            <div class="quantity-control">
              <button class="decrease2" data-product-id="${item.product_code}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="increase2" data-product-id="${item.product_code}">+</button>
            </div>
          </td>
        </tr>
      `;

      // 테이블에 행 추가
      tableBody.innerHTML += productRow + optionRow;
    });

    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach((button) => {
  button.addEventListener('click', async (event) => {
    const productId = event.target.dataset.productId;
    console.log("Deleting product with ID:", productId);

    try {
      const deleteResponse = await fetch(`/api/drawer/remove/${productId}`, {
        method: 'DELETE',
      });

      if (deleteResponse.ok) {
        const data = await deleteResponse.json();

        // 성공 메시지(alert)
        alert(data.message); // API에서 전달된 메시지 표시
        // `productRow`와 `optionRow` 삭제
        const productRow = event.target.closest('tr');
        const optionRow = document.querySelector(
          `.option-row[data-product-id="${productId}"]`
        ); // productId로 optionRow 선택

        productRow.remove();
        if (optionRow) {
          optionRow.remove();
        }
      } else {
        console.error('삭제 실패:', deleteResponse.statusText);
      }
    } catch (error) {
      console.error('삭제 요청 중 오류 발생:', error);
    }
  });
});
const quantityButtons = document.querySelectorAll('.decrease2, .increase2');
    quantityButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const productId = event.target.dataset.productId;
        const isIncrease = event.target.classList.contains('increase2');

        try {
          // 서버로 수량 변경 요청
          const response = await fetch(`/api/drawer/update/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ change: isIncrease ? 1 : -1 }), // 수량 증가 또는 감소
          });

          if (response.ok) {
            const data = await response.json();

            // 성공적으로 수량이 업데이트되었으면 UI 갱신
            loadDrawerItems();
          } else {
            console.error('수량 변경 실패:', response.statusText);
          }
        } catch (error) {
          console.error('수량 변경 요청 중 오류 발생:', error);
        }
      });
    });

  } catch (error) {
    console.error('서랍 데이터를 불러오는 중 오류 발생:', error);
  }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', loadDrawerItems);
document.addEventListener('DOMContentLoaded', loadCartItems);

//장바구니 넣기 버튼 관련 코드
document.querySelector(".cart-button").addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("/api/move-drawer-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message); // 성공 메시지 출력
      location.reload(); // 페이지 새로고침
    } else {
      alert(`오류: ${data.message}`);
    }
  } catch (error) {
    console.error("Error moving drawer to cart:", error);
    alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
  }
});

// 찜한 제품 가져오기
fetch('/api/heart')
  .then((response) => response.json())
  .then((heartData) => {
    if (!heartData.product_codes || heartData.product_codes.length === 0) {
      console.warn('찜한 제품이 없습니다.');
      return;
    }

    // 전체 제품 목록 가져오기
    fetch('/data/products.json')
      .then((response) => response.json())
      .then((productData) => {
        const productGrid = document.querySelector('.product-grid2'); // 기존 클래스명 유지

        // 찜한 제품과 JSON 데이터 비교하여 일치하는 제품만 추가
        productData.forEach((product) => {
          if (heartData.product_codes.includes(product.e_name)) {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');

            // a 태그 생성
            const linkElement = document.createElement('a');
            linkElement.href = `/product_info_page?id=${product.e_name}`;
            linkElement.target = '_self';

            // img 태그 생성
            const imgElement = document.createElement('img');
            imgElement.src = `/image/product_list/product/${product.file_name}`;
            imgElement.alt = product.name;

            // a 태그에 img 태그 추가
            linkElement.appendChild(imgElement);

            // p 태그 생성
            const description = document.createElement('p');
            description.classList.add('product-name');
            description.textContent = product.name;


            // 찜 버튼 생성
            const heartButton = document.createElement('button');
            heartButton.classList.add('heart-button');
            heartButton.dataset.productCode = product.e_name; // 제품 코드 저장

            // 하트 이미지 초기 상태
            const heartImg = document.createElement('img');
            heartImg.src = '/image/icons/heart_empty.png'; // 기본 빈 하트 이미지
            heartImg.alt = '찜하기';
            heartButton.appendChild(heartImg);

            // 찜 버튼 클릭 이벤트
            heartButton.addEventListener('click', () => toggleHeart(product.e_name, heartButton));

            // 요소 추가
            productElement.appendChild(linkElement);
            productElement.appendChild(description);
            productGrid.appendChild(productElement);
            productElement.appendChild(heartButton); // 찜 버튼 추가
          }
        });
      })
      .catch((error) => console.error('제품 목록 로드 중 오류:', error));
  })
  .catch((error) => console.error('찜 목록 로드 중 오류:', error));



  //하트 관련 코드
  const updateHeartStatus = async () => {
    try {
      const response = await fetch('/api/heart');
      const data = await response.json(); // 응답을 객체로 받아옴
      const heartedProducts = data.product_codes || []; // 배열만 추출
  
      console.log("찜한 제품 목록:", heartedProducts);
  
      const heartButtons = document.querySelectorAll('.heart-button');
  
      heartButtons.forEach((button) => {
        const productCode = button.dataset.productCode;
        const heartImg = button.querySelector('img');
  
        if (heartedProducts.includes(productCode)) {
          button.classList.add('hearted');
          heartImg.src = '/image/icons/heart_filled.png'; // 찬 하트 이미지
        } else {
          button.classList.remove('hearted');
          heartImg.src = '/image/icons/heart_empty.png'; // 빈 하트 이미지
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
      const heartImg = button.querySelector('img');
      if (button.classList.contains('hearted')) {
        // 찜 해제 요청
        console.log("코드", productCode);
        await fetch(`/api/heart/remove/${productCode}`, { method: 'DELETE' });
        button.classList.remove('hearted');
        heartImg.src = '/image/icons/heart_empty.png'; // 빈 하트 이미지
      } else {
        // 찜 추가 요청
        console.log("코드", productCode);
        await fetch('/api/heart/add', {
          
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_code: productCode }),
        });
        button.classList.add('hearted');
        heartImg.src = '/image/icons/heart_filled.png'; // 찬 하트 이미지
      }
    } catch (error) {
      console.error('찜 상태 변경 오류:', error);
    }
  };

