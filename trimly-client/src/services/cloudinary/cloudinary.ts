const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const IMAGE_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (
	file: Blob
): Promise<string | null> => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", IMAGE_UPLOAD_PRESET);
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
			{
				method: "POST",
				body: formData,
			}
		);

		const data = await response.json();
		if (data.secure_url) {
			return data.secure_url;
		} else {
			throw new Error("Upload failed");
		}
	} catch (error) {
		console.error("Error uploading to Cloudinary:", error);
		return null;
	}
};
