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

import cocktails from "../../menu.json";

type Cocktail = {
  name: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  description: string;
};

type CocktailMenu = {
  [key: string]: Cocktail;
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
