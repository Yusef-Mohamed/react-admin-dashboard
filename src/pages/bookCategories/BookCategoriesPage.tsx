import { Plus } from "lucide-react";
import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IPagination, ICategory } from "../../types";
import PaginationHandler from "../../components/PaginationHandler";
import { getCategories } from "../../services/bookCategoryApis";
import BookCategoriesTable from "./components/BookCategoriesTable";
const breadcrumbItems = [
  { title: "Book categories", link: "/dashboard/bookCategories" },
];

export default function BookCategoriesPage() {
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 50,
    numberOfPages: 1,
    results: 0,
  });
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["bookCategories", `page=${pagination.currentPage}`],
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
  console.log(data);
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Book categories (${pagination.results})`}
            description="Manage book categories"
          />

          <Button asChild>
            <Link to={"/dashboard/bookCategories/new"}>
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Link>
          </Button>
        </div>
        <Separator />

        <BookCategoriesTable
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
