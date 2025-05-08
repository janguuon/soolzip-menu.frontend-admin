import { json } from "@remix-run/node";
import { useLoaderData, useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useState, useCallback } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useOrderStore } from "~/store/orderStore";

type Order = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  customerName?: string;
};

type LoaderData = {
  orders: Order[];
};

// 임시 칵테일 데이터
export const cocktails = {
  "1": {
    name: "모히토",
    image: "/모히또.png",
    ingredients: [
      "화이트 럼 60ml",
      "라임 주스 30ml",
      "설탕 2티스푼",
      "민트 잎 6-8장",
      "소다수 적당량"
    ],
    instructions: [
      "하이볼 글라스에 민트 잎과 설탕을 넣고 민트의 향이 날 때까지 으깹니다.",
      "라임 주스와 럼을 넣고 잘 섞어줍니다.",
      "얼음을 채우고 소다수로 가득 채웁니다.",
      "민트 잎으로 장식하여 완성합니다."
    ],
    description:
      "상큼한 라임과 향긋한 민트가 어우러진 쿠바의 대표적인 칵테일입니다. 여름철 더위를 날려주는 상쾌한 맛이 특징입니다."
  },
  "2": {
    name: "마르가리타",
    image: "/마르가리따.png",
    ingredients: [
      "테킬라 50ml",
      "트리플 섹 20ml",
      "라임 주스 30ml",
      "소금 적당량"
    ],
    instructions: [
      "글라스의 테두리를 라임으로 적신 후 소금을 묻힙니다.",
      "셰이커에 얼음과 모든 재료를 넣고 잘 흔들어줍니다.",
      "소금이 묻은 글라스에 스트레이너를 사용해 부어줍니다.",
      "라임 슬라이스로 장식하여 완성합니다."
    ],
    description:
      "테킬라를 베이스로 한 클래식 칵테일로, 상큼한 라임과 소금의 조화가 특징입니다. 1948년에 태어난 이 칵테일은 전 세계적으로 사랑받고 있습니다."
  },
  "3": {
    name: "블루 하와이안",
    image: "/블루하와이안.png",
    ingredients: [
      "화이트 럼 30ml",
      "블루라소 30ml",
      "파인애플 주스 60ml",
      "코코넛 크림 30ml"
    ],
    instructions: [
      "블렌더에 모든 재료를 넣습니다.",
      "얼음을 넣고 부드럽게 될 때까지 블렌딩합니다.",
      "하이볼 글라스에 부어줍니다.",
      "파인애플 슬라이스와 체리로 장식하여 완성합니다."
    ],
    description:
      "파란색이 인상적인 트로피컬 칵테일로, 달콤하고 부드러운 맛이 특징입니다. 파인애플과 코코넛의 풍미가 하와이의 정취를 느끼게 합니다."
  },
  "4": {
    name: "갓파더",
    image: "/갓파더.png",
    ingredients: ["스카치 위스키 45ml", "아마레또 15ml", "얼음"],
    instructions: [
      "얼음을 채운 록스 글라스에 스카치 위스키를 넣습니다.",
      "아마레또를 추가합니다.",
      "가볍게 저어 섞어줍니다."
    ],
    description:
      "스카치 위스키와 아마레또의 조화가 특징인 클래식 칵테일입니다. 부드럽고 달콤한 맛이 인상적입니다."
  },
  "5": {
    name: "우우",
    image: "/우우.png",
    ingredients: [
      "보드카 30ml",
      "말리부 30ml",
      "크랜베리 주스 60ml",
      "라임 주스 15ml"
    ],
    instructions: [
      "셰이커에 모든 재료를 넣습니다.",
      "얼음을 추가하고 잘 흔들어줍니다.",
      "얼음을 채운 글라스에 스트레이너를 사용해 부어줍니다."
    ],
    description:
      "상큼한 크랜베리와 코코넛의 달콤한 맛이 어우러진 칵테일입니다. 부드럽고 달콤한 맛이 특징입니다."
  },
  "6": {
    name: "하이볼",
    image: "/하이볼.png",
    ingredients: ["위스키 45ml", "소다수 적당량", "레몬 슬라이스", "얼음"],
    instructions: [
      "얼음을 채운 하이볼 글라스에 위스키를 넣습니다.",
      "소다수로 채웁니다.",
      "레몬 슬라이스로 장식합니다."
    ],
    description:
      "위스키와 소다수의 조화가 특징인 클래식 칵테일입니다. 깔끔하고 상쾌한 맛이 인상적입니다."
  },
  "7": {
    name: "오르가즘",
    image: "/오르가즘.png",
    ingredients: [
      "보드카 30ml",
      "아마레또 15ml",
      "트리플 섹 15ml",
      "오렌지 주스 30ml"
    ],
    instructions: [
      "셰이커에 모든 재료를 넣습니다.",
      "얼음을 추가하고 잘 흔들어줍니다.",
      "얼음을 채운 글라스에 스트레이너를 사용해 부어줍니다."
    ],
    description:
      "달콤하고 과일향이 풍부한 칵테일입니다. 부드러운 맛과 향이 특징입니다."
  },
  "8": {
    name: "깔루아 밀크",
    image: "/깔루아밀크.png",
    ingredients: ["깔루아 45ml", "우유 90ml", "얼음"],
    instructions: [
      "얼음을 채운 글라스에 깔루아를 넣습니다.",
      "우유를 추가합니다.",
      "가볍게 저어 섞어줍니다."
    ],
    description:
      "깔루아와 우유의 부드러운 조화가 특징인 칵테일입니다. 달콤하고 크리미한 맛이 인상적입니다."
  },
  "9": {
    name: "블랙 러시안",
    image: "/블랙러시안.png",
    ingredients: ["보드카 45ml", "깔루아 15ml", "얼음"],
    instructions: [
      "얼음을 채운 글라스에 보드카를 넣습니다.",
      "깔루아를 추가합니다.",
      "가볍게 저어 섞어줍니다."
    ],
    description:
      "보드카와 깔루아의 조화가 특징인 클래식 칵테일입니다. 강렬하고 달콤한 맛이 인상적입니다."
  },
  "10": {
    name: "쓸쓸함",
    image: "/쓸쓸함.png",
    ingredients: ["쓸쓸함 45ml", "깔루아 15ml", "얼음"],
    instructions: [
      "얼음을 채운 글라스에 보드카를 넣습니다.",
      "깔루아를 추가합니다.",
      "가볍게 저어 섞어줍니다."
    ],
    description: "쓸쓸함 한잔 주시오."
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = await fetch(
      "https://soolzip-menu-backend.onrender.com/api/orders",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      console.error("서버 응답 오류:", response.status, response.statusText);
      return json({ orders: [] });
    }

    const orders = await response.json();
    console.log("백엔드에서 받은 주문 데이터:", orders);
    return json({ orders });
  } catch (error) {
    console.error("주문 데이터 로딩 중 오류:", error);
    return json({ orders: [] });
  }
}

