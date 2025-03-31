import { useEffect, useState } from "react";
import { LogOut, ArrowLeftCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import SideBarItems from "@/config/SideBarConfig";

interface NavItemProps {
	item: {
		title: string;
		path: string;
		icon: React.ElementType;
	};
	isActive: boolean;
	onClick: () => void;
}

const NavItem = ({ item, isActive, onClick }: NavItemProps) => {
	const Icon = item.icon;

	return (
		<Link
			to={item.path}
			className={cn(
				"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
				isActive
					? "bg-[var(--yellow)] text-black font-medium"
					: "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
			)}
			onClick={onClick}>
			<Icon className="h-5 w-5" />
			<span>{item.title}</span>
		</Link>
	);
};

interface SidebarProps {
	isVisible: boolean;
	onClose: () => void;
	handleLogout?: () => void;
	className?: string;
	role: "admin" | "client" | "barber";
}

export function Sidebar({
	isVisible,
	onClose,
	handleLogout,
	className,
	role,
}: SidebarProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
		useState(false);

	const navItems: Array<{
		title: string;
		path: string;
		icon: React.ElementType;
	}> = SideBarItems[role];

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedIndex = localStorage.getItem("activeItem");
			if (storedIndex) {
				setActiveIndex(Number.parseInt(storedIndex, 10));
			}
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("activeItem", activeIndex.toString());
		}
	}, [activeIndex]);

	const handleLogoutClick = () => {
		setIsConfirmationModalOpen(true);
	};

	const onConfirmLogout = () => {
		if (handleLogout) {
			handleLogout();
		}
		setIsConfirmationModalOpen(false);
		if (typeof window !== "undefined") {
			localStorage.removeItem("activeItem");
		}
	};

	return (
		<>
			{/* Overlay with AnimatePresence for smooth transitions */}
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
						onClick={onClose}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<div
				className={cn(
					"fixed left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out",
					isVisible ? "translate-x-0" : "-translate-x-full",
					className
				)}>
				<div className="flex flex-col h-full bg-[#121212] border-r border-[#2a2a2a] shadow-[5px_0_15px_rgba(0,0,0,0.3)]">
					{/* Sidebar Header */}
					<div className="flex justify-between items-center px-6 py-3.5 border-b border-[#2a2a2a]">
						<div className="flex items-center gap-2">
							<img
								src="/logo.svg"
								alt="Logo"
								className="w-7 h-7"
							/>
							<span className="text-2xl font-young text-white">
								Trimly
							</span>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="text-white hover:text-[var(--yellow)] hover:bg-transparent">
							<ArrowLeftCircle />
						</Button>
					</div>

					{/* Navigation Items */}
					<nav className="flex-1 mt-1 px-3 overflow-y-auto">
						<div className="space-y-1 py-2">
							{navItems.map((item, index) => (
								<NavItem
									key={index}
									item={item}
									isActive={index === activeIndex}
									onClick={() => {
										setActiveIndex(index);
										onClose();
									}}
								/>
							))}
						</div>
					</nav>

					{/* Logout Button */}
					<div className="mt-auto p-4 border-t border-[#2a2a2a]">
						<Button
							variant="ghost"
							className="w-full justify-start text-gray-400 hover:bg-red-600 hover:text-white"
							onClick={handleLogoutClick}>
							<LogOut className="h-5 w-5 mr-2" />
							Sign-out
						</Button>
					</div>
				</div>
			</div>

			{/* Confirmation Modal for Logout */}
			<Dialog
				open={isConfirmationModalOpen}
				onOpenChange={setIsConfirmationModalOpen}>
				<DialogContent className="sm:max-w-[425px] bg-[#1e1e1e] text-white border-[#2a2a2a]">
					<DialogHeader>
						<DialogTitle>Logout</DialogTitle>
						<DialogDescription className="text-gray-400">
							Are you sure you want to logout from Trimly?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-2 sm:justify-end">
						<Button
							variant="outline"
							onClick={() => setIsConfirmationModalOpen(false)}
							className="border-[#2a2a2a] text-white bg-[#161616] hover:bg-[#2a2a2a] hover:text-white">
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={onConfirmLogout}
							className="bg-red-600 hover:bg-red-700">
							Logout
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
