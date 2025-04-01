import { motion } from "framer-motion";
import { BarberServiceManageForm } from "@/components/barber/settings/BarberServiceManagement";
import {
	useBarberServiceAddMutation,
	useBarberServiceDeleteMutation,
	useBarberServiceUpdateMutation,
	useGetBarberServices,
} from "@/hooks/barber/useBarberServices";
import { IService } from "@/types/Service";

export const BarberServiceManagementPage = () => {
	const {
		data: servicesData,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetBarberServices();

	const { mutate: addService } = useBarberServiceAddMutation();

	const { mutate: deleteService } = useBarberServiceDeleteMutation();

	const {
		mutate: updateService,
		isPending: isUpdatingPending,
		isError: isUpdatingError,
	} = useBarberServiceUpdateMutation();

	const handleAddService = async (service: IService) => {
		try {
			await addService(service);
			refetch();
		} catch (err) {
			console.error("Error adding service:", err);
		}
	};

	const handleDeleteService = async (serviceId: string) => {
		try {
			await deleteService({ serviceId });
			refetch();
		} catch (err) {
			console.error("Error deleting service:", err);
		}
	};

	const handleUpdateService = async (service: IService) => {
		try {
			await updateService(service);
			refetch();
		} catch (err) {
			console.error("Error updating service:", err);
		}
	};

	const handleUpdateStatus = async (
		serviceId: string,
		status: "active" | "blocked"
	) => {
		try {
			await updateService({ serviceId, status });
			refetch();
		} catch (err) {
			console.error("Error updating service:", err);
		}
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error: {error.message}</p>;

	return (
		<motion.div
			key={"barber-profile-edit"}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="p-4">
			<BarberServiceManageForm
				onUpdateStatus={handleUpdateStatus}
				services={servicesData?.services || ([] as IService[])}
				onAddService={handleAddService}
				onDeleteService={handleDeleteService}
				onUpdateService={handleUpdateService}
				isUpdating={isUpdatingPending && !isUpdatingError}
			/>
		</motion.div>
	);
};
