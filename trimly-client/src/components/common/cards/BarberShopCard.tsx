import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	MapPin,
	Clock,
	Wifi,
	ParkingCircle,
	Phone,
	Mail,
	Calendar,
	Pen,
} from "lucide-react";

import { UserRoles } from "@/types/UserRoles";
import { useNavigate } from "react-router-dom";

interface IBarberShopCardProps {
	shop: IBarberShopData;
	role?: UserRoles;
	handleBookNow: (shopId: string) => void;
	isOwner?: boolean;
}

export const BarberShopCard = ({
	shop,
	role,
	handleBookNow,
	isOwner = false,
}: IBarberShopCardProps) => {
	const navigate = useNavigate();
	const handleVisitProfile = (shopId: string) => {
		if (role === "barber") {
			navigate(`/barber/shop/${shopId}`);
		}
	};
	return (
		<Card className="w-full max-w-sm mx-auto overflow-hidden rounded-xl shadow-lg bg-gray-100 border-1 border-gray-100 p-0">
			<div className="relative">
				<img
					src={shop.bannerImage as string}
					alt="Shop Banner"
					className="w-full h-48 object-cover"
				/>
				<Button
					onClick={() => handleVisitProfile(shop.shopId as string)}
					className="absolute left-0 bottom-0 rounded-b-none rounded-tl-none py-2 px-4 text-white font-medium hover:bg-[var(--darkblue-hover)] bg-[var(--darkblue)]">
					Visit Profile
				</Button>

				{role === "client" && (
					<Button
						// onClick={() => handleBookNow(shop.shopId as string)}
						className="absolute right-0 bottom-0 rounded-b-none  rounded-tr-none py-2 px-4 text-white font-medium flex items-center gap-1 hover:bg-[var(--yellow-hover)] bg-[var(--yellow)]">
						Book Now <Calendar size={16} />
					</Button>
				)}
				{role === "barber" && !isOwner && (
					<Button
						onClick={() => handleBookNow(shop.shopId as string)}
						className="absolute right-0 bottom-0 rounded-b-none  rounded-tr-none py-2 px-4 text-white font-medium flex items-center gap-1 hover:bg-[var(--yellow-hover)] bg-[var(--yellow)]">
						Join Now <Calendar size={16} />
					</Button>
				)}
				{role === "barber" && isOwner && (
					<Button
						onClick={() => handleBookNow(shop.shopId as string)}
						className="absolute right-0 bottom-0 rounded-b-none  rounded-tr-none py-2 px-4 text-white font-medium flex items-center gap-1 hover:bg-[var(--yellow-hover)] bg-[var(--yellow)]">
						Edit Shop <Pen size={16} />
					</Button>
				)}
			</div>

			<CardContent className="pt-1 pb-4 px-6">
				<div className="flex items-center gap-4 mb-3">
					<img
						src={shop.logoImage as string}
						alt="Shop Logo"
						className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover flex-shrink-0"
					/>
					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-center">
							<CardTitle className="text-xl font-bold text-black truncate">
								{shop.name}
							</CardTitle>
						</div>
						<p className="text-sm text-gray-500 font-semibold mt-1 truncate">
							<Person className="h-1 w-1" />
							{shop.ownerName}
						</p>
					</div>
				</div>

				<p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
					{shop.description}
				</p>

				<div className="grid grid-cols-2 gap-2 mb-3 bg-white rounded-lg p-2 shadow-sm">
					<div className="flex items-center text-sm text-gray-600">
						<MapPin
							size={16}
							className="mr-2 text-indigo-400 flex-shrink-0"
						/>
						<span className="truncate">
							{shop.address.city}, {shop.address.state}
						</span>
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<Clock
							size={16}
							className="mr-2 text-indigo-400 flex-shrink-0"
						/>
						<span className="truncate">
							{shop.openingTime} - {shop.closingTime}
						</span>
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<Mail
							size={16}
							className="mr-2 text-indigo-400 flex-shrink-0"
						/>
						<span className="truncate">{shop.email}</span>
					</div>
					<div className="flex items-center text-sm text-gray-600">
						<Phone
							size={16}
							className="mr-2 text-indigo-400 flex-shrink-0"
						/>
						<span className="truncate">{shop.contactNumber}</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 mb-4">
					{shop.amenities.wifi && (
						<Badge
							variant="outline"
							className="bg-indigo-100 text-indigo-700 border-indigo-200">
							<Wifi size={14} className="mr-1" /> WiFi
						</Badge>
					)}
					{shop.amenities.parking && (
						<Badge
							variant="outline"
							className="bg-indigo-100 text-indigo-700 border-indigo-200">
							<ParkingCircle size={14} className="mr-1" /> Parking
						</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
