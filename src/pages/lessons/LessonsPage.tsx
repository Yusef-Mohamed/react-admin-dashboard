import { Plus } from "lucide-react";
import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getAllLessonsWithParams } from "../../services/lessonApis";
import LessonsTable from "./components/LessonsTable";
import { useState } from "react";
import { IPagination, ILesson, ICourse } from "../../types";
import PaginationHandler from "../../components/PaginationHandler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { getAllCoursesWithParams } from "../../services/courseApis";
const breadcrumbItems = [{ title: "Lessons", link: "/dashboard/lessons" }];

export default function LessonsPage() {
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 50,
    numberOfPages: 1,
    results: 0,
  });
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    enabled: selectedCourse !== "",
    queryKey: ["lessons", `page=${pagination.currentPage}`],
    queryFn: async () => {
      const response = await getAllLessonsWithParams(
        // `?page=${pagination.currentPage}`
        `/courseLessons/${selectedCourse}`
      );
      setPagination((prev) => ({
        ...prev,
        numberOfPages: response.paginationResult.numberOfPages,
        results: response.results,
      }));
      return response.data as ILesson[];
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
            title={`Lessons (${pagination.results})`}
            description="Manage lessonss"
          />

          <Button asChild>
            <Link to={"/dashboard/lessons/new"}>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </Button>
        </div>

        <Separator />
        <Select
          onValueChange={(e) => {
            setSelectedCourse(e);
            setTimeout(() => {
              refetch();
            }, 100);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses?.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <LessonsTable
          lessons={data || []}
          isLoading={isLoading || isRefetching}
          error={error}
          refetch={refetch}
        />
        <PaginationHandler
          page={pagination.currentPage}
          totalPages={pagination.numberOfPages}
          onChange={(page) => {
            setPagination((prev) => ({ ...prev, currentPage: page }));
            refetch();
          }}
        />
      </div>
    </>
  );
}
