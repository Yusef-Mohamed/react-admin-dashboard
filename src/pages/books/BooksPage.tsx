import { Plus } from "lucide-react";
import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getAllBooksWithParams } from "../../services/bookApis";
import BooksTable from "./components/BooksTable";
import { useState } from "react";
import { IPagination, IBook } from "../../types";
import PaginationHandler from "../../components/PaginationHandler";
const breadcrumbItems = [{ title: "Books", link: "/dashboard/books" }];

export default function BooksPage() {
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 50,
    numberOfPages: 1,
    results: 0,
  });
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["books", `page=${pagination.currentPage}`],
    queryFn: async () => {
      const response = await getAllBooksWithParams(
        `?page=${pagination.currentPage}`
      );
      setPagination((prev) => ({
        ...prev,
        numberOfPages: response.paginationResult.numberOfPages,
        results: response.results,
      }));
      return response.data as IBook[];
    },
  });

  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Books (${pagination.results})`}
            description="Manage bookss"
          />

          <Button asChild>
            <Link to={"/dashboard/books/new"}>
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Link>
          </Button>
        </div>
        <Separator />

        <BooksTable
          books={data || []}
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
