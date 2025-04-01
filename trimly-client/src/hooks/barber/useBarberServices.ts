import {
	addBarberService,
	deleteBarberService,
	getBarberServices,
	updateBarberService,
} from "@/services/barber/barberService";
import { IAxiosResponse, IServiceResponse } from "@/types/Response";
import { IService } from "@/types/Service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBarberServiceUpdateMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<IAxiosResponse, Error, Partial<IService>>({
		mutationFn: updateBarberService,
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["barber-services"] });
		},
	});
};

export const useBarberServiceAddMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<IAxiosResponse, Error, IService>({
		mutationFn: addBarberService,
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["barber-services"] });
		},
	});
};

export const useBarberServiceDeleteMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<IAxiosResponse, Error, { serviceId: string }>({
		mutationFn: ({ serviceId }) => deleteBarberService(serviceId),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["barber-services"] });
		},
	});
};

export const useGetBarberServices = () => {
	return useQuery<IServiceResponse, Error>({
		queryKey: ["barber-services"],
		queryFn: getBarberServices,
	});
};
