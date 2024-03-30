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
import { useState } from "react";
import { toast } from "../../../components/ui/use-toast";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { MdOutlineSell } from "react-icons/md";
import { axiosInstance } from "../../../services/axios.config";
import { cn } from "../../../lib/utils";
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
            <TableHead>Status</TableHead>
            <TableHead>Paid at</TableHead>
            <TableHead>Paid with</TableHead>
            <TableHead>Recive</TableHead>
            <TableHead className="w-24"></TableHead>
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
  refetch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deleteHandler = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.put(`/orders/acceptOrder/${order._id}`);
      toast({
        title: "Success",
        description: "Order marked as paid successfully",
      });
    } catch (err) {
      toast({
        title: "Failed",
        description: "Something went wrong",
      });
    } finally {
      setIsOpen(false);
      setIsLoading(false);
      refetch();
    }
  };
  console.log(order);
  return (
    <>
      <TableRow>
        <TableCell>{order.totalOrderPrice}</TableCell>
        <TableCell>{order.course?.title}</TableCell>
        <TableCell>{order.user?.email}</TableCell>
        <TableCell>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-white font-semibold",
              order.status === "pending" && "bg-yellow-400",
              order.status === "accepted" && "bg-green-400"
            )}
          >
            {order.status}
          </span>
        </TableCell>
        <TableCell>{new Date(order.paidAt).toDateString()}</TableCell>
        <TableCell>{order.paymentMethodType}</TableCell>{" "}
        <TableCell>
          <Button variant={"link"} asChild>
            <a href={order.paymentReceipt} target="_blank">
              open
            </a>
          </Button>
        </TableCell>{" "}
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant="outline">
                <BsThreeDots />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <button
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <MdOutlineSell size={18} /> Make it paid{" "}
                </button>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={isOpen}>
            <AlertDialogTrigger></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will give access of this course to this user
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isLoading}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction disabled={isLoading} onClick={deleteHandler}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      </TableRow>
    </>
  );
};
