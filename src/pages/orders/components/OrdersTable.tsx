import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { IOrder } from "../../../types";
import { Skeleton } from "../../../components/ui/skeleton";
interface IOrdersTableProps {
  orders: IOrder[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
const OrdersTable: React.FC<IOrdersTableProps> = ({
  error,
  isLoading,
  orders,
  refetch,
}) => {
  return (
    <>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Total Price</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>User email</TableHead>
            <TableHead>Is paid</TableHead>
            <TableHead>Paid at</TableHead>
            <TableHead>Paid with</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-red-500">
                {error.message}
              </TableCell>
            </TableRow>
          )}
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={"skeleton" + i}>
                <TableCell className="text-center">
                  <Skeleton className="w-full p-2 rounded-xl" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-full p-2 rounded-xl" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-full p-2 rounded-xl" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-full p-2 rounded-xl" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-full p-2 rounded-xl" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-full p-2 rounded-xl" />
                </TableCell>
              </TableRow>
            ))}
          {!isLoading &&
            orders.map((order) => (
              <OrderRow refetch={refetch} key={order._id} order={order} />
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdersTable;

const OrderRow: React.FC<{ order: IOrder; refetch: () => void }> = ({
  order,
}) => {
  return (
    <>
      <TableRow>
        <TableCell>{order.totalOrderPrice}</TableCell>
        <TableCell>{order.course?.title}</TableCell>
        <TableCell>{order.user?.email}</TableCell>
        <TableCell>{order.isPaid ? "yes" : "no"}</TableCell>
        <TableCell>{new Date(order.paidAt).toDateString()}</TableCell>
        <TableCell>{order.paymentMethodType}</TableCell>
      </TableRow>
    </>
  );
};
