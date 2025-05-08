import { TableColumn } from "react-data-table-component";
import { Order } from "../types/order";
import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";

const columns: TableColumn<Order>[] = [
  {
    name: "주문자",
    selector: (row: Order) => row.customerName || "미입력",
    sortable: true
  },
  {
    name: "주문번호",
    selector: (row: Order) => row.id,
    sortable: true
  },
  {
    name: "상품명",
    selector: (row: Order) => row.name,
    sortable: true
  },
  {
    name: "가격",
    selector: (row: Order) => row.price,
    sortable: true
  },
  {
    name: "수량",
    selector: (row: Order) => row.quantity,
    sortable: true
  },
  {
    name: "주문시간",
    selector: (row: Order) => {
      const date = new Date(row.created_at);
      return date.toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    },
    sortable: true
  }
];

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/orders");
        const data = await response.json();
        setOrders(data);

        // 주문 데이터 상세 정보 콘솔 출력
        console.log("주문 데이터 상세 정보:");
        data.forEach((order: Order) => {
          console.log({
            주문자: order.customerName || "미입력",
            주문번호: order.id,
            상품명: order.name,
            가격: order.price,
            수량: order.quantity,
            주문시간: new Date(order.created_at).toLocaleString()
          });
        });
      } catch (error) {
        console.error("주문 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchOrders();
  }, []);

  return <div>{/* Render your table component here */}</div>;
};

export default OrderTable;
