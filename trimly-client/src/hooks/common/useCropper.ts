import { useState, useCallback } from "react";

interface UseCropperProps {
  aspectRatio: number;
  onCropComplete: (croppedImageUrl: string, croppedBlob: Blob) => void;
  onCancel: () => void;
}

type CroppedAreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export const useCropper = ({
  aspectRatio,
  onCropComplete,
  onCancel,
}: UseCropperProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  // const [originalImageDimensions, setOriginalImageDimensions] = useState<{width: number, height: number} | null>(null);

  const openCropper = useCallback((imageUrl: string) => {
    setImageUrl(imageUrl);
    setIsModalOpen(true);
    
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    
    const img = new Image();
    // img.onload = () => {
    //   setOriginalImageDimensions({
    //     width: img.width,
    //     height: img.height
    //   });
    // };
    img.src = imageUrl;
  }, []);

  const closeCropper = useCallback(() => {
    setIsModalOpen(false);
    setImageUrl(null);
    setCroppedAreaPixels(null);
    // setOriginalImageDimensions(null);
    onCancel();
  }, [onCancel]);

  const handleCropChange = useCallback((location: any) => {
    setCrop(location);
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async () => {
    try {
      if (!imageUrl || !croppedAreaPixels) {
        console.error("Missing image URL or cropped area pixels");
        return;
      }

      const image = new Image();
      image.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = imageUrl;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Could not get canvas context");
        return;
      }

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob);
            onCropComplete(croppedImageUrl, blob);
            setIsModalOpen(false);
          } else {
            console.error("Failed to create blob from canvas");
          }
        },
        "image/jpeg",
        0.95 
      );
    } catch (error) {
      console.error("Error creating cropped image:", error);
    }
  }, [imageUrl, croppedAreaPixels, onCropComplete]);

  return {
    isModalOpen,
    imageUrl,
    crop,
    zoom,
    openCropper,
    closeCropper,
    handleCropChange,
    handleZoomChange,
    handleCropComplete,
    createCroppedImage,
    aspectRatio,
  };
};