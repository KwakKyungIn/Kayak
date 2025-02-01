async function loadReservationProducts(reservationId) {
  try {
    const response = await fetch('/api/reservation-by-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation_id: reservationId })
    });
    
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      console.warn("불러온 제품 데이터가 없습니다.");
      return;
    }

    const tableBody = document.querySelector('#dynamic-table-2 tbody');
    tableBody.innerHTML = '';

    const formatPrice = (price) => {
      return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 });
    };

    let totalQuantity = 0;
    let totalOrderAmount = 0;
    let totalDiscount = 0;

    data.products.forEach((item, index) => {
      const paymentAmount = item.product_price_at_booking - item.discount_price_at_booking;

      totalQuantity += item.quantity;
      totalOrderAmount += item.product_price_at_booking * item.quantity;
      totalDiscount += item.discount_price_at_booking * item.quantity;

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

      const optionRow = `
        <tr class="option-row" data-product-id="${item.product_code}"> 
          <td colspan="3">
            선택${index + 1}: [${item.product_name} / ${formatPrice(item.product_price_at_booking)}원] 
            [수량: ${item.quantity}개] 
            [컬러: ${item.product_color}]
          </td>
        </tr>
      `;

      tableBody.innerHTML += productRow + optionRow;
    });

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
        <hr>
        <div class="order-detail total">
          <span class="label"><strong>최종 결제 금액</strong></span>
          <span class="value" style="color: red;"><strong>${formatPrice(totalOrderAmount - totalDiscount)}</strong></span>
          <span class="value2"><strong>원</strong></span>
        </div>
      `;
    }

    const customer = data.customer;
    if (customer) {
      document.querySelectorAll('.form-group-fixed')[0].textContent = customer.customer_name;
      document.querySelectorAll('.form-group-fixed')[1].textContent = customer.phone_number;
      document.querySelectorAll('.form-group-fixed')[2].textContent = customer.backup_phone_number;
      document.querySelectorAll('.form-group-fixed')[3].textContent = customer.rental_date;
      document.querySelectorAll('.form-group-fixed')[4].textContent = customer.email;

      const addressParts = customer.venue_address.split(' ');
      const postalCode = addressParts.shift();
      const fullAddress = addressParts.join(' ');

      document.querySelectorAll('.form-group-fixed')[5].textContent = postalCode;
      document.querySelectorAll('.form-group-fixed')[6].textContent = fullAddress;
      document.querySelectorAll('.reservation_id')[0].textContent = customer.reservation_id;

      document.querySelector('#requests').value = customer.requests;
    }
  } catch (error) {
    console.error('제품 및 고객 데이터를 불러오는 중 오류 발생:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loadButton = document.querySelector('#load-reservation-btn');
  if (loadButton) {
    loadButton.addEventListener('click', () => {
      const reservationId = document.querySelector('#reservation-id').value;
      if (reservationId) {
        loadReservationProducts(reservationId);
      } else {
        alert('예약 코드를 입력해주세요.');
      }
    });
  }
});
