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

import { createEvent, editEvent } from "../../../services/eventApis";
import FormFields from "../../../components/FormFields";
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  videoUrl: z.string().url({ message: "Invalid URL" }),
  facebookUrl: z.string().url({ message: "Invalid URL" }),
  date: z.any(),
});
type EventFormValue = z.infer<typeof formSchema>;
interface MyInputProps extends IInputProps {
  name: keyof EventFormValue;
}
const inputs: MyInputProps[] = [
  {
    type: "text",
    name: "title",
    label: "Title",
    placeholder: "Enter Title ...",
  },

  {
    type: "text",
    name: "videoUrl",
    label: "Video URL",
    placeholder: "Enter Video URL ...",
  },
  {
    type: "text",
    name: "facebookUrl",
    label: "Facebook URL",
    placeholder: "Enter Facebook URL ...",
  },
  {
    type: "date",
    name: "date",
    label: "Date",
    placeholder: "Enter Date ...",
  },
  {
    type: "textArea",
    name: "description",
    label: "Description",
    placeholder: "Enter Description ...",
  },
];
interface EventFormProps {
  isEdit: boolean;
  defaultValues?: EventFormValue;
}
const EventForm: React.FC<EventFormProps> = ({
  isEdit,
  defaultValues = {
    title: "",
  },
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const nav = useNavigate();
  const form = useForm<EventFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const onSubmit = async (data: EventFormValue) => {
    setLoading(true);
    setFormError("");
    if (!data.date) {
      form.setError("date", {
        type: "manual",
        message: "Date is required",
      });
      setLoading(false);
      return;
    }
    try {
      if (isEdit) {
        await editEvent(data, id || "");
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        nav("/dashboard/events");
      } else {
        await createEvent(data);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        nav("/dashboard/events");
      }
    } catch (error) {
      const typedError = error as AxiosError<{ errors: ApiError[] }>;
      typedError.response?.data.errors.map(({ param, msg }: ApiError) => {
        form.setError(param as keyof EventFormValue, {
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
            <FormFields<EventFormValue>
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
export default EventForm;
