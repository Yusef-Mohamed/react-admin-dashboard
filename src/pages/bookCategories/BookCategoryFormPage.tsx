import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/bookCategoryApis";
import { ICategory } from "../../types";
import BookCategoryForm from "./components/BookCategoryForm";

export default function BookCategoryFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Categories", link: "/dashboard/bookCategories" },
    {
      title: isEdit ? "Edit" : "Create",
      link: `/dashboard/bookCategories/${id}`,
    },
  ];
  // isLoading, error,
  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ["bookCategories", id],
    queryFn: async () => {
      const response = await getCategories(`/${id}`);
      return response.data as ICategory;
    },
  });
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={isEdit ? "Edit book category" : "Create book category"}
            description={
              isEdit ? "Edit book category details" : "Create new book category"
            }
          />
        </div>
        <Separator />
        {data && isEdit && (
          <BookCategoryForm
            isEdit={isEdit}
            defaultValues={
              data
                ? {
                    title: data.title,
                  }
                : {
                    title: "",
                  }
            }
          />
        )}
        {!isEdit && <BookCategoryForm isEdit={isEdit} />}
      </div>
    </>
  );
}
