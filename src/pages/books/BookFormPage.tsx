import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getAllBooksWithParams } from "../../services/bookApis";
import { IBook } from "../../types";
import BookForm from "./components/BookForm";

export default function BookFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Books", link: "/dashboard/books" },
    { title: isEdit ? "Edit" : "Create", link: `/dashboard/books/${id}` },
  ];
  // isLoading, error,
  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ["books", id],
    queryFn: async () => {
      const response = await getAllBooksWithParams(`/${id}`);
      return response.data as IBook;
    },
  });
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={isEdit ? "Edit Book" : "Create Book"}
            description={isEdit ? "Edit book details" : "Create new book"}
          />
        </div>
        <Separator />
        {data && isEdit && (
          <BookForm
            isEdit={isEdit}
            category={data?.categoryBook?._id}
            subCategory={data?.subCategories?._id}
            defaultValues={{
              title: data.title,
              bookUrl: data.bookUrl,
              country: data.country,
              date: new Date(data.date),
            }}
          />
        )}
        {!isEdit && <BookForm isEdit={isEdit} />}
      </div>
    </>
  );
}
