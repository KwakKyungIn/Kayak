    // API URL 설정 (예: 서버가 로컬에서 실행 중이면 http://localhost:포트번호로 설정)
    const apiBaseUrl = "http://localhost:3000/api/cart";

    // 장바구니에 항목 추가
    async function addToCart(productId, quantity) {
        try {
            const response = await fetch(`${apiBaseUrl}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                }),
            });
            const data = await response.json();
            console.log("Add to Cart Response:", data);
            alert("장바구니에 추가되었습니다!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("장바구니 추가에 실패했습니다.");
        }
    }

    // 장바구니에서 항목 제거
    async function removeFromCart(cartId) {
        try {
            const response = await fetch(`${apiBaseUrl}/remove/${cartId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log("Remove from Cart Response:", data);
            alert("장바구니에서 삭제되었습니다!");
        } catch (error) {
            console.error("Error removing from cart:", error);
            alert("장바구니 삭제에 실패했습니다.");
        }
    }

    // 장바구니 조회
    async function getCart() {
        try {
            const response = await fetch(`${apiBaseUrl}/`);
            
            const data = await response.json();
            console.log("Get Cart Response:", data);
            alert("장바구니 데이터는 콘솔을 확인하세요!");
        } catch (error) {
            console.error("Error fetching cart:", error);
            alert("장바구니 조회에 실패했습니다.");
        }
    }
