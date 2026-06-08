import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Upload handler for local file storage
 * POST /api/upload?type=cover|audio&songId=<id>
 * 
 * Stores files in:
 * - Images: /public/uploads/images/<songId>.<ext>
 * - Audio: /public/uploads/audio/<songId>.<ext>
 */

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20 MB

function getFileExtension(mimeType: string): string {
  const types: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/webm": "webm",
    "audio/mp4": "m4a",
  };
  return types[mimeType] || "bin";
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "cover" or "audio"
    const songId = searchParams.get("songId");

    // Validation
    if (!type || !["cover", "audio"].includes(type)) {
      console.error("[Upload] Invalid type:", type);
      return NextResponse.json(
        { error: "Invalid file type. Must be 'cover' or 'audio'" },
        { status: 400 }
      );
    }

    if (!songId) {
      console.error("[Upload] Missing songId");
      return NextResponse.json(
        { error: "songId is required" },
        { status: 400 }
      );
    }

    // Validate songId format (alphanumeric and hyphens only)
    if (!/^[a-zA-Z0-9\-_]+$/.test(songId)) {
      console.error("[Upload] Invalid songId format:", songId);
      return NextResponse.json(
        { error: "Invalid songId format" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("[Upload] No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log(`[Upload] Starting ${type} upload for song ${songId}`, {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });

    // File type validation
    if (type === "cover") {
      if (!file.type.startsWith("image/")) {
        console.error(`[Upload] Invalid image type: ${file.type}`);
        return NextResponse.json(
          { error: "Cover must be an image file" },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        console.error(`[Upload] Image too large: ${file.size} > ${MAX_IMAGE_SIZE}`);
        return NextResponse.json(
          { error: "Cover image must be 2 MB or smaller" },
          { status: 400 }
        );
      }
    } else if (type === "audio") {
      if (!file.type.startsWith("audio/")) {
        console.error(`[Upload] Invalid audio type: ${file.type}`);
        return NextResponse.json(
          { error: "Audio must be an audio file" },
          { status: 400 }
        );
      }
      if (file.size > MAX_AUDIO_SIZE) {
        console.error(`[Upload] Audio too large: ${file.size} > ${MAX_AUDIO_SIZE}`);
        return NextResponse.json(
          { error: "Audio file must be 20 MB or smaller" },
          { status: 400 }
        );
      }
    }

    // Create directory if it doesn't exist
    const typeDir = join(UPLOAD_DIR, type);
    try {
      if (!existsSync(typeDir)) {
        await mkdir(typeDir, { recursive: true });
        console.log(`[Upload] Created directory: ${typeDir}`);
      }
    } catch (dirError) {
      console.error("[Upload] Failed to create directory:", dirError);
      throw dirError;
    }

    // Get file extension
    const ext = getFileExtension(file.type);
    const fileName = `${songId}.${ext}`;
    const filePath = join(typeDir, fileName);

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file
    try {
      await writeFile(filePath, buffer);
      console.log(`[Upload] File saved successfully`, {
        filePath,
        size: buffer.length,
      });
    } catch (writeError) {
      console.error("[Upload] Failed to write file:", writeError);
      throw writeError;
    }

    // Return relative URL that will work in browser
    const url = `/uploads/${type}/${fileName}`;
    console.log(`[Upload] Upload complete for ${type}:`, {
      url,
      songId,
      fileName,
    });

    return NextResponse.json({
      success: true,
      url,
      fileName,
      size: buffer.length,
    });
  } catch (error) {
    console.error("[Upload] Error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
