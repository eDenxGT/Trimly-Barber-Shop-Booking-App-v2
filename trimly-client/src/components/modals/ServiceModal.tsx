import type React from "react";
import type { useFormik } from "formik";
import { MuiTextField } from "../common/fields/MuiTextField";
import MuiButton from "../common/buttons/MuiButton";
import type { IService } from "@/types/Service";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

interface ServiceModalProps {
	formik: ReturnType<typeof useFormik<IService>>;
	editMode: boolean;
	onCloseModal: () => void;
	open: boolean;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
	formik,
	editMode,
	onCloseModal,
	open,
}) => {
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onCloseModal();
			}}>
			<DialogContent className="max-w-md w-full max-h-screen overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{editMode ? "Edit Service" : "Add New Service"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={formik.handleSubmit}>
					<div className="mb-4">
						<MuiTextField
							id="name"
							name="name"
							label="Service Name"
							placeholder="Enter service name"
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.name &&
								Boolean(formik.errors.name)
							}
							helperText={
								formik.touched.name ? formik.errors.name : ""
							}
						/>
					</div>

					<div className="mb-4">
						<MuiTextField
							id="price"
							name="price"
							label="Price (₹)"
							type="number"
							placeholder="Enter price"
							value={String(formik.values.price)}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.price &&
								Boolean(formik.errors.price)
							}
							helperText={
								formik.touched.price ? formik.errors.price : ""
							}
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="genderType">
							Gender Type <span className="text-red-500">*</span>
						</label>
						<select
							id="genderType"
							name="genderType"
							value={formik.values.genderType}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="unisex">Unisex</option>
						</select>
					</div>

					<div className="mb-6">
						<MuiTextField
							id="description"
							name="description"
							label="Description"
							placeholder="Enter description"
							value={formik.values.description as string}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.description &&
								Boolean(formik.errors.description)
							}
							helperText={
								formik.touched.description
									? formik.errors.description
									: ""
							}
						/>
					</div>

					<DialogFooter>
						<MuiButton
							type="button"
							onClick={onCloseModal}
							variant="outlined">
							Cancel
						</MuiButton>
						<MuiButton type="submit" variant="yellow">
							{editMode ? "Update" : "Add"} Service
						</MuiButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ServiceModal;
