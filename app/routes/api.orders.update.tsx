import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const data = await request.json();
    console.log("백엔드에서 받은 데이터:", data);

    // orders 배열이 있는지 확인
    if (!data.orders) {
      throw new Error("주문 데이터가 없습니다");
    }

    // orders 배열이 비어있는지 확인
    if (!Array.isArray(data.orders) || data.orders.length === 0) {
      throw new Error("주문 데이터가 유효하지 않습니다");
    }

    const response = {
      success: true,
      orders: data.orders
    };

    console.log("action 함수에서 반환하는 데이터:", response);
    return json(response);
  } catch (error) {
    console.error("주문 업데이트 중 오류 발생:", error);
    const errorResponse = {
      success: false,
      orders: [],
      error: error instanceof Error ? error.message : "주문 업데이트 실패"
    };
    console.log("action 함수에서 반환하는 에러 데이터:", errorResponse);
    return json(errorResponse, { status: 500 });
  }
}
