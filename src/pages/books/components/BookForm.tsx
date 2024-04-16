import { Button } from "../../../components/ui/button";
import { Form, FormItem, FormLabel } from "../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError, ICategory, IInputProps, ISubCategory } from "../../../types";

import FormFields from "../../../components/FormFields";
import { createBook, editBook } from "../../../services/bookApis";
import { toast } from "../../../components/ui/use-toast";
import { AxiosError } from "axios";
import { getCategories } from "../../../services/bookCategoryApis";
import { getBookSubCategories } from "../../../services/bookSubCategoryApis";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  bookUrl: z
    .string()
    .min(3, { message: "BookUrl must be at least 3 characters" }),
  country: z
    .string()
    .min(3, { message: "Country must be at least 3 characters" }),
  date: z.any(),
});

type BookFormValue = z.infer<typeof formSchema>;
interface MyInputProps extends IInputProps {
  name: keyof BookFormValue;
}

interface BookFormProps {
  isEdit: boolean;
  defaultValues?: BookFormValue;
  subCategory?: string;
  category?: string;
}
const BookForm: React.FC<BookFormProps> = ({
  isEdit,
  category = "",
  subCategory = "",
  defaultValues = {
    title: "",
    bookUrl: "",
    country: "",
    date: new Date(),
  },
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<string>(subCategory);
  const getMainCategories = async () => {
    const response = await getCategories();
    setCategories(response.data);
  };
  const getSubCategories = async (id: string) => {
    const response = await getBookSubCategories(`?categoryBook=${id}`);
    setSubCategories(response.data);
  };
  useEffect(() => {
    getMainCategories();
  }, []);
  useEffect(() => {
    if (selectedCategory) {
      getSubCategories(selectedCategory);
    }
  }, [selectedCategory]);
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
      label: "Book Url",
      placeholder: "Enter book url",
      name: "bookUrl",
    },
    {
      type: "text",
      label: "Country",
      placeholder: "Enter country",
      name: "country",
    },
    {
      type: "date",
      name: "date",
      label: "Date",
      placeholder: "Enter Date ...",
    },
  ];
  const form = useForm<BookFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (data: BookFormValue) => {
    setLoading(true);
    setFormError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    formData.append("categoryBook", selectedCategory);
    formData.append("subCategories", selectedSubCategory);
    try {
      if (isEdit) {
        await editBook(formData, id || "");
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
        nav("/dashboard/books");
      } else {
        await createBook(formData);
        toast({
          title: "Success",
          description: "Book created successfully",
        });
        nav("/dashboard/books");
      }
    } catch (error) {
      const typedError = error as AxiosError<{ errors: ApiError[] }>;
      typedError.response?.data.errors.map(({ param, msg }: ApiError) => {
        form.setError(param as keyof BookFormValue, {
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
          {/* <div>
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
          </div> */}
          <div className="grid w-full grid-cols-2 gap-2 mb-4">
            {/* <FormItem>
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
            </FormItem> */}
            <FormFields<BookFormValue>
              inputs={inputs}
              form={form}
              loading={loading}
              isEdit={isEdit}
            />{" "}
            <FormItem>
              <FormLabel htmlFor="name">Category</FormLabel>
              <Select
                required
                value={selectedCategory}
                onValueChange={(e) => {
                  setSelectedCategory(e);
                  setSelectedSubCategory("");
                  setSubCategories([]);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="name">Sub Categories</FormLabel>
              <Select
                value={selectedSubCategory}
                required
                onValueChange={(e) => {
                  setSelectedSubCategory(e);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sub category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
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
export default BookForm;
