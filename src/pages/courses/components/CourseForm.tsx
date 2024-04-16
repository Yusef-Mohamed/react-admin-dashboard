import { Button } from "../../../components/ui/button";
import { Form, FormItem, FormLabel } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError, ICategory, IInputProps } from "../../../types";

import { AiFillDelete } from "react-icons/ai";
import FormFields from "../../../components/FormFields";
import { createCourse, editCourse } from "../../../services/courseApis";
import { toast } from "../../../components/ui/use-toast";
import { AxiosError } from "axios";
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
  category: z.string().min(1, { message: "You must select category" }),
  price: z.string().min(1, { message: "Price must be at least 1" }),
  priceAfterDiscount: z.string().optional(),
});

type CourseFormValue = z.infer<typeof formSchema>;
interface MyInputProps extends IInputProps {
  name: keyof CourseFormValue;
}

interface CourseFormProps {
  isEdit: boolean;
  defaultValues?: CourseFormValue;
  categories: ICategory[] | undefined;
}
const CourseForm: React.FC<CourseFormProps> = ({
  isEdit,
  categories,
  defaultValues = {
    title: "",
    description: "",
    price: "",
    priceAfterDiscount: "",
    category: "",
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
      type: "number",
      label: "Price",
      placeholder: "Enter price",
      name: "price",
    },

    {
      type: "number",
      label: "Price After Discount",
      placeholder: "Enter Price After Discount",
      name: "priceAfterDiscount",
    },
    {
      type: "select",
      label: "Category",
      placeholder: "Select category",
      name: "category",
      values: categories
        ? categories?.map((category) => ({
            value: category._id,
            label: category.title,
          }))
        : [],
    },
    {
      type: "textArea",
      label: "Description",
      placeholder: "Enter description",
      name: "description",
    },
  ];
  const form = useForm<CourseFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (data: CourseFormValue) => {
    setLoading(true);
    setFormError("");
    // check if price is number
    if (isNaN(Number(data.price))) {
      form.setError("price", {
        type: "manual",
        message: "Price must be a number",
      });
      setLoading(false);
      return;
    }
    if (isNaN(Number(data.priceAfterDiscount)) && data.priceAfterDiscount) {
      form.setError("priceAfterDiscount", {
        type: "manual",
        message: "Price After Discount number",
      });
      setLoading(false);
      return;
    }
    if (data?.priceAfterDiscount && +data?.priceAfterDiscount > +data.price) {
      form.setError("priceAfterDiscount", {
        type: "manual",
        message: "Price After Discount must be less than price",
      });
      setLoading(false);
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (data.priceAfterDiscount === "") {
      formData.delete("priceAfterDiscount");
    }
    if (image) {
      formData.append("image", image);
    }
    try {
      if (isEdit) {
        await editCourse(formData, id || "");
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
        nav("/dashboard/courses");
      } else {
        await createCourse(formData);
        toast({
          title: "Success",
          description: "Course created successfully",
        });
        nav("/dashboard/courses");
      }
    } catch (error) {
      const typedError = error as AxiosError<{ errors: ApiError[] }>;
      typedError.response?.data.errors.map(({ param, msg }: ApiError) => {
        form.setError(param as keyof CourseFormValue, {
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full ">
          <div>
            <div className="flex items-center justify-center">
              <div className="relative flex items-center justify-center w-40 h-40 mb-10">
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
                    className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-destructive text-background"
                    onClick={() => setImage(null)}
                  >
                    <AiFillDelete />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 mb-4">
            <FormItem>
              <FormLabel htmlFor="name">Image</FormLabel>
              <Input
                type="file"
                className="text-foreground"
                disabled={loading}
                required={!isEdit}
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </FormItem>
            <FormFields<CourseFormValue>
              inputs={inputs}
              form={form}
              loading={loading}
              isEdit={isEdit}
            />
          </div>
          {formError && (
            <div className="mb-2 text-sm text-red-500">{formError}</div>
          )}
          <Button
            disabled={loading}
            size={"lg"}
            className="block mx-auto w-fit"
            type="submit"
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default CourseForm;