export default function AdminDashboard() {
  const { orders: initialOrders } = useLoaderData<typeof loader>();
  const { orders, setOrders, removeOrder, removeCocktail } = useOrderStore();
  const [error, setError] = useState<string | null>(null);
  const fetcher = useFetcher<LoaderData>();
  const navigate = useNavigate();

  // 초기 주문 데이터 설정
  useEffect(() => {
    if (initialOrders.length > 0) {
      console.log("초기 주문 데이터:", initialOrders);
      // 데이터 타입 변환
      const processedOrders = initialOrders.map((order: Order) => ({
        ...order,
        price: Number(order.price),
        quantity: Number(order.quantity)
      }));
      setOrders(processedOrders);
    }
  }, [initialOrders]);

  // 주문 삭제 함수
  const handleDeleteOrder = async (orderId: string) => {
    try {
      setError(null); // 오류 상태 초기화

      // backend API 호출
      const response = await fetch(
        `https://soolzip-menu-backend.onrender.com/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "주문 삭제에 실패했습니다.");
      }

      // 로컬 상태 업데이트
      removeOrder(orderId);
      console.log(`주문 ID ${orderId} 삭제 완료`);

      // 주문 목록 새로고침
      fetcher.load("/");
    } catch (error) {
      console.error("주문 삭제 중 오류:", error);
      setError(
        error instanceof Error
          ? error.message
          : "주문 삭제 중 오류가 발생했습니다."
      );
    }
  };

  // 칵테일 메뉴 삭제 함수
  const handleDeleteCocktail = (cocktailName: string) => {
    try {
      setError(null); // 오류 상태 초기화
      removeCocktail(cocktailName);
      console.log(`칵테일 ${cocktailName} 삭제 완료`);
    } catch (error) {
      console.error("칵테일 삭제 중 오류:", error);
      setError("칵테일 삭제 중 오류가 발생했습니다.");
    }
  };

  // 주기적으로 주문 데이터 업데이트
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("\n=== 주문 데이터 자동 업데이트 ===");
        console.log("요청 시간:", new Date().toLocaleString("ko-KR"));

        const response = await fetch(
          "https://soolzip-menu-backend.onrender.com/api/orders",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log("받은 데이터:", data);

        // 데이터 타입 변환
        const processedOrders = data.map((order: Order) => ({
          ...order,
          price: Number(order.price),
          quantity: Number(order.quantity)
        }));

        // 전체 주문 목록 업데이트
        setOrders(processedOrders);
        console.log("처리된 데이터:", processedOrders);
        console.log("=====================\n");
      } catch (error) {
        console.error("데이터 업데이트 중 오류:", error);
      }
    };

    // 초기 데이터 요청
    fetchData();

    const interval = setInterval(fetchData, 5000); // 5초마다 업데이트

    return () => clearInterval(interval);
  }, []); // fetcher 의존성 제거

  // 시간 포맷팅 함수
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  // 레시피 페이지로 이동하는 함수
  const handleViewRecipe = (menuName: string) => {
    navigate(`/recipe/${menuName}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">주문 관리</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">현재 주문 목록</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">현재 주문이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{order.name}</h3>
                      <p className="text-gray-600">
                        주문자: {order.customerName || "미입력"}
                      </p>
                      <p className="text-gray-600">
                        수량: {Number(order.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        주문 시간: {formatDateTime(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-semibold">
                        {(
                          Number(order.price) * Number(order.quantity)
                        ).toLocaleString()}
                        원
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewRecipe(order.name)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          레시피
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                          주문 삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
