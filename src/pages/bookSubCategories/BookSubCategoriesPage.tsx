import { Plus } from "lucide-react";
import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IPagination, ISubCategory } from "../../types";
import PaginationHandler from "../../components/PaginationHandler";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";

// import { getCategories } from "../../services/bookCategoryApis";
import { getBookSubCategories } from "../../services/bookSubCategoryApis";
import BookSubCategoriesTable from "./components/BookSubCategoriesTable";
const breadcrumbItems = [
  { title: "Book sub categories", link: "/dashboard/bookSubCategories" },
];

export default function BookSubCategoriesPage() {
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 50,
    numberOfPages: 1,
    results: 0,
  });
  // const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["bookSubCategories", `page=${pagination.currentPage}`],
    queryFn: async () => {
      const response = await getBookSubCategories();
      setPagination((prev) => ({
        ...prev,
        numberOfPages: response.paginationResult.numberOfPages,
        results: response.results,
      }));
      return response.data as ISubCategory[];
    },
  });
  // const { data: categories } = useQuery({
  //   queryKey: ["bookCategories", `limit-1000`],
  //   queryFn: async () => {
  //     const response = await getCategories(`?page=limit-1000`);
  //     return response.data as ICategory[];
  //   },
  // });
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Book sub categories (${pagination.results})`}
            description="Manage book sub categories"
          />

          <Button asChild>
            <Link to={"/dashboard/bookSubCategories/new"}>
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Link>
          </Button>
        </div>

        <Separator />
        {/* <Select
          onValueChange={(e) => {
            setSelectedCategory(e);
            setTimeout(() => {
              refetch();
            }, 100);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a main category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
        <BookSubCategoriesTable
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
