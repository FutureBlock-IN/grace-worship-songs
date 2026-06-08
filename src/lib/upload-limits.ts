/** Max cover image size: 2 MB */
export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

/** Max audio file size: 20 MB */
export const MAX_AUDIO_SIZE_BYTES = 20 * 1024 * 1024;

export const MAX_IMAGE_SIZE_LABEL = "2 MB";
export const MAX_AUDIO_SIZE_LABEL = "20 MB";

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Cover must be an image file";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Cover image must be ${MAX_IMAGE_SIZE_LABEL} or smaller`;
  }
  return null;
}

export function validateAudioFile(file: File): string | null {
  if (!file.type.startsWith("audio/")) {
    return "Audio must be an audio file";
  }
  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    return `Audio file must be ${MAX_AUDIO_SIZE_LABEL} or smaller`;
  }
  return null;
}
