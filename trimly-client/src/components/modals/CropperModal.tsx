import React from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface CropperModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  aspectRatio: number;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (location: any) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const CropperModal: React.FC<CropperModalProps> = ({
  isOpen,
  imageUrl,
  aspectRatio,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onConfirm
}) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Crop Image</DialogTitle>
        <div className="relative h-64 w-full md:h-80">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="py-2">
          <div className="flex items-center mb-4">
            <span className="mr-2 text-sm">Zoom:</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => onZoomChange(value[0])}
              className="flex-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};