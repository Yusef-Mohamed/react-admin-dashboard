import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersWithParams } from "../../services/userApis";
import { IUser } from "../../types";
import UserForm from "./components/UserForm";

export default function UserFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Users", link: "/dashboard/users" },
    { title: isEdit ? "Edit" : "Create", link: `/dashboard/users/${id}` },
  ];
  // isLoading, error,
  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await getAllUsersWithParams(`/${id}`);
      return response.data as IUser;
    },
  });
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={isEdit ? "Edit User" : "Create User"}
            description={isEdit ? "Edit user details" : "Create new user"}
          />
        </div>
        <Separator />
        {data && isEdit && (
          <UserForm
            isEdit={isEdit}
            defaultValues={{
              email: data?.email || "",
              name: data?.name || "",
              phone: data?.phone || "",
              role: data?.role || "user",
              password: "123456789",
              passwordConfirm: "123456789",
            }}
          />
        )}
        {!isEdit && <UserForm isEdit={isEdit} />}
      </div>
    </>
  );
}
