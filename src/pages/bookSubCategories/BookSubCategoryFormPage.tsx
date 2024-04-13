import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/bookCategoryApis";
import { ICategory, ISubCategory } from "../../types";
import { getBookSubCategories } from "../../services/bookSubCategoryApis";
import BookSubCategoryForm from "./components/BookSubCategoryForm";

export default function BookSubCategoryFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Book sub categories", link: "/dashboard/bookSubCategories" },
    {
      title: isEdit ? "Edit" : "Create",
      link: `/dashboard/bookSubCategories/${id}`,
    },
  ];
  // isLoading, error,
  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ["bookSubCategories", id],
    queryFn: async () => {
      const response = await getBookSubCategories(`/${id}`);
      return response.data as ISubCategory;
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["bookCategories", `limit-1000`],
    queryFn: async () => {
      const response = await getCategories(`?page=limit-1000`);
      return response.data as ICategory[];
    },
  });
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={
              isEdit ? "Edit book sub category" : "Create book sub category"
            }
            description={
              isEdit
                ? "Edit book sub category details"
                : "Create new book sub category"
            }
          />
        </div>
        <Separator />
        {data && isEdit && (
          <BookSubCategoryForm
            categories={categories}
            isEdit={isEdit}
            defaultValues={
              data
                ? {
                    title: data.title,
                    categoryBook: data.categoryBook._id,
                  }
                : {
                    title: "",
                    categoryBook: "",
                  }
            }
          />
        )}
        {!isEdit && (
          <BookSubCategoryForm categories={categories} isEdit={isEdit} />
        )}
      </div>
    </>
  );
}
