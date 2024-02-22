import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getAllLessonsWithParams } from "../../services/lessonApis";
import { ICourse, ILesson } from "../../types";
import LessonForm from "./components/LessonForm";
import { getAllCoursesWithParams } from "../../services/courseApis";

export default function LessonFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Lessons", link: "/dashboard/lessons" },
    { title: isEdit ? "Edit" : "Create", link: `/dashboard/lessons/${id}` },
  ];
  // isLoading, error,
  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ["lessons", id],
    queryFn: async () => {
      const response = await getAllLessonsWithParams(`/${id}`);
      return response.data as ILesson;
    },
  });
  const { data: courses } = useQuery({
    queryKey: ["courses", `limit-1000`],
    queryFn: async () => {
      const response = await getAllCoursesWithParams(`?page=limit-1000`);
      return response.data as ICourse[];
    },
  });
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={isEdit ? "Edit Lesson" : "Create Lesson"}
            description={isEdit ? "Edit lesson details" : "Create new lesson"}
          />
        </div>
        <Separator />
        {data && isEdit && (
          <LessonForm
            courses={courses}
            isEdit={isEdit}
            defaultValues={
              data
                ? {
                    title: data.title,
                    videoUrl: data.videoUrl,
                    course: data.course._id,
                  }
                : {
                    title: "",
                    videoUrl: "",
                    course: "",
                  }
            }
          />
        )}
        {!isEdit && <LessonForm courses={courses} isEdit={isEdit} />}
      </div>
    </>
  );
}
