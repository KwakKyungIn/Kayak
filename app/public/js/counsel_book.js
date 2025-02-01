
//예약 테이블 생성 관련 스크립트
document.addEventListener("DOMContentLoaded", () => {
const form = document.querySelector(".form-container");
const nextButton = document.querySelector(".next-btn");

nextButton.addEventListener("click", async (event) => {
event.preventDefault();

const generateReservationId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const reservation_id = generateReservationId();
const customer_name = document.querySelector(".form-group input.name")?.value;
const phone_prefix = document.querySelector(".form-group .inline-fields select.small-input-mobile")?.value; 
const phone_number = phone_prefix + document.querySelector(".form-group input.small-input-mobile").value;
const backup_prefix = document.querySelector(".form-group .inline-fields select.small-input-backup-phone").value;
const backup_phone_number = backup_prefix + document.querySelector(".form-group input.small-input-backup-phone").value;
const rental_date = document.querySelector(".form-group .inline-fields input.small-input-counsel-date").value + " " + document.querySelector(".form-group .inline-fields select.small-input-time1").value + " " + document.querySelector(".form-group .inline-fields select.small-input-clock1").value;
const counsel_date = document.querySelector(".form-group .inline-fields input.small-input-rent-date").value + " " + document.querySelector(".form-group .inline-fields select.small-input-time2").value + " " + document.querySelector(".form-group .inline-fields select.small-input-clock2").value;
const email = document.querySelector(".form-group input.email").value;
const venue_address = document.querySelector(".form-group-top .form-group-detail .inline-fields input.small-input-postcode").value + " " + document.querySelector(".form-group-top .form-group-detail .inline-fields input.roadAddress").value + " " + document.querySelector(".form-group-top .form-group-detail .inline-fields input.detailAddress").value;
const requests = document.querySelector(".form-group-top textarea.requests").value;

try {
  const response = await fetch("/api/reservations/add-with-products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reservation_id,
      customer_name,
      phone_number,
      backup_phone_number,
      rental_date,
      counsel_date,
      email,
      venue_address,
      requests,
    }),
  });

  const result = await response.json();
  if (response.ok) {
    alert("예약이 완료되었습니다!");
    window.location.href = "book_done";
  } else {
    alert("오류 발생: " + result.message);
  }
} catch (error) {
  console.error("Error:", error);
  alert("서버 오류가 발생했습니다.");
}
});
});

//예약 관련 끝



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


} catch (error) {
console.error('장바구니 데이터를 불러오는 중 오류 발생:', error);
}
}

document.addEventListener('DOMContentLoaded', loadCartItems);


function execDaumPostcode() {
new daum.Postcode({
    oncomplete: function(data) {
        // 우편번호와 주소 정보를 해당 필드에 자동 입력
        document.getElementById('postcode').value = data.zonecode; // 우편번호
        document.getElementById('roadAddress').value = data.roadAddress; // 도로명 주소
    }
}).open();
}