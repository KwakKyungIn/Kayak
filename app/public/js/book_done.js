
async function loadReservationProducts() {
  try {
    const response = await fetch('/api/reservation-data'); // API 호출
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      console.warn("불러온 제품 데이터가 없습니다.");
      return;
    }

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
    data.products.forEach((item, index) => {
      const paymentAmount = item.product_price_at_booking - item.discount_price_at_booking; // 결제 금액 계산

      // 총합 계산
      totalQuantity += item.quantity;
      totalOrderAmount += item.product_price_at_booking * item.quantity;
      totalDiscount += item.discount_price_at_booking * item.quantity;

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
              <p>${formatPrice(item.product_price_at_booking)}원</p>
            </div>
          </td>
          <td>
            <p class="discount-amount">${formatPrice(item.discount_price_at_booking)}원</p>
          </td>
          <td>
            <p class="payment-amount">${formatPrice(paymentAmount)}원</p>
          </td>
        </tr>
      `;

      // 옵션 정보를 나타내는 행 생성
      const optionRow = `
        <tr class="option-row" data-product-id="${item.product_code}"> 
          <td colspan="3">
            선택${index + 1}: [${item.product_name} / ${formatPrice(item.product_price_at_booking)}원] 
            [수량: ${item.quantity}개] 
            [컬러: ${item.product_color}]
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

    // 고객 정보 업데이트
    const customer = data.customer;
    if (customer) {
      document.querySelectorAll('.form-group-fixed')[0].textContent = customer.customer_name;
      document.querySelectorAll('.form-group-fixed')[1].textContent = customer.phone_number;
      document.querySelectorAll('.form-group-fixed')[2].textContent = customer.backup_phone_number;
      document.querySelectorAll('.form-group-fixed')[3].textContent = customer.rental_date;
      document.querySelectorAll('.form-group-fixed')[4].textContent = customer.email;

      // 주소 데이터 분리 (우편번호 / 상세주소)
      const addressParts = customer.venue_address.split(' ');
      const postalCode = addressParts.shift(); // 첫 번째 값이 우편번호
      const fullAddress = addressParts.join(' '); // 나머지는 주소
      
      document.querySelectorAll('.form-group-fixed')[5].textContent = postalCode;
      document.querySelectorAll('.form-group-fixed')[6].textContent = fullAddress;
      
      document.querySelectorAll('.reservation_id')[0].textContent = customer.reservation_id;

      document.querySelector('#requests').value = customer.requests;
    }
  } catch (error) {
    console.error('제품 및 고객 데이터를 불러오는 중 오류 발생:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadReservationProducts);
