import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import OrdersTable from "./components/OrdersTable";
import { useState } from "react";
import { IPagination, IOrder } from "../../types";
import PaginationHandler from "../../components/PaginationHandler";
import { axiosInstance } from "../../services/axios.config";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const breadcrumbItems = [{ title: "Orders", link: "/dashboard/orders" }];

export default function OrdersPage() {
  const [status, setStatus] = useState<string>("pending");
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 50,
    numberOfPages: 1,
    results: 0,
  });
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["orders", `page=${pagination.currentPage}`],
    queryFn: async () => {
      const response = await axiosInstance.get(`/orders?status=${status}`);
      const responseData = response.data as {
        paginationResult: IPagination;
        data: IOrder[];
        results: number;
      };
      setPagination((prev) => ({
        ...prev,
        numberOfPages: responseData.paginationResult.numberOfPages,
        results: responseData.results,
      }));
      return responseData.data as IOrder[];
    },
  });
  console.log(data);
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Orders (${pagination.results})`}
            description="Manage orders"
          />
        </div>
        <Separator />
        <div>
          <Label className="block mb-4">Status</Label>
          <Select
            onValueChange={(value) => {
              setStatus(value);
              setTimeout(() => {
                refetch();
              }, 100);
            }}
            defaultValue={status}
          >
            <SelectTrigger className="w-[180px] border text-start rounded-md px-4 py-2">
              <SelectValue placeholder="Pending" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />

        <OrdersTable
          orders={data || []}
          isLoading={isLoading || isRefetching}
          error={error}
          refetch={refetch}
        />
        <PaginationHandler
          page={pagination.currentPage}
          totalPages={pagination.numberOfPages}
          onChange={(page) => {
            setPagination((prev) => ({ ...prev, currentPage: page }));
            refetch();
          }}
        />
      </div>
    </>
  );
}
