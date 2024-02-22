import { Plus } from "lucide-react";
import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import CategoriesTable from "./components/CategoriesTable";
import { useState } from "react";
import { IPagination, ICategory } from "../../types";
import PaginationHandler from "../../components/PaginationHandler";
import { getCategories } from "../../services/categoryApis";
const breadcrumbItems = [
  { title: "Categories", link: "/dashboard/categories" },
];

export default function CategoriesPage() {
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 50,
    numberOfPages: 1,
    results: 0,
  });
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["categories", `page=${pagination.currentPage}`],
    queryFn: async () => {
      const response = await getCategories(`?page=${pagination.currentPage}`);
      setPagination((prev) => ({
        ...prev,
        numberOfPages: response.paginationResult.numberOfPages,
        results: response.results,
      }));
      return response.data as ICategory[];
    },
  });
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Categories (${pagination.results})`}
            description="Manage categories"
          />

          <Button asChild>
            <Link to={"/dashboard/categories/new"}>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </Button>
        </div>
        <Separator />

        <CategoriesTable
          categories={data || []}
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
