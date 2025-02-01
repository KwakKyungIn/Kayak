document.addEventListener("DOMContentLoaded", () => {
const submitButton = document.querySelector(".cart-button");

submitButton.addEventListener("click", async (event) => {
event.preventDefault();

const customer_name = document.getElementById("name").value.trim();
const phone_prefix = document.querySelector(".inline-fields select").value;
const phone_suffix = document.querySelector(".inline-fields input").value.trim();
const phone_number = `${phone_prefix}${phone_suffix}`;
const email = document.getElementById("email").value.trim();
const inquiry_type = document.querySelector(".small-input").value;
const inquiry_details = document.getElementById("requests").value.trim();
const agreement = document.querySelector(".personal").checked;

if (!customer_name || !phone_number || !email || !inquiry_type || !agreement) {
alert("필수 입력값을 모두 입력하고 개인정보 수집 동의에 체크해주세요.");
return;
}

try {
const response = await fetch("/api/add-inquiry", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
customer_name,
phone_number,
email,
inquiry_type,
inquiry_details,
}),
});

const result = await response.json();

if (response.ok) {
alert("문의가 성공적으로 접수되었습니다.");
location.reload();
} else {
alert(result.message || "문의 접수에 실패했습니다.");
}
} catch (error) {
console.error("문의 전송 오류:", error);
alert("서버 오류가 발생했습니다.");
}
});
});
