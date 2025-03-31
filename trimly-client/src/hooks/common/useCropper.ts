import { useState, useCallback } from 'react';

interface UseCropperProps {
  aspectRatio: number;
  onCropComplete: (croppedImageUrl: string, croppedBlob: Blob) => void;
  onCancel: () => void;
}

export const useCropper = ({ aspectRatio, onCropComplete, onCancel }: UseCropperProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const openCropper = useCallback((imageUrl: string) => {
    setImageUrl(imageUrl);
    setIsModalOpen(true);
  }, []);

  const closeCropper = useCallback(() => {
    setIsModalOpen(false);
    setImageUrl(null);
    onCancel();
  }, [onCancel]);

  const handleCropChange = useCallback((location: any) => {
    setCrop(location);
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async () => {
    try {
      if (!imageUrl || !croppedAreaPixels) return;

      const image = new Image();
      image.src = imageUrl;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      // Draw the cropped image onto the canvas
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
      
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          onCropComplete(croppedImageUrl, blob);
          setIsModalOpen(false);
        }
      });
    } catch (error) {
      console.error('Error creating cropped image:', error);
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
    aspectRatio
  };
};