window.onload = () => {
    // 드롭다운 버튼 클릭 이벤트
    document.querySelector('.dropbtn').onclick = () => {
        dropdown();
    };

    // 각 메뉴 항목에 클릭 이벤트 추가
    let fastfoods = document.getElementsByClassName('fastfood');
    for (let i = 0; i < fastfoods.length; i++) {
        fastfoods[i].onclick = function () {
            showMenu(this.innerText); // 선택된 메뉴의 텍스트를 전달
        };
    }
};

// 드롭다운 열고 닫기
let dropdown = () => {
    let v = document.querySelector('.dropdown-content');
    let dropbtn = document.querySelector('.dropbtn');
    v.classList.toggle('show');
    dropbtn.style.borderColor = v.classList.contains('show') ? '#3992a8' : 'rgb(94, 94, 94)';
};

// 선택된 메뉴 표시
let showMenu = (value) => {
    let dropbtn_icon = document.querySelector('.dropbtn_icon');
    let dropbtn_content = document.querySelector('.dropbtn_content');
    let dropbtn = document.querySelector('.dropbtn');

    dropbtn_icon.innerText = '';
    dropbtn_content.innerText = value;
    dropbtn_content.style.color = '#252525';
    dropbtn.style.borderColor = '#3992a8';
};

// 드롭다운 외부 클릭 시 닫기
window.onclick = (e) => {
    if (!e.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
    const images = document.querySelectorAll(".slider img");
    const pagination = document.querySelector(".pagination");

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
    document.querySelector(".arrow.next").addEventListener("click", function () {
        currentIndex++;
        if (currentIndex > slideCount) currentIndex = 0; // 안전 처리
        updateSlider();
    });

    document.querySelector(".arrow.prev").addEventListener("click", function () {
        currentIndex--;
        if (currentIndex < -1) currentIndex = slideCount - 1; // 안전 처리
        updateSlider();
    });

    // 화면 크기 조정 시 위치 재조정
    window.addEventListener("resize", function () {
        slider.style.transition = "none";
        slider.style.transform = `translateX(-${(currentIndex + 1) * images[0].clientWidth}px)`;
    });
});
