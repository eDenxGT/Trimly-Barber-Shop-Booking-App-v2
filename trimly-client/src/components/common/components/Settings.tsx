import { useState } from "react";
import {
	ArrowLeft,
	LockKeyhole,
	LogOut,
	SettingsIcon,
	Trash2,
	User,
	Bell,
	Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { SettingsCard } from "../cards/SettingsCard";

export type UserRole = "client" | "admin" | "barber";

export interface SettingsProps {
	userRole?: UserRole;

	initialEmailNotifications?: boolean;
	initialAppNotifications?: boolean;
	initialMarketingEmails?: boolean;

	profileUrl: string;
	securityUrl: string;

	onEmailNotificationsChange?: (checked: boolean) => void;
	onAppNotificationsChange?: (checked: boolean) => void;
	onMarketingEmailsChange?: (checked: boolean) => void;
	onLogout?: () => void;
	onDeleteAccount?: () => void;
	onBack?: () => void;
}

export function Settings({
	userRole = "client",

	profileUrl,
	securityUrl,
	initialEmailNotifications = true,
	initialAppNotifications = true,
	initialMarketingEmails = false,

	// Handlers
	onEmailNotificationsChange = () => {},
	onAppNotificationsChange = () => {},
	//   onMarketingEmails = () => {},
	onLogout = () => {},
	onDeleteAccount = () => {},
}: SettingsProps) {
	const navigate = useNavigate();
	const [emailNotifications, setEmailNotifications] = useState(
		initialEmailNotifications
	);
	const [appNotifications, setAppNotifications] = useState(
		initialAppNotifications
	);
	const [marketingEmails, setMarketingEmails] = useState(
		initialMarketingEmails
	);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [confirmLogout, setConfirmLogout] = useState(false);

	const handleEmailNotificationsChange = (checked: boolean) => {
		setEmailNotifications(checked);
		onEmailNotificationsChange(checked);
	};

	const handleAppNotificationsChange = (checked: boolean) => {
		setAppNotifications(checked);
		onAppNotificationsChange(checked);
	};

	const handleMarketingEmailsChange = (checked: boolean) => {
		setMarketingEmails(checked);
		//  onMarketingEmails(checked);
	};

	const handleLogout = () => {
		onLogout();

		setTimeout(() => {
			setConfirmLogout(false);
			navigate("/");
		}, 500);
	};

	const handleDeleteAccount = () => {
		onDeleteAccount();

		setTimeout(() => {
			setConfirmDelete(false);
			navigate("/");
		}, 500);
	};

	return (
		<div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8 mt-8">
			{/* Header with back button */}
			<div className="flex items-center gap-3 mb-6">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 hover:bg-gray-200 w-8 cursor-pointer"
					onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4" />
					<span className="sr-only">Go back</span>
				</Button>
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
						Settings
					</h1>
					<p className="text-gray-500">
						Manage your account settings and preferences.
					</p>
				</div>
			</div>

			<div className="grid gap-6">
				{/* Profile Card */}
				<SettingsCard
					icon={User}
					title="Edit Profile"
					description="Manage your profile information"
					actionLabel="Personal Information"
					onClick={() => navigate(profileUrl)}
				/>

				{/* Security Card */}
				<SettingsCard
					icon={LockKeyhole}
					title="Security"
					description="Manage your account security"
					actionLabel="Change Password"
					onClick={() => navigate(securityUrl)}
				/>

				{/* Barber-specific Cards */}
				{userRole === "barber" && (
					<>
						{/* Services Card */}
						<SettingsCard
							icon={SettingsIcon}
							title="Services"
							description="Manage the services you offer"
							actionLabel="Edit Services"
							onClick={() =>
								navigate("/barber/settings/services")
							}
						/>

						{/* Opening Hours Card */}
						<SettingsCard
							icon={Clock}
							title="Opening Hours"
							description="Set your working hours"
							actionLabel="Edit Hours"
							onClick={() =>
								navigate("/barber/settings/opening-hours")
							}
						/>
					</>
				)}

				{/* Notifications Card */}
				<Card className="overflow-hidden border  border-gray-200 hover:border-gray-300 transition-colors">
					<CardHeader className="flex flex-row items-center gap-4 p-6">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
							<Bell className="h-5 w-5 text-gray-700" />
						</div>
						<div>
							<h3 className="font-semibold">Notifications </h3>
							<p className="text-sm text-gray-500">
								Manage notification settings{" "}
							</p>
						</div>
					</CardHeader>
					<CardContent className="p-6 pt-0">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label htmlFor="email-notifications">
										Email Notifications
									</Label>
									<p className="text-sm text-gray-500">
										Receive notifications via email
									</p>
								</div>
								<Switch
									id="email-notifications"
									checked={emailNotifications}
									onCheckedChange={
										handleEmailNotificationsChange
									}
								/>
							</div>

							<Separator className="bg-gray-200" />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label htmlFor="app-notifications">
										App Notifications
									</Label>
									<p className="text-sm text-gray-500">
										Receive in-app notifications
									</p>
								</div>
								<Switch
									id="app-notifications"
									checked={appNotifications}
									onCheckedChange={
										handleAppNotificationsChange
									}
								/>
							</div>

							<Separator className="bg-gray-200" />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label htmlFor="marketing-emails">
										Marketing Emails
									</Label>
									<p className="text-sm text-gray-500">
										Receive emails about new features and
										promotions
									</p>
								</div>
								<Switch
									id="marketing-emails"
									checked={marketingEmails}
									onCheckedChange={
										handleMarketingEmailsChange
									}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Account Actions Card */}
				<Card className="overflow-hidden border border-red-200 bg-red-50">
					<CardHeader className="flex flex-row items-center gap-4 p-6">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
							<SettingsIcon className="h-5 w-5 text-red-600" />
						</div>
						<div>
							<h3 className="font-semibold">Account Actions </h3>
							<p className="text-sm text-gray-500">
								Manage your account{" "}
							</p>
						</div>
					</CardHeader>
					<CardContent className="p-6 pt-0">
						<div className="space-y-6">
							<>
								<div className="flex items-center justify-between">
									<div>
										<span className="font-medium">
											Logout
										</span>
										<p className="text-sm text-gray-500">
											Sign out of your account
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="gap-1"
										onClick={() => setConfirmLogout(true)}>
										<LogOut className="h-4 w-4" />
										Logout
									</Button>
								</div>

								<Separator className="bg-gray-200" />
							</>

							<div className="flex items-center justify-between">
								<div>
									<span className="font-medium text-red-600">
										Delete Account
									</span>
									<p className="text-sm text-gray-500">
										Permanently delete your account
									</p>
								</div>
								<Button
									variant="destructive"
									size="sm"
									className="gap-1"
									onClick={() => setConfirmDelete(true)}>
									<Trash2 className="h-4 w-4" />
									Delete
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Logout Confirmation Modal */}
			<ConfirmationModal
				isOpen={confirmLogout}
				title="Are you sure you want to logout?"
				description="You will be logged out of your account."
				confirmText="Logout"
				cancelText="Cancel"
				onConfirm={handleLogout}
				onClose={() => setConfirmLogout(false)}
			/>

			{/* Delete Account Confirmation Modal */}
			<ConfirmationModal
				isOpen={confirmDelete}
				title="Are you sure you want to delete your account?"
				description="This action cannot be undone. Your account and all your data will be permanently deleted."
				confirmText="Delete Account"
				confirmVariant="destructive"
				onConfirm={handleDeleteAccount}
				onClose={() => setConfirmDelete(false)}
			/>
		</div>
	);
}
