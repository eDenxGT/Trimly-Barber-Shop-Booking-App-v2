import { motion } from "framer-motion";
import { BarberServiceManageForm } from "@/components/barber/settings/BarberServiceManagement";
import {
	useBarberServiceAddMutation,
	useBarberServiceDeleteMutation,
	useBarberServiceUpdateMutation,
	useGetBarberServices,
} from "@/hooks/barber/useBarberServices";
import { IService } from "@/types/Service";
import { useToaster } from "@/hooks/ui/useToaster";

export const BarberServiceManagementPage = () => {
	const {
		data: servicesData,
		isLoading,
		isError,
		error,
	} = useGetBarberServices();

	const { mutate: addService } = useBarberServiceAddMutation();

	const { mutate: deleteService } = useBarberServiceDeleteMutation();

	const { successToast, errorToast } = useToaster();

	const {
		mutate: updateService,
		isPending: isUpdatingPending,
		isError: isUpdatingError,
	} = useBarberServiceUpdateMutation();

	const handleAddService = async (service: IService): Promise<boolean> => {
		return new Promise((resolve) => {
			addService(service, {
				onSuccess: (data) => {
					successToast(data.message);
					resolve(true);
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
					resolve(false);
				},
			});
		});
	};

	const handleDeleteService = async (serviceId: string): Promise<boolean> => {
		return new Promise((resolve) => {
			deleteService(
				{ serviceId },
				{
					onSuccess: (data) => {
						successToast(data.message);
						resolve(true);
					},
					onError: (error: any) => {
						errorToast(error.response.data.message);
						resolve(false);
					},
				}
			);
		});
	};

	const handleUpdateService = async (service: IService): Promise<boolean> => {
		return new Promise((resolve) => {
			updateService(service, {
				onSuccess: (data) => {
					successToast(data.message);
					resolve(true);
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
					resolve(false);
				},
			});
		});
	};

	const handleUpdateStatus = async (
		serviceId: string,
		status: "active" | "blocked"
	): Promise<boolean> => {
		return new Promise((resolve) => {
			updateService(
				{ serviceId, status },
				{
					onSuccess: (data) => {
						successToast(data.message);
						resolve(true);
					},
					onError: (error: any) => {
						errorToast(error.response.data.message);
						resolve(false);
					},
				}
			);
		});
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
