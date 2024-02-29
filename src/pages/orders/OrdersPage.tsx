import { Plus } from "lucide-react";
import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import OrdersTable from "./components/OrdersTable";
import { useState } from "react";
import { IPagination, IOrder } from "../../types";
import PaginationHandler from "../../components/PaginationHandler";
import { axiosInstance } from "../../services/axios.config";
const breadcrumbItems = [{ title: "Orders", link: "/dashboard/orders" }];

export default function OrdersPage() {
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 50,
    numberOfPages: 1,
    results: 0,
  });
  console.log(pagination);
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["orders", `page=${pagination.currentPage}`],
    queryFn: async () => {
      const response = await axiosInstance.get("/orders");
      const responseData = response.data as {
        paginationResult: IPagination;
        data: IOrder[];
        results: number;
      };
      console.log(responseData);
      setPagination((prev) => ({
        ...prev,
        numberOfPages: responseData.paginationResult.numberOfPages,
        results: responseData.results,
      }));
      return responseData.data as IOrder[];
    },
  });
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Orders (${pagination.results})`}
            description="Manage orders"
          />

          <Button asChild>
            <Link to={"/dashboard/orders/new"}>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </Button>
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
