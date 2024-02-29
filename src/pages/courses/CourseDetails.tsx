import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "../../types";
import { axiosInstance } from "../../services/axios.config";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import React, { useState } from "react";
import UsersTable from "../users/components/UsersTable";
import { addUserToCourse } from "../../services/courseApis";
import { toast } from "../../components/ui/use-toast";
import { AxiosError } from "axios";

export default function CourseDetails() {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState("");
  const breadcrumbItems = [
    { title: "Course", link: "/dashboard/course" },
    { title: "Details", link: `/dashboard/course/${id}/details` },
  ];
  // isLoading, error,
  const { data, isLoading, isRefetching, refetch, error } = useQuery({
    queryKey: ["courseusers", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${id}/courseUsers`);
      return response.data.users as IUser[];
    },
  });
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      setIsSubmitting(true);
      try {
        await addUserToCourse(id, email);
        setEmail("");
        refetch();
        toast({
          title: "Success",
          description: "User added to course successfully",
        });
      } catch (error) {
        const typedError = error as AxiosError<{
          message: string;
        }>;
        if (typedError.response?.data.message) {
          setErrorMessage(typedError.response?.data.message);
        }
        toast({
          title: "Failed",
          description: "Something went wrong",
        });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={"Add user to course"} description={""} />
        </div>
        <Separator />
        <form onSubmit={(e) => handleAddUser(e)}>
          <div>
            <Label htmlFor="email" className="text-xl font-semibold mb-4 block">
              Email
            </Label>
            <Input
              disabled={isSubmitting}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
            {errorMessage && (
              <p className="text-destructive text-sm my-2">{errorMessage}</p>
            )}
            <Button
              disabled={isSubmitting}
              className="w-fit mx-auto block my-4"
              size={"lg"}
            >
              Add user
            </Button>
          </div>
        </form>
        <div className="flex items-start justify-between">
          <Heading title={"Users in this course"} description={""} />
        </div>
        <Separator />

        <UsersTable
          users={data || []}
          isLoading={isLoading || isRefetching}
          error={error}
          withActions={false}
          refetch={refetch}
        />
      </div>
    </>
  );
}
