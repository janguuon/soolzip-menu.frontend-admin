export interface Order {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  customerName?: string;
}
