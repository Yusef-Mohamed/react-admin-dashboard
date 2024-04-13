import { Button } from "../../../components/ui/button";
import { Form } from "../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError, ICategory, IInputProps } from "../../../types";

import FormFields from "../../../components/FormFields";
import { toast } from "../../../components/ui/use-toast";
import { AxiosError } from "axios";
import {
  createBookSubCategory,
  editBookSubCategory,
} from "../../../services/bookSubCategoryApis";
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  categoryBook: z.string(),
});

type BookSubCategoryFormValue = z.infer<typeof formSchema>;
interface MyInputProps extends IInputProps {
  name: keyof BookSubCategoryFormValue;
}

interface BookSubCategoryFormProps {
  isEdit: boolean;
  defaultValues?: BookSubCategoryFormValue;
  categories: ICategory[] | undefined;
}
const BookSubCategoryForm: React.FC<BookSubCategoryFormProps> = ({
  isEdit,
  categories,
  defaultValues = {
    title: "",
    categoryBook: "",
  },
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
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
      label: "Category",
      placeholder: "Select category",
      name: "categoryBook",
      values: categories?.map((category) => ({
        value: category._id,
        label: category.title,
      })),
    },
  ];
  const form = useForm<BookSubCategoryFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (data: BookSubCategoryFormValue) => {
    setLoading(true);
    setFormError("");

    try {
      if (isEdit) {
        await editBookSubCategory(data, id || "");
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        nav("/dashboard/bookSubCategories");
      } else {
        await createBookSubCategory(data);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
        nav("/dashboard/bookSubCategories");
      }
    } catch (error) {
      const typedError = error as AxiosError<{ errors: ApiError[] }>;
      typedError.response?.data.errors.map(({ param, msg }: ApiError) => {
        form.setError(param as keyof BookSubCategoryFormValue, {
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
          <div className="grid w-full grid-cols-2 gap-2 mb-4">
            <FormFields<BookSubCategoryFormValue>
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
export default BookSubCategoryForm;
