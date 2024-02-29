import { Button } from "../../../components/ui/button";
import { Form, FormItem, FormLabel } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError, ICourse, IInputProps } from "../../../types";

import { AiFillDelete } from "react-icons/ai";
import FormFields from "../../../components/FormFields";
import { createLesson, editLesson } from "../../../services/lessonApis";
import { toast } from "../../../components/ui/use-toast";
import { AxiosError } from "axios";
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  course: z.string(),
  videoUrl: z.string(),
});

type LessonFormValue = z.infer<typeof formSchema>;
interface MyInputProps extends IInputProps {
  name: keyof LessonFormValue;
}

interface LessonFormProps {
  isEdit: boolean;
  defaultValues?: LessonFormValue;
  courses: ICourse[] | undefined;
}
const LessonForm: React.FC<LessonFormProps> = ({
  isEdit,
  courses,
  defaultValues = {
    title: "",
    course: "",
    videoUrl: "",
  },
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const nav = useNavigate();
  const inputs: MyInputProps[] = [
    {
      type: "text",
      label: "Title",
      placeholder: "Enter title",
      name: "title",
    },
    {
      type: "select",
      label: "Course",
      placeholder: "Select course",
      name: "course",
      values: courses?.map((course) => ({
        value: course._id,
        label: course.title,
      })),
    },
    {
      type: "text",
      label: "Video Url",
      placeholder: "Enter video url",
      name: "videoUrl",
    },
  ];
  const form = useForm<LessonFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (data: LessonFormValue) => {
    setLoading(true);
    setFormError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (image) {
      formData.append("image", image);
    }
    try {
      if (isEdit) {
        await editLesson(formData, id || "");
        toast({
          title: "Success",
          description: "Lesson updated successfully",
        });
        nav("/dashboard/lessons");
      } else {
        await createLesson(formData);
        toast({
          title: "Success",
          description: "Lesson created successfully",
        });
        nav("/dashboard/lessons");
      }
    } catch (error) {
      const typedError = error as AxiosError<{ errors: ApiError[] }>;
      typedError.response?.data.errors.map(({ param, msg }: ApiError) => {
        form.setError(param as keyof LessonFormValue, {
          type: "manual",
          message: msg,
        });
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full ">
          <div>
            <div className="flex items-center justify-center">
              <div className="w-40 h-40 mb-10 flex items-center justify-center relative">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : "https://via.placeholder.com/150"
                  }
                  alt="profile"
                  className="w-40 h-40"
                />
                {image && (
                  <button
                    className="absolute  right-0 w-8 h-8 bg-destructive rounded-full items-center justify-center text-background top-0 flex"
                    onClick={() => setImage(null)}
                  >
                    <AiFillDelete />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="gap-2 w-full mb-4 grid grid-cols-2">
            <FormItem>
              <FormLabel htmlFor="name">
                Image
                <span className="text-sm font-normal text-gray-700">
                  (optional)
                </span>
              </FormLabel>
              <Input
                type="file"
                className="text-foreground"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </FormItem>
            <FormFields<LessonFormValue>
              inputs={inputs}
              form={form}
              loading={loading}
              isEdit={isEdit}
            />
          </div>
          {formError && (
            <div className="text-red-500 text-sm mb-2">{formError}</div>
          )}
          <Button
            disabled={loading}
            size={"lg"}
            className="mx-auto w-fit block"
            type="submit"
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default LessonForm;
