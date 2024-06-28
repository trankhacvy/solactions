import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

import { CloudUploadIcon, Trash2Icon } from "lucide-react";

import { Accept, useDropzone } from "react-dropzone";

import { uploadFile } from "@/app/actions/upload";
import { generatePublicId } from "@/utils/nano-id";

interface FileUploadProps {
  accept?: Accept;
  onChange: (file: File | string | null) => void;
  value?: File | string | null;
}

type UploadStatus = "idle" | "uploading" | "upload-completed";

export const AvatarUploader: React.FC<FileUploadProps> = ({
  value,
  accept,
  onChange,
}) => {
  const [preview, setPreview] = useState<string>("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const theme = useTheme();

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        try {
          const newFile = acceptedFiles[0]!;

          const formData = new FormData();
          formData.append("file", newFile);
          formData.append("filename", generatePublicId());

          setStatus("uploading");
          const response = await uploadFile(formData);
          setStatus("upload-completed");

          if (!response.success) {
            alert(response.error);
            return;
          }

          setPreview(response.result);
          onChange(response.result);
        } catch (error: any) {
          console.error(error);
          alert(error?.message);
        } finally {
        }
      }
    },
  });

  useEffect(() => {
    if (value) {
      setPreview(value as string);
    }
  }, [value]);

  return (
    <Box
      sx={{
        width: "100%",
        outline: "none",
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.grey[500], 0.08),
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: alpha(theme.palette.grey[500], 0.2),
        aspectRatio: 1,
      }}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <Box
        sx={{
          cursor: "pointer",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        {status === "uploading" && (
          <Box
            position="absolute"
            display="flex"
            sx={{
              inset: 0,
              zIndex: 10,
              backgroundColor: alpha(theme.palette.grey[500], 0.6),
            }}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        )}

        {preview ? (
          <>
            <img
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: 12,
              }}
              src={preview}
            />
          </>
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            sx={{ width: "100%", height: "100%" }}
          >
            <CloudUploadIcon fontSize="large" color="primary" />
            <Typography variant="h6">
              Drop or upload your image here.
            </Typography>
            <Typography
              textAlign="center"
              variant="body2"
              color="text.secondary"
            >
              PNG, SVG, JPEG. Max: 10mb.
            </Typography>
          </Stack>
        )}
        {preview && (
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              setPreview("");
              onChange(null);
            }}
            sx={{
              position: "absolute",
              zIndex: 12,
              top: 4,
              right: 4,
            }}
            aria-label="Remove"
          >
            <Trash2Icon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
