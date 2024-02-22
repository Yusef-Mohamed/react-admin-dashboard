import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError, IInputProps } from "../../../types";

import { AiFillDelete } from "react-icons/ai";

import FormFields from "../../../components/FormFields";
import { createBlog, editBlog } from "../../../services/blogApis";
import { toast } from "../../../components/ui/use-toast";
import { AxiosError } from "axios";
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  videoUrl: z.string(),
  description: z.string(),
});
type BlogFormValue = z.infer<typeof formSchema>;
interface MyInputProps extends IInputProps {
  name: keyof BlogFormValue;
}
interface BlogFormProps {
  isEdit: boolean;
  defaultValues?: BlogFormValue;
}
const BlogForm: React.FC<BlogFormProps> = ({
  isEdit,
  defaultValues = {
    title: "",
    description: "",
    videoUrl: "",
  },
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imageCover, setImageCover] = useState<File | null>(null);
  const nav = useNavigate();
  const inputs: MyInputProps[] = [
    {
      type: "text",
      label: "Title",
      placeholder: "Enter title",
      name: "title",
    },

    {
      type: "text",
      label: "Video Url",
      placeholder: "Enter video url",
      name: "videoUrl",
    },
  ];
  const form = useForm<BlogFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (data: BlogFormValue) => {
    setLoading(true);
    setFormError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (imageCover) {
      formData.append("imageCover", imageCover);
    }
    try {
      if (isEdit) {
        await editBlog(formData, id || "");
        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
        nav("/dashboard/blogs");
      } else {
        await createBlog(formData);
        toast({
          title: "Success",
          description: "Blog created successfully",
        });
        nav("/dashboard/blogs");
      }
    } catch (error) {
      const typedError = error as AxiosError<{ errors: ApiError[] }>;
      typedError.response?.data.errors.map(({ param, msg }: ApiError) => {
        form.setError(param as keyof BlogFormValue, {
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
                    imageCover
                      ? URL.createObjectURL(imageCover)
                      : "https://via.placeholder.com/150"
                  }
                  alt="profile"
                  className="w-40 h-40"
                />
                {imageCover && (
                  <button
                    className="absolute  right-0 w-8 h-8 bg-destructive rounded-full items-center justify-center text-background top-0 flex"
                    onClick={() => setImageCover(null)}
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
                ImageCover
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
                    setImageCover(e.target.files[0]);
                  }
                }}
              />
            </FormItem>
            <FormFields<BlogFormValue>
              inputs={inputs}
              form={form}
              loading={loading}
              isEdit={isEdit}
            />
          </div>
          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <ReactQuill
                      className="h-64 text-foreground"
                      {...field}
                      onChange={(content, delta, source, editor) =>
                        field.onChange(editor.getHTML())
                      }
                      value={field.value}
                      theme="snow"
                      readOnly={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {formError && (
            <div className="text-red-500 text-sm mb-2">{formError}</div>
          )}
          <Button
            disabled={loading}
            size={"lg"}
            className="mx-auto w-fit block mt-20"
            type="submit"
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default BlogForm;
