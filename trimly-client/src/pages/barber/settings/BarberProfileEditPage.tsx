import ProfileEditForm from "@/components/common/forms/ProfileEditForm";
import { useBarberProfileMutation } from "@/hooks/barber/useBarberProfile";
import { useToaster } from "@/hooks/ui/useToaster";
import { barberLogin } from "@/store/slices/barber.slice";
import { RootState } from "@/store/store";
import { IBarber } from "@/types/User";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

export const BarberProfileEditPage = () => {
	const barber = useSelector((state: RootState) => state.barber.barber);
	const {
		mutate: updateProfile,
		isPending,
		isError,
	} = useBarberProfileMutation();
	const { successToast, errorToast } = useToaster();

	const dispatch = useDispatch();

	const handleBarberProfileUpdate = (data) => {
		updateProfile(
			{
				...data,
			},
			{
				onSuccess: (data) => {
					successToast(data.message);
					console.log(data);
					dispatch(barberLogin(data.user as IBarber));
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
				},
			}
		);
	};

	return (
		<motion.div
			key={"barber-profile-edit"}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="p-4">
			<ProfileEditForm
				isLoading={!isError && isPending}
				role="barber"
				initialData={barber as IBarber}
				onSubmit={handleBarberProfileUpdate}
			/>
		</motion.div>
	);
};
