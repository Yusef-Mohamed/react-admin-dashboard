import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/categoryApis";
import { ICategory } from "../../types";
import CategoryForm from "./components/CategoryForm";

export default function CategoryFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Categories", link: "/dashboard/categories" },
    { title: isEdit ? "Edit" : "Create", link: `/dashboard/categories/${id}` },
  ];
  // isLoading, error,
  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await getCategories(`/${id}`);
      return response.data as ICategory;
    },
  });
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={isEdit ? "Edit Category" : "Create Category"}
            description={
              isEdit ? "Edit category details" : "Create new category"
            }
          />
        </div>
        <Separator />
        {data && isEdit && (
          <CategoryForm
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
        {!isEdit && <CategoryForm isEdit={isEdit} />}
      </div>
    </>
  );
}
