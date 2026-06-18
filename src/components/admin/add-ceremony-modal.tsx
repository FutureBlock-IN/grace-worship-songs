"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { FirebaseCeremony } from "@/types/firebase-ceremony";
import { CEREMONY_CATEGORIES } from "@/types/firebase-ceremony";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useFirebaseAuth } from "@/context/firebase-auth-context";
import { createCeremony, updateCeremony } from "@/lib/firebase-ceremony-queries";
import { notifyIfNewlyPublished } from "@/lib/notify-if-published";
import { uploadSongFileLocal } from "@/lib/local-upload";
import { MAX_IMAGE_SIZE_LABEL, validateImageFile } from "@/lib/upload-limits";

const ceremonySchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  isPublished: z.boolean(),
});

type CeremonyFormValues = z.infer<typeof ceremonySchema>;

type AddCeremonyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialCeremony?: FirebaseCeremony | null;
};

export function AddCeremonyModal({
  isOpen,
  onClose,
  onSave,
  initialCeremony,
}: AddCeremonyModalProps) {
  const { authUser } = useFirebaseAuth();
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<CeremonyFormValues>({
    resolver: zodResolver(ceremonySchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      category: "Wedding",
      isPublished: false,
    },
  });

  useEffect(() => {
    if (initialCeremony) {
      form.reset({
        title: initialCeremony.title,
        subtitle: initialCeremony.subtitle ?? "",
        description: initialCeremony.description,
        category: initialCeremony.category,
        isPublished: initialCeremony.isPublished,
      });
      setCoverPreview(initialCeremony.coverImage ?? "");
    } else {
      form.reset({
        title: "",
        subtitle: "",
        description: "",
        category: "Wedding",
        isPublished: false,
      });
      setCoverPreview("");
    }
    setCoverFile(undefined);
    setUploadProgress(0);
  }, [initialCeremony, isOpen, form]);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      e.target.value = "";
      return;
    }
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function onSubmit(values: CeremonyFormValues) {
    if (coverFile && validateImageFile(coverFile)) {
      toast.error(validateImageFile(coverFile)!);
      return;
    }

    const createdBy =
      authUser?.email ?? authUser?.displayName ?? authUser?.uid ?? "admin";

    setLoading(true);
    try {
      if (initialCeremony) {
        await updateCeremony(initialCeremony.id, {
          title: values.title.trim(),
          subtitle: values.subtitle?.trim() || undefined,
          description: values.description.trim(),
          category: values.category,
          isPublished: values.isPublished,
        });

        let coverImageUrl = initialCeremony.coverImage ?? "";
        if (coverFile) {
          const fd = new FormData();
          fd.append("file", coverFile);
          const url = await uploadSongFileLocal(
            initialCeremony.id,
            "cover",
            fd,
            (p) => setUploadProgress(p)
          );
          coverImageUrl = url;
          await updateCeremony(initialCeremony.id, { coverImage: url });
        }

        await notifyIfNewlyPublished({
          type: "ceremony",
          contentId: initialCeremony.id,
          contentTitle: values.title.trim(),
          image: coverImageUrl,
          isPublished: values.isPublished,
          wasPublished: initialCeremony.isPublished,
        });

        toast.success("Ceremony updated successfully");
      } else {
        const ceremonyId = await createCeremony({
          title: values.title.trim(),
          subtitle: values.subtitle?.trim() || undefined,
          description: values.description.trim(),
          category: values.category,
          coverImage: "",
          createdBy,
          isPublished: values.isPublished,
        });

        let coverImageUrl = "";
        if (coverFile) {
          const fd = new FormData();
          fd.append("file", coverFile);
          const url = await uploadSongFileLocal(
            ceremonyId,
            "cover",
            fd,
            (p) => setUploadProgress(p)
          );
          coverImageUrl = url;
          await updateCeremony(ceremonyId, { coverImage: url });
        }

        await notifyIfNewlyPublished({
          type: "ceremony",
          contentId: ceremonyId,
          contentTitle: values.title.trim(),
          image: coverImageUrl,
          isPublished: values.isPublished,
        });

        toast.success("Ceremony added successfully");
      }

      onSave();
      form.reset();
      setCoverFile(undefined);
      setCoverPreview("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save ceremony");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !loading) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialCeremony ? "Edit Ceremony" : "Add Ceremony"}</DialogTitle>
          <DialogDescription>
            {initialCeremony
              ? "Update ceremony details and cover image"
              : "Create a new worship ceremony entry"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card className="border-border/50 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Ceremony title" disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional subtitle" disabled={loading} {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this ceremony..."
                          rows={4}
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CEREMONY_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">Max {MAX_IMAGE_SIZE_LABEL}</p>
                <div className="flex gap-4">
                  {coverPreview ? (
                    <div className="relative h-20 w-20 shrink-0">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="h-full w-full rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverPreview(initialCeremony?.coverImage ?? "");
                          setCoverFile(undefined);
                        }}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null}
                  <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 p-4 transition-colors hover:border-primary">
                    <Upload className="mb-1 h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-medium">Click to upload</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif,.avif,image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                </div>
                {uploadProgress > 0 ? (
                  <p className="text-xs text-muted-foreground">Uploading… {uploadProgress}%</p>
                ) : null}
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Publish</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Make this ceremony visible on the home page
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Ceremony"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
