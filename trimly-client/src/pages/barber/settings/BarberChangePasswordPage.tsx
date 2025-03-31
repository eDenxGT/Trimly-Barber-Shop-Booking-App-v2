import { ChangePasswordForm } from "@/components/common/forms/ChangePasswordForm";
import { useToaster } from "@/hooks/ui/useToaster";
import { UpdatePasswordData } from "@/types/User";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useBarberPasswordUpdateMutation } from "@/hooks/barber/useBarberPassword";

export const BarberChangePasswordPage = () => {
	const {
		mutate: changeBarberPassword,
		isPending,
		isError,
	} = useBarberPasswordUpdateMutation();
	const { successToast, errorToast } = useToaster();
	const formRef = useRef<{ resetForm: () => void } | null>(null);

	const handleSubmit = ({ oldPassword, newPassword }: UpdatePasswordData) => {
		changeBarberPassword(
			{
				oldPassword,
				newPassword,
			},
			{
				onSuccess: (data) => {
					successToast(data.message);
					if (formRef.current) {
						formRef.current.resetForm();
					}
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
				},
			}
		);
	};
	return (
		<motion.div
			key={"barber-change-pass"}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="p-4">
			<ChangePasswordForm
				ref={formRef}
				onSubmit={handleSubmit}
				isLoading={isPending && !isError}
			/>
		</motion.div>
	);
};
