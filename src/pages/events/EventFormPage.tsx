import BreadCrumb from "../../components/BreadCrumb";
import { Heading } from "../../components/Heading";
import { useParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../services/eventApis";
import { IEvent } from "../../types";
import EventForm from "./components/EventForm";

export default function EventFormPage() {
  const { id } = useParams();
  const isEdit = id !== "new";
  const breadcrumbItems = [
    { title: "Events", link: "/dashboard/events" },
    { title: isEdit ? "Edit" : "Create", link: `/dashboard/events/${id}` },
  ];
  // isLoading, error,
  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ["events", id],
    queryFn: async () => {
      const response = await getEvents(`/${id}`);
      return response.data as IEvent;
    },
  });
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={isEdit ? "Edit Event" : "Create Event"}
            description={isEdit ? "Edit event details" : "Create new event"}
          />
        </div>
        <Separator />
        {data && isEdit && (
          <EventForm
            isEdit={isEdit}
            defaultValues={
              data
                ? {
                    title: data.title,
                    date: new Date(data.date),
                    description: data.description,
                    facebookUrl: data.facebookUrl,
                    videoUrl: data.videoUrl,
                  }
                : {
                    title: "",
                    date: new Date(),
                    description: "",
                    facebookUrl: "",
                    videoUrl: "",
                  }
            }
          />
        )}
        {!isEdit && <EventForm isEdit={isEdit} />}
      </div>
    </>
  );
}
