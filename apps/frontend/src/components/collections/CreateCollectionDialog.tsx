import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateCollectionRequest } from "@/types/collections";

const createCollectionSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(120, "Name is too long."),
  description: z.string().trim().max(500, "Description is too long.").optional()
});

type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

type CreateCollectionDialogProps = {
  open: boolean;
  isCreating: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCollection: (request: CreateCollectionRequest) => Promise<unknown>;
};

export function CreateCollectionDialog({
  open,
  isCreating,
  onOpenChange,
  onCreateCollection
}: CreateCollectionDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      setSubmitError(null);
    }
  }, [form, open]);

  const handleSubmit = async (values: CreateCollectionFormValues): Promise<void> => {
    const description = values.description?.trim();

    try {
      await onCreateCollection({
        name: values.name.trim(),
        description: description && description.length > 0 ? description : null
      });
      form.reset();
      setSubmitError(null);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Collection could not be created.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-space-panel text-foreground shadow-2xl shadow-black/40 sm:max-w-md">
        <DialogHeader>
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-space-orange/10 text-space-orange">
            <FolderPlus className="h-5 w-5" />
          </span>
          <DialogTitle className="text-white">New collection</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Name the archive and add a short note for its theme.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Deep Field Nebulae"
                      className="h-10 rounded-lg border-white/15 bg-space-void/40 text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Star-forming regions and cosmic clouds captured by NASA missions."
                      className="resize-none rounded-lg border-white/15 bg-space-void/40 text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError !== null ? <p className="text-sm text-space-orange">{submitError}</p> : null}
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-full text-muted-foreground hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-cy="save-btn"
                disabled={isCreating}
                className="rounded-full bg-space-orange text-space-void hover:bg-space-orange/90"
              >
                Create collection
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
