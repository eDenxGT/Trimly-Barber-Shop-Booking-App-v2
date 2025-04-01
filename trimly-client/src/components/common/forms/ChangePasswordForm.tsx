import { forwardRef, useImperativeHandle, useState } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import {
	Container,
	Paper,
	IconButton,
	Typography,
} from "@mui/material";
import { ArrowLeftCircleIcon} from "lucide-react";
import { MuiTextField } from "@/components/common/fields/MuiTextField";
import MuiButton from "@/components/common/buttons/MuiButton";
import { useNavigate } from "react-router-dom";
import { changePasswordSchema } from "@/utils/validations/change.password.validator";

export type PasswordFormValues = {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const initialValues: PasswordFormValues = {
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
};

export interface ChangePasswordFormRef {
	resetForm: () => void;
}

interface ChangePasswordProps {
	isLoading?: boolean;
	isPending?: boolean;
	isError?: boolean;
	isSuccess?: boolean;
	onSubmit: (values: { oldPassword: string; newPassword: string }) => void;
}

export const ChangePasswordForm = forwardRef<
	ChangePasswordFormRef,
	ChangePasswordProps
>(({ isLoading = false, onSubmit }, ref) => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isProcessing = isLoading || isSubmitting;

	const formik = useFormik<PasswordFormValues>({
		initialValues,
		validationSchema: changePasswordSchema,
		onSubmit: async (values) => {
			setIsSubmitting(true);
			try {
				onSubmit({
					oldPassword: values.oldPassword,
					newPassword: values.newPassword,
				});
			} catch (error) {
				console.error("Error during password change:", error);
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	useImperativeHandle(ref, () => ({
		resetForm: () => formik.resetForm(),
	}));

	return (
		<Container className="mt-26" maxWidth="sm">
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}>
				<Paper elevation={3} sx={{ p: 4, mt: 4 }}>
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
							{" "}
							<ArrowLeftCircleIcon className="h-6 w-6" />
						</IconButton>
						<Typography variant="h5" component="h1">
							Change Password
						</Typography>
					</div>

					<form onSubmit={formik.handleSubmit} className="space-y-6">
						<div>
							<MuiTextField
								id="oldPassword"
								name="oldPassword"
								label="Current Password"
								placeholder="Enter your current password"
								type={"password"}
								value={formik.values.oldPassword}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched.oldPassword &&
									Boolean(formik.errors.oldPassword)
								}
								helperText={
									formik.touched.oldPassword
										? formik.errors.oldPassword
										: ""
								}
								disabled={isProcessing}
								isPassword
							/>
						</div>

						<div>
							<MuiTextField
								id="newPassword"
								name="newPassword"
								label="New Password"
								placeholder="Enter your new password"
								type={"password"}
								value={formik.values.newPassword}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched.newPassword &&
									Boolean(formik.errors.newPassword)
								}
								helperText={
									formik.touched.newPassword
										? formik.errors.newPassword
										: "Password must be at least 8 characters"
								}
								disabled={isProcessing}
								isPassword
							/>
						</div>

						<div>
							<MuiTextField
								id="confirmPassword"
								name="confirmPassword"
								label="Confirm New Password"
								placeholder="Confirm your new password"
								type={"password"}
								value={formik.values.confirmPassword}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched.confirmPassword &&
									Boolean(formik.errors.confirmPassword)
								}
								helperText={
									formik.touched.confirmPassword
										? formik.errors.confirmPassword
										: ""
								}
								disabled={isProcessing}
								isPassword
							/>
						</div>

						<div className="flex justify-end mt-6">
							<MuiButton
								type="submit"
								loading={isProcessing}
								disabled={
									!formik.isValid ||
									!formik.dirty ||
									isProcessing
								}>
								Update Password
							</MuiButton>
						</div>
					</form>
				</Paper>
			</motion.div>
		</Container>
	);
});

ChangePasswordForm.displayName = "ChangePasswordForm";

export default ChangePasswordForm;
