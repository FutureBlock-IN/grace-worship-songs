"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { FirebaseArticle } from "@/types/firebase-article";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useFirebaseAuth } from "@/context/firebase-auth-context";
import { createArticle, updateArticle } from "@/lib/firebase-article-queries";
import { notifyIfNewlyPublished } from "@/lib/notify-if-published";
import { uploadSongFileLocal } from "@/lib/local-upload";
import { MAX_IMAGE_SIZE_LABEL, validateImageFile } from "@/lib/upload-limits";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  tags: z.string().optional(),
  isPublished: z.boolean(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

type AddArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialArticle?: FirebaseArticle | null;
};

function parseTags(tagsInput?: string): string[] {
  if (!tagsInput?.trim()) return [];
  return tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function AddArticleModal({
  isOpen,
  onClose,
  onSave,
  initialArticle,
}: AddArticleModalProps) {
  const { authUser } = useFirebaseAuth();
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      content: "",
      author: "",
      tags: "",
      isPublished: false,
    },
  });

  useEffect(() => {
    if (initialArticle) {
      form.reset({
        title: initialArticle.title,
        shortDescription: initialArticle.shortDescription,
        content: initialArticle.content,
        author: initialArticle.author,
        tags: initialArticle.tags.join(", "),
        isPublished: initialArticle.isPublished,
      });
      setCoverPreview(initialArticle.coverImage ?? "");
    } else {
      form.reset({
        title: "",
        shortDescription: "",
        content: "",
        author: authUser?.displayName ?? "",
        tags: "",
        isPublished: false,
      });
      setCoverPreview("");
    }
    setCoverFile(undefined);
    setUploadProgress(0);
  }, [initialArticle, isOpen, form, authUser?.displayName]);

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

  async function onSubmit(values: ArticleFormValues) {
    if (coverFile && validateImageFile(coverFile)) {
      toast.error(validateImageFile(coverFile)!);
      return;
    }

    const createdBy =
      authUser?.email ?? authUser?.displayName ?? authUser?.uid ?? "admin";
    const tags = parseTags(values.tags);

    setLoading(true);
    try {
      if (initialArticle) {
        await updateArticle(initialArticle.id, {
          title: values.title.trim(),
          shortDescription: values.shortDescription.trim(),
          content: values.content.trim(),
          author: values.author.trim(),
          tags,
          isPublished: values.isPublished,
        });

        let coverImageUrl = initialArticle.coverImage ?? "";
        if (coverFile) {
          const fd = new FormData();
          fd.append("file", coverFile);
          const url = await uploadSongFileLocal(
            initialArticle.id,
            "cover",
            fd,
            (p) => setUploadProgress(p)
          );
          coverImageUrl = url;
          await updateArticle(initialArticle.id, { coverImage: url });
        }

        await notifyIfNewlyPublished({
          type: "article",
          contentId: initialArticle.id,
          contentTitle: values.title.trim(),
          image: coverImageUrl,
          isPublished: values.isPublished,
          wasPublished: initialArticle.isPublished,
        });

        toast.success("Article updated successfully");
      } else {
        const articleId = await createArticle({
          title: values.title.trim(),
          shortDescription: values.shortDescription.trim(),
          content: values.content.trim(),
          author: values.author.trim(),
          tags,
          coverImage: "",
          createdBy,
          isPublished: values.isPublished,
        });

        let coverImageUrl = "";
        if (coverFile) {
          const fd = new FormData();
          fd.append("file", coverFile);
          const url = await uploadSongFileLocal(
            articleId,
            "cover",
            fd,
            (p) => setUploadProgress(p)
          );
          coverImageUrl = url;
          await updateArticle(articleId, { coverImage: url });
        }

        await notifyIfNewlyPublished({
          type: "article",
          contentId: articleId,
          contentTitle: values.title.trim(),
          image: coverImageUrl,
          isPublished: values.isPublished,
        });

        toast.success("Article added successfully");
      }

      onSave();
      form.reset();
      setCoverFile(undefined);
      setCoverPreview("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save article");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !loading) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialArticle ? "Edit Article" : "Add Article"}</DialogTitle>
          <DialogDescription>
            {initialArticle
              ? "Update article content and cover image"
              : "Create a new worship article"}
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
                        <Input placeholder="Article title" disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief summary shown on cards..."
                          rows={2}
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
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write the full article content..."
                          rows={8}
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
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Prayer, Worship, Faith (comma separated)"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
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
                          setCoverPreview(initialArticle?.coverImage ?? "");
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
                      Make this article visible on the home page
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
                  "Save Article"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
