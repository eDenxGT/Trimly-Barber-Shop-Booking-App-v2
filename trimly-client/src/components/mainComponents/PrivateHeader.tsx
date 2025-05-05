import {
	Bell,
	Settings2,
	Menu,
	MapPin,
	User,
	LogOut,
	HelpCircle,
} from "lucide-react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IAdmin, IBarber, IClient, UserDTO } from "@/types/User";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	user: UserDTO | null;
	notifications?: number;
	onSidebarToggle?: () => void;
	onLogout: () => void;
	className?: string;
}

export function PrivateHeader({
	user,
	notifications = 2,
	onSidebarToggle,
	onLogout,
	className,
}: HeaderProps) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const isClient = user?.role === "client";
	const isBarber = user?.role === "barber";

	const displayName = isBarber
		? (user as IBarber)?.shopName
		: (user as IClient | IAdmin)?.fullName || "User";
	const initials = `${displayName?.trim().slice(0, 1) || ""}`;

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const locationName = (user as IBarber | IClient)?.location?.name;
	const settingsPath = isClient
		? "/settings"
		: isBarber
		? "/barber/settings"
		: "/admin/settings";
	const profilePath = isClient
		? "/settings/profile"
		: isBarber
		? "/barber/settings/profile"
		: "/admin/settings/profile";

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 h-16 border-b border-gray-700 bg-[#121212] shadow-md",
				className
			)}>
			<div className=" mx-auto justify-between flex h-full items-center px-4">
				{/* Hamburger menu button */}
				<div className="flex items-center">
					<Tooltip title="Toggle sidebar" arrow placement="bottom">
						<Button
							variant="text"
							sx={{
								minWidth: "auto",
								padding: "8px",
								color: "white",
								"&:hover": {
									backgroundColor: "#2a2a2a",
								},
								"& .MuiButton-startIcon": {
									margin: 0, // Fix padding issue in Edge
								},
							}}
							onClick={onSidebarToggle}>
							<Menu className="h-6 w-6" />
						</Button>
					</Tooltip>

					{/* Logo */}
					<div className="ml-2 mr-8 flex items-center space-x-2">
						<img src="/logo.svg" alt="Logo" className="w-7 h-7" />
						<span className="text-xl font-young text-white">
							Trimly
						</span>
					</div>
				</div>

				{/* Search */}
				{/* <div className="flex-1 max-w-2xl mx-auto"> */}
				{/* <Tooltip
						title="Press ⌘K to search"
						arrow
						placement="bottom">
						<Button
						variant="text"
						fullWidth
							sx={{
								justifyContent: "space-between",
								backgroundColor: "#1e1e1e",
								color: "white",
								textTransform: "none",
								padding: "8px 16px",
								borderRadius: "6px",
								"&:hover": {
									backgroundColor: "#2a2a2a",
									},
									}}
							onClick={() => setOpen(true)}>
							<div className="flex items-center">
							<Search className="mr-2 h-4 w-4" />
							<span className="text-muted-foreground">
									Search barbers or services...
									</span>
									</div>
						</Button>
					</Tooltip>
					<CommandDialog open={open} onOpenChange={setOpen}>
					<Command className="rounded-lg border shadow-md">
							<CommandInput placeholder="Type to search..." />
							<CommandList>
								<CommandEmpty>No results found.</CommandEmpty>
								{searchItems.map((group) => (
									<CommandGroup
										key={group.category}
										heading={group.category}>
										{group.items.map((item) => (
											<CommandItem
												key={item.id}
												onSelect={() => {
													setOpen(false);
												}}>
												<div className="flex items-center justify-between w-full">
													<span>{item.name}</span>
													{item.type === "barber" ? (
														<Badge variant="secondary">
														⭐ {item.rating}
														</Badge>
														) : (
															<Badge variant="outline">
															{item.price}
															</Badge>
															)}
															</div>
											</CommandItem>
											))}
									</CommandGroup>
									))}
							</CommandList>
							</Command>
					</CommandDialog> */}
				{/* </div> */}

				{/* Right Section */}
				<div className="ml-8 flex items-center space-x-6">
					{/* User Info */}
					{(isClient || isBarber) && (
						<div className="hidden md:flex items-center space-x-4">
							<div className="flex flex-col items-end">
								<span className="text-sm font-medium text-white">
									{displayName}
								</span>
								<div className="flex items-center text-xs text-gray-400">
									<MapPin className="mr-1 h-3 w-3" />
									{locationName?.slice(0, 50) || "Location"}
								</div>
							</div>
						</div>
					 )}

					{/* Notifications */}
					{/* <Tooltip title="Notifications" arrow placement="bottom">
						<div>
							<Popover>
								<PopoverTrigger asChild>
									<IconButton
										sx={{
											minWidth: "auto",
											padding: "8px",
											color: "white",
											position: "relative",
											"&:hover": {
												backgroundColor: "#2a2a2a",
											},
										}}>
										<Bell className="h-5 w-5" />
										{notifications > 0 && (
											<span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
												{notifications}
											</span>
										)}
									</IconButton>
								</PopoverTrigger>
								<PopoverContent
									className="w-80 bg-[#1e1e1e] text-white border-[#2a2a2a] shadow-lg"
									align="end">
									<div className="space-y-2">
										<h4 className="font-medium leading-none">
											Notifications
										</h4>
										<p className="text-sm text-muted-foreground">
											You have {notifications} unread
											notifications.
										</p>
										<div className="border-t border-[#2a2a2a] pt-2 mt-2"> */}
											{/* Sample notifications */}
											{/* <div className="flex items-start space-x-2 mb-2">
												<div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
													<img
														src="/logo.svg"
														alt="Logo"
														className="w-4 h-4"
													/>
												</div>
												<div>
													<p className="text-sm font-medium">
														Appointment Reminder
													</p>
													<p className="text-xs text-muted-foreground">
														Your haircut appointment
														is in 2 hours
													</p>
												</div>
											</div>
											<div className="flex items-start space-x-2">
												<div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
													<MapPin className="h-4 w-4" />
												</div>
												<div>
													<p className="text-sm font-medium">
														New Barber Nearby
													</p>
													<p className="text-xs text-muted-foreground">
														Classic Cuts opened near
														you
													</p>
												</div>
											</div>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</Tooltip> */}

					{/* Avatar with Dropdown */}
					<Tooltip title="Account" arrow placement="bottom">
						<div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="cursor-pointer">
										<Avatar className="h-8 w-8 ring-offset-amber-200 transition-colors hover:ring-2  hover:ring-offset-2">
											<AvatarImage
												className="object-cover hover:scale-110 transition-transform duration-200"
												src={user?.avatar}
												alt={displayName}
											/>
											<AvatarFallback className="bg-[var(--yellow)] text-black">
												{initials}
											</AvatarFallback>
										</Avatar>
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-56 bg-[#1e1e1e] text-white border-[#2a2a2a] shadow-lg"
									align="end">
									<DropdownMenuLabel>
										My Account
									</DropdownMenuLabel>
									<DropdownMenuSeparator className="bg-[#2a2a2a]" />
									<DropdownMenuGroup>
										<DropdownMenuItem
											onClick={() =>
												navigate(profilePath)
											}
											className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:text-white">
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												navigate(settingsPath)
											}
											className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:text-white">
											<Settings2 className="mr-2 h-4 w-4" />
											<span>Settings</span>
										</DropdownMenuItem>
										<DropdownMenuItem className="cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:text-white">
											<HelpCircle className="mr-2 h-4 w-4" />
											<span>Help & Support</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator className="bg-[#2a2a2a]" />
									<DropdownMenuItem
										className="cursor-pointer text-red-500 hover:text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-white"
										onClick={onLogout}>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</Tooltip>
				</div>
			</div>
		</header>
	);
}
