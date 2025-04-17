import { useState, useEffect, useCallback } from "react";
import { useNearestBarberShopsQuery } from "@/hooks/client/useNearestBarberShops";
import { getAllNearestBarberShops } from "@/services/client/clientService";
import { ClientShopListing } from "@/components/client/shop/ClientShopListing";
import { AnimatePresence, motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { IClient } from "@/types/User";

const ShopListingPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [amenities, setAmenities] = useState<string[]>([]);
	const [sortRules, setSortRules] = useState([
		{ sortBy: "", sortOrder: "" },
	]);
	const [activeFilters, setActiveFilters] = useState<string[]>([]);
	const user = useOutletContext<IClient>();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isError,
		refetch,
	} = useNearestBarberShopsQuery(getAllNearestBarberShops, {
		search: searchTerm,
		userLocation: user.location?.coordinates || [],
		amenities,
		sortBy: sortRules[0].sortBy,
		sortOrder: sortRules[0].sortOrder,
		limit: 3,
	});

	const shops = data ? data.pages.flatMap((page) => page) : [];
	useEffect(() => {
		const newFilters: string[] = [];

		if (searchTerm) {
			newFilters.push(`Search: ${searchTerm}`);
		}

		amenities.forEach((amenity) => {
			newFilters.push(`Amenity: ${amenity}`);
		});

		if (sortRules.length > 0) {
			const { sortBy, sortOrder } = sortRules[0];
			let sortLabel = "";

			if (sortBy === "rating" && sortOrder === "desc") {
				sortLabel = "Highest rated";
			} else if (sortBy === "rating" && sortOrder === "asc") {
				sortLabel = "Lowest rated";
			}

			if (sortLabel) {
				newFilters.push(`Sort: ${sortLabel}`);
			}
		}

		setActiveFilters(newFilters);
	}, [searchTerm, amenities, sortRules]);

	const handleSearch = useCallback((value: string) => {
		setSearchTerm(value);
	}, []);

	const handleSortChange = useCallback((value: string) => {
		const [sortBy, sortOrder] = value.split("-");
		setSortRules([{ sortBy, sortOrder }]);
	}, []);

	const handleAmenityChange = useCallback(
		(amenity: string, checked: boolean) => {
			setAmenities((prev) => {
				return checked
					? [...prev, amenity]
					: prev.filter((item) => item !== amenity);
			});
		},
		[]
	);

	const removeFilter = useCallback((filter: string) => {
		if (filter.startsWith("Search:")) {
			setSearchTerm("");
		} else if (filter.startsWith("Amenity:")) {
			const amenity = filter.split(": ")[1];
			setAmenities((prev) => prev.filter((item) => item !== amenity));
		} else if (filter.startsWith("Sort:")) {
			setSortRules([{ sortBy: "", sortOrder: "" }]);
		}
	}, []);

	const clearAllFilters = useCallback(() => {
		setSearchTerm("");
		setAmenities([]);
		setSortRules([{ sortBy: "", sortOrder: "" }]);
		refetch();
	}, [refetch]);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={"client-shop-listing"}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.5 }}
				className="p-4 mt-16">
				<ClientShopListing
					refetch={refetch}
					searchParams={searchTerm}
					shops={shops}
					onSearch={handleSearch}
					handleAmenityChange={handleAmenityChange}
					handleSortChange={handleSortChange}
					activeFilters={activeFilters}
					removeFilter={removeFilter}
					clearAllFilters={clearAllFilters}
					hasNextPage={hasNextPage}
					fetchNextPage={fetchNextPage}
					isFetching={isFetchingNextPage}
					isError={isError}
				/>
			</motion.div>
		</AnimatePresence>
	);
};

export default ShopListingPage;
