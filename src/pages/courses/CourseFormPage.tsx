import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getAllCoursesWithParams } from "../../services/courseApis";
import { ICategory, ICourse } from "../../types";
import CourseForm from "./components/CourseForm";
import { getCategories } from "../../services/categoryApis";

export default function CourseFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Courses", link: "/dashboard/courses" },
    { title: isEdit ? "Edit" : "Create", link: `/dashboard/courses/${id}` },
  ];
  // isLoading, error,
  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ["courses", id],
    queryFn: async () => {
      const response = await getAllCoursesWithParams(`/${id}`);
      return response.data as ICourse;
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["categories", `limit-1000`],
    queryFn: async () => {
      const response = await getCategories(`?page=limit-1000`);
      return response.data as ICategory[];
    },
  });
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={isEdit ? "Edit Course" : "Create Course"}
            description={isEdit ? "Edit course details" : "Create new course"}
          />
        </div>
        <Separator />
        {data && isEdit && (
          <CourseForm
            categories={categories}
            isEdit={isEdit}
            defaultValues={{
              title: data.title,
              description: data.description,
              category: data.category._id,
              price: `${data.price}`,
              priceAfterDiscount: `${data.priceAfterDiscount}`,
            }}
          />
        )}
        {!isEdit && <CourseForm categories={categories} isEdit={isEdit} />}
      </div>
    </>
  );
}
