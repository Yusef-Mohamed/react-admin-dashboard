import { Button } from "../../../components/ui/button";
import { Form, FormItem, FormLabel } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { createUser, editUser } from "../../../services/userApis";
import { toast } from "../../../components/ui/use-toast";
import { ApiError, IInputProps } from "../../../types";

import { AiFillDelete } from "react-icons/ai";
import FormFields from "../../../components/FormFields";
const formSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .optional(),
    passwordConfirm: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .optional(),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 characters" }),
    role: z
      .enum(["admin", "user"])
      .refine((value) => ["admin", "user"].includes(value), {
        message: "Role must be 'admin' or 'user'",
      }),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });
type UserFormValue = z.infer<typeof formSchema>;
interface MyInputProps extends IInputProps {
  name: keyof UserFormValue;
}

const inputs: MyInputProps[] = [
  {
    type: "text",
    name: "name",
    label: "Name",
    placeholder: "Enter your name...",
  },
  {
    type: "select",
    name: "role",
    label: "Role",
    placeholder: "Enter your role...",
    values: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ],
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Enter your email...",
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Enter your password...",
    hideOnEdit: true,
  },
  {
    type: "password",
    name: "passwordConfirm",
    label: "Confirm Password",
    placeholder: "Confirm your password...",
    hideOnEdit: true,
  },
  {
    type: "text",
    name: "phone",
    label: "Phone",
    placeholder: "Enter your phone...",
  },
];
interface UserFormProps {
  isEdit: boolean;
  defaultValues?: UserFormValue;
}
const UserForm: React.FC<UserFormProps> = ({
  isEdit,
  defaultValues = {
    email: "",
    name: "",
    phone: "",
    role: "user",
    password: "",
    passwordConfirm: "",
  },
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const nav = useNavigate();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    setFormError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "profileImg") {
        formData.append("profileImg", value[0]);
      } else {
        if (key === "passwordConfirm" && isEdit) return;
        if (key === "password" && isEdit) return;
        if (key === "email" && isEdit) {
          if (value === defaultValues.email) return;
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
    });
    try {
      if (isEdit) {
        await editUser(formData, id || "");
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        nav("/dashboard/users");
      } else {
        await createUser(formData);
        toast({
          title: "Success",
          description: "User created successfully",
        });
        nav("/dashboard/users");
      }
    } catch (error) {
      const typedError = error as AxiosError<{ errors: ApiError[] }>;
      typedError.response?.data.errors.map(({ param, msg }: ApiError) => {
        form.setError(param as keyof UserFormValue, {
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
              <div className="w-40 h-40 mb-10 rounded-full flex items-center justify-center relative">
                <img
                  src={
                    profileImg
                      ? URL.createObjectURL(profileImg)
                      : "https://via.placeholder.com/150"
                  }
                  alt="profile"
                  className="w-40 h-40 rounded-full"
                />
                {profileImg && (
                  <button
                    className="absolute  right-0 w-8 h-8 bg-destructive rounded-full items-center justify-center text-background top-0 flex"
                    onClick={() => setProfileImg(null)}
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
                Profile Image
                <span className="text-sm font-normal text-gray-700">
                  (optional)
                </span>
              </FormLabel>
              <Input
                type="file"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files) {
                    setProfileImg(e.target.files[0]);
                  }
                }}
              />
            </FormItem>
            <FormFields<UserFormValue>
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
export default UserForm;
