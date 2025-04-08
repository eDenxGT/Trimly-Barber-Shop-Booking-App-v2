import { useCallback, useRef, useState } from "react";
import { useFormik } from "formik";
import { MuiTextField } from "@/components/common/fields/MuiTextField";
import { LocationInputField } from "@/components/common/fields/LocationInputField";
import { UserRoles } from "@/types/UserRoles";
import { IAdmin, IBarber, IClient } from "@/types/User";
import { ImageUploadField } from "./../../common/fields/ImageUploadField";
import MuiAnimatedButton from "@/components/common/buttons/AnimatedButton";
import { getValidationSchema } from "@/utils/validations/profile-edit.validator";
import { uploadImageToCloudinary } from "@/services/cloudinary/cloudinary";
import { Checkbox, IconButton, Typography } from "@mui/material";
import { ArrowLeftCircleIcon, ParkingCircle, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

interface ILocation {
	name: string;
	displayName: string;
	zipCode: string;
	coordinates?: number[];
}

type FormValues = {
	email: string;
	phoneNumber: string;
	avatar: string;
	fullName?: string;
	location?: ILocation;
	shopName?: string;
	banner?: string;
	description?: string;
	amenities?: {
		wifi: boolean;
		parking: boolean;
	};
};

const getInitialValues = (
	role: UserRoles,
	initialData: IAdmin | IClient | IBarber
) => {
	const commonFields = {
		email: initialData?.email || "",
		phoneNumber: initialData?.phoneNumber || "",
		avatar: initialData?.avatar || "",
	};

	if (role === "admin") {
		return {
			...commonFields,
			fullName: (initialData as IAdmin)?.fullName || "",
		};
	}

	const locationFields = {
		location: {
			type: "Point",
			name: (initialData as IBarber | IClient)?.location?.name || "",
			displayName:
				(initialData as IBarber | IClient)?.location?.displayName || "",
			zipCode:
				(initialData as IBarber | IClient)?.location?.zipCode || "",
			coordinates: (initialData as IBarber | IClient)?.location
				?.coordinates,
		},
	};

	if (role === "client") {
		return {
			...commonFields,
			...locationFields,
			fullName: (initialData as IClient)?.fullName || "",
		};
	}

	if (role === "barber") {
		return {
			...commonFields,
			...locationFields,
			shopName: (initialData as IBarber)?.shopName || "",
			banner: (initialData as IBarber)?.banner || "",
			amenities: {
				wifi: (initialData as IBarber)?.amenities?.wifi || false,
				parking: (initialData as IBarber)?.amenities?.parking || false,
			},
			description: (initialData as IBarber)?.description || "",
		};
	}

	return commonFields;
};

enum RoleFields {
	Admin = "fullName,email,phoneNumber,avatar",
	Client = "fullName,email,phoneNumber,location,avatar",
	Barber = "shopName,email,phoneNumber,description,location,avatar,banner",
}

const roleFields = {
	admin: RoleFields.Admin.split(","),
	client: RoleFields.Client.split(","),
	barber: RoleFields.Barber.split(","),
};

interface ProfileManagementProps {
	role: UserRoles;
	initialData: IAdmin | IBarber | IClient;
	isLoading?: boolean;
	onSubmit: (values: IAdmin | IBarber | IClient) => void;
}

export default function ProfileEditForm({
	role,
	initialData,
	isLoading = false,
	onSubmit,
}: ProfileManagementProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isProcessing = isLoading || isSubmitting;

	const navigate = useNavigate();

	const [avatarUrl, setAvatarUrl] = useState<string | null>(
		initialData?.avatar || null
	);
	const [bannerUrl, setBannerUrl] = useState<string | null>(
		(initialData as IBarber)?.banner || null
	);
	const avatarRef = useRef<Blob | null>(null);
	const bannerRef = useRef<Blob | null>(null);
	const visibleFields = roleFields[role];

	const formik = useFormik<FormValues>({
		initialValues: getInitialValues(role, initialData),
		validationSchema: getValidationSchema(role),
		onSubmit: async (values) => {
			setIsSubmitting(true);
			try {
				const updatedValues = { ...values };

				if (avatarRef.current) {
					const uploadedAvatarUrl = await uploadImageToCloudinary(
						avatarRef.current
					);
					if (!uploadedAvatarUrl) {
						throw new Error("Avatar upload failed");
					}
					updatedValues.avatar = uploadedAvatarUrl;
				}

				if (role === "barber" && bannerRef.current) {
					const uploadedBannerUrl = await uploadImageToCloudinary(
						bannerRef.current
					);
					if (!uploadedBannerUrl) {
						throw new Error("Banner upload failed");
					}
					updatedValues.banner = uploadedBannerUrl;
				}
				onSubmit(updatedValues);
			} catch (error) {
				console.error("Error during form submission:", error);
			} finally {
				setIsSubmitting(false);
			}
		},
		enableReinitialize: true,
	});

	const handleAvatarChange = useCallback(
		(file: Blob | null, imageUrl: string | null) => {
			setAvatarUrl(imageUrl);
			avatarRef.current = file;
		},
		[]
	);

	const handleBannerChange = useCallback(
		(file: Blob | null, imageUrl: string | null) => {
			setBannerUrl(imageUrl);
			bannerRef.current = file;
		},
		[]
	);

	const handleLocationSelect = (location: {
		name: string;
		displayName: string;
		zipCode: string;
		latitude: number | null;
		longitude: number | null;
	}) => {
		formik.setFieldValue("location", {
			type: "Point",
			name: location.name,
			displayName: location.displayName,
			zipCode: location.zipCode,
			coordinates: [location.longitude, location.latitude],
		});
	};

	const renderFields = () => {
		return (
			<div className="space-y-6">
				{/* Shop Name (Barber only) */}
				{visibleFields.includes("shopName") && (
					<div>
						<MuiTextField
							id="shopName"
							name="shopName"
							error={
								formik.touched?.shopName &&
								Boolean(formik.errors.shopName)
							}
							helperText={
								formik.touched.shopName
									? formik.errors.shopName
									: ""
							}
							value={formik.values.shopName as string}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							label="Shop Name"
							placeholder="Enter your shop name"
							disabled={isProcessing}
						/>
					</div>
				)}

				{/* Full Name (Admin & Client) */}
				{visibleFields.includes("fullName") && (
					<div>
						<MuiTextField
							id="fullName"
							name="fullName"
							error={
								formik.touched.fullName &&
								Boolean(formik.errors.fullName)
							}
							helperText={
								formik.touched.fullName
									? formik.errors.fullName
									: ""
							}
							value={formik.values.fullName as string}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							label="Full Name"
							placeholder="Enter your full name"
							disabled={isProcessing}
						/>
					</div>
				)}

				{/* Email (All roles) */}
				<div>
					<MuiTextField
						id="email"
						name="email"
						error={
							formik.touched.email && Boolean(formik.errors.email)
						}
						helperText={
							formik.touched.email ? formik.errors.email : ""
						}
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						label="Email"
						placeholder="Enter your email address"
						disabled={isProcessing}
					/>
				</div>

				{/* Phone Number (All roles) */}
				<div>
					<MuiTextField
						id="phoneNumber"
						name="phoneNumber"
						error={
							formik.touched.phoneNumber &&
							Boolean(formik.errors.phoneNumber)
						}
						helperText={
							formik.touched.phoneNumber
								? formik.errors.phoneNumber
								: ""
						}
						value={formik.values.phoneNumber}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						label="Phone Number"
						placeholder="Enter your phone number"
						disabled={isProcessing}
					/>
				</div>

				{/* Description (Barber only) */}
				{visibleFields.includes("description") && (
					<div>
						<MuiTextField
							type="tex"
							id="description"
							name="description"
							error={
								formik.touched.description &&
								Boolean(formik.errors.description)
							}
							helperText={
								formik.touched.description
									? formik.errors.description
									: ""
							}
							value={formik.values.description as string}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							label="Shop Description"
							placeholder="Enter a description of your shop"
							disabled={isProcessing}
						/>
					</div>
				)}

				{role === "barber" && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="wifi"
								checked={formik.values.amenities?.wifi}
								onChange={(event) =>
									formik.setFieldValue(
										"amenities.wifi",
										event.target.checked
									)
								}
								className="border-amber-400 text-amber-600"
							/>
							{/* <div className="grid gap-1.5 leading-none"> */}
							<Label
								htmlFor="wifi"
								className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
								<Wifi className="h-4 w-4 text-amber-500" /> Free
								WiFi
							</Label>
							{/* </div> */}
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="parking"
								checked={formik.values.amenities?.parking}
								onChange={(event) =>
									formik.setFieldValue(
										"amenities.parking",
										event.target.checked
									)
								}
								className="border-amber-400 text-amber-600"
							/>
							<div className="grid gap-1.5 leading-none">
								<Label
									htmlFor="parking"
									className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
									<ParkingCircle className="h-4 w-4 text-amber-500" />{" "}
									Parking Available
								</Label>
							</div>
						</div>
					</div>
				)}

				{/* Location (Client & Barber) */}
				{visibleFields.includes("location") && (
					<div>
						{/* <label className="block text-sm font-medium mb-1">
							Location
						</label> */}
						<LocationInputField
							onSelect={handleLocationSelect}
							initialValue={
								formik.values.location?.displayName || ""
							}
							placeholder="Search for your location"
							disabled={isProcessing}
							onChange={(value: string) => {
								formik.setFieldValue("location.name", value);
							}}
						/>
					</div>
				)}

				{/* Submit Button */}
				<div>
					<MuiAnimatedButton
						type="submit"
						loading={isProcessing}
						disabled={isProcessing}
						// className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
					>
						Save Changes
					</MuiAnimatedButton>
				</div>
			</div>
		);
	};

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div className="flex items-center mb-4 space-x-6">
				<IconButton
					sx={{
						minWidth: "auto",
						padding: "7px",
						color: "var(--yellow)",
						position: "relative",
						"&:hover": {
							color: "var(--yellow-hover)",
						},
					}}
					onClick={(e) => {
						e.preventDefault();
						navigate(-1);
					}}>
					<ArrowLeftCircleIcon className="h-6 w-6" />
				</IconButton>
				<Typography variant="h5" component="h1">
					Edit Profile
				</Typography>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Form Fields */}
				<div className="md:col-span-2">
					<form onSubmit={formik.handleSubmit} className="space-y-6">
						{renderFields()}
					</form>
				</div>

				{/* Media Upload Section */}
				<div className="md:col-span-1">
					<div className="bg-gray-50 p-6 rounded-lg">
						{/* Avatar Upload */}
						{visibleFields.includes("avatar") && (
							<div className="mb-6">
								<h3 className="text-lg font-medium mb-3">
									Profile Picture
								</h3>
								<ImageUploadField
									handleRemove={() =>
										formik.setFieldValue("avatar", null)
									}
									initialImage={avatarUrl || ""}
									onImageChange={handleAvatarChange}
									aspectRatio="square"
									label="Upload Profile Picture"
									maxSizeMB={5}
								/>
								<p className="text-xs text-gray-500 text-center mt-2">
									Image size should be under 1MB and image
									ratio needs to be 1:1
								</p>
							</div>
						)}

						{/* Banner Upload (Barber only) */}
						{visibleFields.includes("banner") && (
							<div className="mt-6">
								<h3 className="text-lg font-medium mb-3">
									Shop Banner
								</h3>
								<ImageUploadField
									handleRemove={() =>
										formik.setFieldValue("banner", null)
									}
									initialImage={bannerUrl || ""}
									onImageChange={handleBannerChange}
									aspectRatio="banner"
									label="Upload Banner Image"
									maxSizeMB={5}
								/>
								<p className="text-xs text-gray-500 text-center mt-2">
									Banner should be under 2MB and with a wide
									aspect ratio
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
