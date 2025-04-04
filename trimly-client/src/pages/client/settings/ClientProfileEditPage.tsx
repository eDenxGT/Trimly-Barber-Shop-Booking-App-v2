import ProfileEditForm from "@/components/common/forms/ProfileEditForm";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { IClient } from "@/types/User";
import { useClientProfileMutation } from "@/hooks/client/useClientProfile";
import { useToaster } from "@/hooks/ui/useToaster";
import { clientLogin } from "@/store/slices/client.slice";
import { motion } from "framer-motion";
import useRefreshSession from "@/hooks/common/useRefreshSession";

export const ClientProfileEditPage = () => {
	useRefreshSession("client");
	const client = useSelector((state: RootState) => state.client.client);
	const {
		mutate: updateProfile,
		isPending,
		isError,
	} = useClientProfileMutation();
	const { successToast, errorToast } = useToaster();

	const dispatch = useAppDispatch();

	const handleClientProfileUpdate = (data) => {
		updateProfile(
			{
				...data,
			},
			{
				onSuccess: (data) => {
					successToast(data.message);
					dispatch(clientLogin(data.user as IClient));
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
				},
			}
		);
	};

	return (
		<motion.div
			key={"client-profile-edit"}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="p-4 mt-16">
			<ProfileEditForm
				isLoading={!isError && isPending}
				role="client"
				initialData={client as IClient}
				onSubmit={handleClientProfileUpdate}
			/>
		</motion.div>
	);
};
