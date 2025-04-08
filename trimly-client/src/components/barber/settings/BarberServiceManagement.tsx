import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ServiceModal from "@/components/modals/ServiceModal";
import { IService } from "@/types/Service";
import MuiButton from "@/components/common/buttons/MuiButton";
import { ArrowLeft, Eye, EyeOff, Pen, Trash2 } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BarberServiceManageFormProps {
	services: IService[];
	onUpdateService: (newService: IService) => Promise<boolean>;
	onAddService: (newService: IService) => Promise<boolean>;
	onDeleteService: (serviceId: string) => Promise<boolean>;
	onUpdateStatus: (
		serviceId: string,
		status: "blocked" | "active"
	) => Promise<boolean>;
	isUpdating: boolean;
}

export const BarberServiceManageForm = ({
	services,
	onUpdateService,
	onAddService,
	onDeleteService,
	onUpdateStatus,
	isUpdating,
}: BarberServiceManageFormProps) => {
	const [showModal, setShowModal] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

	const navigate = useNavigate();

	const formik = useFormik<IService>({
		initialValues: {
			serviceId: "",
			name: "",
			price: 0,
			genderType: "unisex",
			description: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			name: Yup.string().required("Service name is required"),
			price: Yup.number()
				.min(50, "Price must be at least ₹50")
				.required("Price is required"),
			genderType: Yup.string().oneOf(
				["male", "female", "unisex"],
				"Invalid gender type"
			),
			description: Yup.string().required("Description is required"),
		}),
		onSubmit: async (values) => {
			const existingServiceIndex = services.findIndex(
				(service) => service.serviceId === values.serviceId
			);
			let success;
			if (editMode && existingServiceIndex !== -1) {
				success = await onUpdateService(values);
			} else {
				success = await onAddService(values);
			}
			if (success) {
				onCloseModal();
			}
		},
	});

	const handleEdit = (serviceId: string) => {
		const serviceToEdit = services.find(
			(service) => service.serviceId === serviceId
		);
		if (serviceToEdit) {
			setEditMode(true);
			formik.setValues({ ...serviceToEdit });
			setShowModal(true);
		}
	};

	const handleDeleteClick = (serviceId: string) => {
		setServiceToDelete(serviceId);
		setShowDeleteConfirmation(true);
	};

	const confirmDelete = async () => {
		if (serviceToDelete) {
			onDeleteService(serviceToDelete);
			setServiceToDelete(null);
		}
	};

	const onCloseModal = () => {
		setShowModal(false);
		setEditMode(false);
		formik.resetForm();
	};

	return (
		<div className="p-6 max-w-6xl mt-16 mx-auto">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate(-1)}
						className="rounded-full hover:cursor-pointer hover:bg-yellow-100">
						<ArrowLeft className="h-5 w-5 text-yellow-600" />
					</Button>

					<h1 className="text-2xl font-bold">Service Management</h1>
				</div>
				<MuiButton
					onClick={() => {
						setEditMode(false);
						formik.resetForm();
						setShowModal(true);
					}}>
					Add New Service
				</MuiButton>
			</div>

			<div className="overflow-x-auto bg-white rounded-lg shadow">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Service ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Price
							</th>

							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Gender Type
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Description
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{services.length > 0 ? (
							services.map((service) => (
								<tr
									key={service.serviceId}
									className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{service.serviceId.slice(0, 20)}...
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{service.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										${service.price}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
										{service.genderType}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
										{service.description}
									</td>
									<td className="px-6 py-4 flex gap-3 whitespace-nowrap text-sm text-gray-500">
										{isUpdating ? (
											<CircularProgress size={18} />
										) : (
											<>
												<button
													onClick={() =>
														handleEdit(
															service.serviceId
														)
													}
													className="text-blue-600 cursor-pointer hover:text-blue-900">
													<Pen size={17} />
												</button>
												<button
													onClick={() =>
														onUpdateStatus(
															service.serviceId,
															service.status ===
																"active"
																? "blocked"
																: "active"
														)
													}
													className={`${
														service.status ===
														"blocked"
															? "text-green-500 hover:text-green-800"
															: "text-red-500 hover:text-red-800"
													} cursor-pointer `}>
													{service.status ===
													"blocked" ? (
														<Eye size={18} />
													) : (
														<EyeOff size={18} />
													)}
												</button>
												<button
													onClick={() =>
														handleDeleteClick(
															service.serviceId
														)
													}
													className="text-red-600 cursor-pointer hover:text-red-900">
													<Trash2 size={18} />
												</button>
											</>
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={7}
									className="px-6 py-4 text-center text-sm text-gray-500">
									No services found. Add a new one.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<ServiceModal
				open={showModal}
				formik={formik}
				editMode={editMode}
				onCloseModal={onCloseModal}
			/>
			<ConfirmationModal
				isOpen={showDeleteConfirmation}
				title="Delete Service"
				description="Are you sure you want to delete this service? This action cannot be undone."
				confirmText="Delete"
				cancelText="Cancel"
				confirmVariant="destructive"
				onConfirm={confirmDelete}
				onClose={() => setShowDeleteConfirmation(false)}
			/>
		</div>
	);
};
