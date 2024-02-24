import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { getAllBlogsWithParams } from "../../services/blogApis";
import { IBlog } from "../../types";
import BlogForm from "./components/BlogForm";
import { useEffect, useState } from "react";

export default function BlogFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Blogs", link: "/dashboard/blogs" },
    { title: isEdit ? "Edit" : "Create", link: `/dashboard/blogs/${id}` },
  ];
  const [data, setData] = useState<IBlog | null>(null);
  useEffect(() => {
    if (isEdit) {
      getAllBlogsWithParams(`/${id}`).then((response) => {
        setData(response.data);
      });
    }
  }, [id, isEdit]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={isEdit ? "Edit Blog" : "Create Blog"}
            description={isEdit ? "Edit blog details" : "Create new blog"}
          />
        </div>
        <Separator />
        {data && isEdit && (
          <BlogForm
            isEdit={isEdit}
            defaultValues={
              data
                ? {
                    title: data.title,
                    videoUrl: data.videoUrl,
                    description: data.description,
                    content: data.content,
                  }
                : {
                    title: "",
                    videoUrl: "",
                    description: "",
                    content: "",
                  }
            }
          />
        )}
        {!isEdit && <BlogForm isEdit={isEdit} />}
      </div>
    </>
  );
}
