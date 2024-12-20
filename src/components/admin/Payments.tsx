import { ApiConfig } from "./payments/ApiConfig";
import { OrdersTable } from "./payments/OrdersTable";

export const Payments = () => {
  return (
    <div className="space-y-6">
      <ApiConfig />
      <OrdersTable />
    </div>
  );
};