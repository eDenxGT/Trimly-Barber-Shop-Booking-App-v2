// const NavItem = ({ item, isActive, onClick }: NavItemProps) => {
// 	const Icon = item.icon;

// 	return (
// 		<Link
// 			to={item.path}
// 			className={cn(
// 				"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
// 				isActive
// 					? "bg-[var(--yellow)] text-black font-medium"
// 					: "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
// 			)}
// 			onClick={onClick}>
// 			<Icon className="h-5 w-5" />
// 			<span>{item.title}</span>
// 		</Link>
// 	);
// };