import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface Input<T extends FieldValues> extends IInputProps {
  name: Path<T>;
}
interface FormFieldsProps<T extends FieldValues> {
  inputs: Input<T>[];
  form: UseFormReturn<T>;
  loading: boolean;
  isEdit: boolean;
}
import { IInputProps } from "../types";

const FormFields = <T extends FieldValues>({
  inputs,
  form,
  loading,
  isEdit,
}: FormFieldsProps<T>) => {
  return (
    <>
      {inputs.map((input, key) => {
        if (input.hideOnEdit && isEdit) return null;

        if (input.type === "select") {
          return (
            <FormField
              key={key}
              control={form.control}
              name={input.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{input.label}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={input.placeholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {input.values?.map((value) => (
                        <SelectItem key={value.value} value={value.value}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        } else if (input.type === "textArea") {
          return (
            <FormField
              key={input.name}
              control={form.control}
              name={input.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{input.label}</FormLabel>

                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder={input.placeholder}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        } else {
          return (
            <FormField
              key={input.name}
              control={form.control}
              name={input.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{input.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={input.type}
                      placeholder={input.placeholder}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }
      })}
    </>
  );
};
export default FormFields;
