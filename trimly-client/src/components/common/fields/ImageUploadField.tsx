import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, ImageIcon, X, Camera } from "lucide-react";
import { useCropper } from "@/hooks/common/useCropper";
import { CropperModal } from "@/components/modals/CropperModal";

interface ImageUploadProps {
	initialImage?: string;
	onImageChange: (file: Blob | null, imageUrl: string | null) => void;
	handleRemove: () => void;
	aspectRatio?: "square" | "banner";
	maxSizeMB?: number;
	acceptedFileTypes?: string[];
	label?: string;
}

const getAspectRatioValue = (aspectRatio: "square" | "banner") => {
	return aspectRatio === "square" ? 1 : 16 / 9;
};

export const ImageUploadField: React.FC<ImageUploadProps> = ({
	initialImage,
	onImageChange,
	handleRemove,
	aspectRatio = "square",
	maxSizeMB = 5,
	acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
	label = "Upload Image",
}) => {
	const [preview, setPreview] = useState<string | null>(initialImage || null);
	const [error, setError] = useState<string | null>(null);
	const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(
		null
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const aspectRatioValue = getAspectRatioValue(aspectRatio);

	const handleCropComplete = (croppedImageUrl: string, croppedBlob: Blob) => {
		setPreview(croppedImageUrl);
		onImageChange(croppedBlob, croppedImageUrl);

		if (originalImageUrl) {
			URL.revokeObjectURL(originalImageUrl);
			setOriginalImageUrl(null);
		}
	};

	const handleCropCancel = () => {
		if (originalImageUrl) {
			URL.revokeObjectURL(originalImageUrl);
			setOriginalImageUrl(null);
		}
	};

	const cropperProps = useCropper({
		aspectRatio: aspectRatioValue,
		onCropComplete: handleCropComplete,
		onCancel: handleCropCancel,
	});

	useEffect(() => {
		if (initialImage) {
			setPreview(initialImage);
		}
	}, [initialImage]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setError(null);

		if (!file) return;

		if (!acceptedFileTypes.includes(file.type)) {
			setError(
				`Invalid file type. Please upload ${acceptedFileTypes.join(
					", "
				)}`
			);
			return;
		}

		if (file.size > maxSizeMB * 1024 * 1024) {
			setError(`File size exceeds ${maxSizeMB}MB limit`);
			return;
		}

		const imageUrl = URL.createObjectURL(file);
		setOriginalImageUrl(imageUrl);
		cropperProps.openCropper(imageUrl);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleRemoveImage = () => {
		setPreview(null);
		setError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		handleRemove();
		onImageChange(null, null);
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className="w-full">
			<input
				type="file"
				accept={acceptedFileTypes.join(",")}
				onChange={handleFileChange}
				ref={fileInputRef}
				className="hidden"
			/>

			{preview ? (
				<div className="relative">
					<Card className="overflow-hidden p-0">
						<img
							src={preview}
							alt="Preview"
							className="w-full h-full object-contain"
						/>
						<div className="absolute top-2 right-2 flex gap-2">
							<button
								type="button"
								onClick={handleButtonClick}
								className="p-1 bg-black cursor-pointer bg-opacity-70 rounded-full text-white"
								aria-label="Edit image">
								<Camera size={20} />
							</button>
							<button
								type="button"
								onClick={handleRemoveImage}
								className="p-1 bg-black cursor-pointer bg-opacity-70 rounded-full text-white"
								aria-label="Remove image">
								<X size={20} />
							</button>
						</div>
					</Card>
				</div>
			) : (
				<Card
					className={`flex flex-col items-center justify-center p-4 border-2 border-dashed cursor-pointer ${
						aspectRatio === "square"
							? "aspect-square"
							: "aspect-[16/5]"
					}`}
					onClick={handleButtonClick}>
					<ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
					<p className="text-sm text-gray-500 mb-2">{label}</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="flex items-center gap-2">
						<Upload size={16} />
						Select Image
					</Button>
				</Card>
			)}

			{error && <p className="text-sm text-red-500 mt-2">{error}</p>}

			<p className="text-xs text-gray-500 mt-1">
				Accepted formats:{" "}
				{acceptedFileTypes.map((type) => type.split("/")[1]).join(", ")}
				(Max: {maxSizeMB}MB)
			</p>

			<CropperModal
				isOpen={cropperProps.isModalOpen}
				imageUrl={cropperProps.imageUrl}
				aspectRatio={cropperProps.aspectRatio}
				crop={cropperProps.crop}
				zoom={cropperProps.zoom}
				onCropChange={cropperProps.handleCropChange}
				onZoomChange={cropperProps.handleZoomChange}
				onCropComplete={cropperProps.handleCropComplete}
				onClose={cropperProps.closeCropper}
				onConfirm={cropperProps.createCroppedImage}
			/>
		</div>
	);
};
