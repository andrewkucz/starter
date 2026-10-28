import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTaskMutations } from "../api";
import { createTaskSchema } from "../schemas";

export function TaskCreateForm() {
  const mutations = useTaskMutations();
  const { mutate: createMutate, isPending: createIsPending } = useMutation({
    ...mutations.create,
    onSuccess: () => {
      toast.success("Task added.");
      form.reset();
    },
  });
  const form = useForm({
    defaultValues: { title: "" },
    validators: { onSubmit: createTaskSchema },
    onSubmit: ({ value }) => createMutate(value),
  });

  return (
    <form
      className="flex items-start gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="title">
        {(field) => (
          <FormItem className="flex-1">
            <FormLabel htmlFor={field.name} className="sr-only">
              New task
            </FormLabel>
            <FormControl>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={!field.state.meta.isValid}
                autoComplete="off"
                disabled={createIsPending}
                placeholder="What needs doing?"
              />
            </FormControl>
            <FormMessage errors={field.state.meta.errors} />
          </FormItem>
        )}
      </form.Field>
      <Button type="submit" disabled={createIsPending}>
        <Plus aria-hidden="true" />
        Add task
      </Button>
    </form>
  );
}
