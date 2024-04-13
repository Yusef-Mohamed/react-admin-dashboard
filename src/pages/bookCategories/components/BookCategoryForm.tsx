import { Button } from "../../../components/ui/button";
import { Form } from "../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../components/ui/use-toast";
import { ApiError, IInputProps } from "../../../types";

import {
  createCategory,
  editCategory,
} from "../../../services/bookCategoryApis";
import FormFields from "../../../components/FormFields";
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
});
type CategoryFormValue = z.infer<typeof formSchema>;
interface MyInputProps extends IInputProps {
  name: keyof CategoryFormValue;
}
const inputs: MyInputProps[] = [
  {
    type: "text",
    name: "title",
    label: "Title",
    placeholder: "Enter Title ...",
  },
];
interface CategoryFormProps {
  isEdit: boolean;
  defaultValues?: CategoryFormValue;
}
const BookCategoryForm: React.FC<CategoryFormProps> = ({
  isEdit,
  defaultValues = {
    title: "",
  },
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const nav = useNavigate();
  const form = useForm<CategoryFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (data: CategoryFormValue) => {
    setLoading(true);
    setFormError("");
    try {
      if (isEdit) {
        await editCategory(data, id || "");
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        nav("/dashboard/bookCategories");
      } else {
        await createCategory(data);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
        nav("/dashboard/bookCategories");
      }
    } catch (error) {
      const typedError = error as AxiosError<{ errors: ApiError[] }>;
      typedError.response?.data.errors.map(({ param, msg }: ApiError) => {
        form.setError(param as keyof CategoryFormValue, {
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
            <FormFields<CategoryFormValue>
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
export default BookCategoryForm;
