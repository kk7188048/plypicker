"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageCropper } from "./image-crop"
import { FileWithPath, useDropzone } from "react-dropzone"
import SvgText from "./svg-text"
// import { FileWithPreview } from "@/app/dashboard/admin/page"

export type FileWithPreview = FileWithPath & {
  preview: string
}

interface CropImageProps {
  onImageUpload: (file: FileWithPreview) => void; // Callback for image upload
  defaultImageUrl?: string; // Optional default image URL
}

const accept = {
  "image/*": [],
}

const CropImage: React.FC<CropImageProps> = ({ onImageUpload, defaultImageUrl }) => {
  const [selectedFile, setSelectedFile] = React.useState<FileWithPreview | null>(null)
  const [isDialogOpen, setDialogOpen] = React.useState(false)

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0]
      if (!file) {
        alert("Selected image is too large!")
        return
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })

      setSelectedFile(fileWithPreview)
      setDialogOpen(true)
      onImageUpload(fileWithPreview) // Call the callback with the uploaded file
    },
    [onImageUpload],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  })

  return (
    <div className="relative">
      {selectedFile ? (
        <ImageCropper
          dialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      ) : (
        <Avatar
          {...getRootProps()}
          className="size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
        >
          <input {...getInputProps()} />
          <AvatarImage src={defaultImageUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}

      <div className="absolute -bottom-12 left-28">
        <SvgText />
      </div>
    </div>
  )
}

export default CropImage