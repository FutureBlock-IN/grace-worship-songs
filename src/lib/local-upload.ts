/**
 * Local file upload handler - replaces Firebase Storage upload
 * Stores files in /public/uploads/{images,audio}
 */

type UploadResponse = {
  success: boolean;
  url: string;
  fileName: string;
  size: number;
};

type UploadError = {
  error: string;
  details?: string;
};

export async function uploadSongFileLocal(
  songId: string,
  fileType: "cover" | "audio",
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<string> {
  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    throw new Error("No file provided");
  }

  onProgress?.(10);

  const uploadFormData = new FormData();
  uploadFormData.append("file", file);

  onProgress?.(30);

  try {
    console.log(`[LocalUpload] Starting ${fileType} upload for song ${songId}`, {
      fileName: file instanceof File ? file.name : "blob",
      fileSize: file.size,
      mimeType: file.type,
    });

    const response = await fetch(`/api/upload?type=${fileType}&songId=${songId}`, {
      method: "POST",
      body: uploadFormData,
    });

    onProgress?.(80);

    if (!response.ok) {
      const error = (await response.json()) as UploadError;
      console.error(`[LocalUpload] Upload failed:`, error);
      throw new Error(error.error || `Upload failed with status ${response.status}`);
    }

    const data = (await response.json()) as UploadResponse;
    console.log(`[LocalUpload] ${fileType} upload successful:`, {
      url: data.url,
      songId,
      size: data.size,
    });

    onProgress?.(100);
    return data.url;
  } catch (error) {
    console.error(`[LocalUpload] Error uploading ${fileType}:`, error);
    throw error;
  }
}
