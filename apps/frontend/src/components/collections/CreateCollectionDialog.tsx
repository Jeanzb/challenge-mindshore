import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { useEffect } from "react";
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
import { m } from "@/paraglide/messages";
import { toast } from "sonner";

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
      toast.success(m.collections_create_success());
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : m.collections_create_error());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-space-panel text-foreground shadow-2xl shadow-black/40 sm:max-w-md">
        <DialogHeader>
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-space-orange/10 text-space-orange">
            <FolderPlus className="h-5 w-5" />
          </span>
          <DialogTitle className="text-white">{m.collections_create_title()}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {m.collections_create_description()}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white">{m.collections_create_name()}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder={m.collections_create_name_placeholder()}
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
                  <FormLabel className="text-xs text-white">{m.collections_create_description_label()}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={m.collections_create_description_placeholder()}
                      className="resize-none rounded-lg border-white/15 bg-space-void/40 text-white placeholder:text-muted-foreground focus-visible:ring-space-cyan/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-full text-muted-foreground hover:bg-white/5 hover:text-white"
              >
                {m.collections_cancel()}
              </Button>
              <Button
                type="submit"
                data-cy="save-btn"
                disabled={isCreating}
                className="rounded-full bg-space-orange text-space-void hover:bg-space-orange/90"
              >
                {m.collections_create_submit()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
