"use server";

import { APP_STORAGE_BUCKET } from "@/config/constants";
import { adminSupabase } from "@/lib/supabase";
import { UploadActionResponse } from "@/types";

export async function uploadFile(
  formData: FormData,
): Promise<UploadActionResponse> {
  try {
    const file = formData.get("file") as File;
    const filename = formData.get("filename") as string;
    console.log("file", file);

    if (!file || !filename) {
      return {
        success: false,
        error: `'file' and 'filename' are required`,
      };
    }

    const { error } = await adminSupabase.storage
      .from(APP_STORAGE_BUCKET)
      .upload(filename, file);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const { data } = await adminSupabase.storage
      .from(APP_STORAGE_BUCKET)
      .getPublicUrl(filename);

    return {
      success: true,
      result: data.publicUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message ?? "Unknown error",
    };
  }
}
