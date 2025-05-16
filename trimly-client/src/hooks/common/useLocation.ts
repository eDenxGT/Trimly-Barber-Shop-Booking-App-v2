import { useState, useCallback, useEffect } from "react";

interface LocationData {
	osm_id: number;
	name: string;
	displayName: string;
	zipCode: string;
	latitude: number | null;
	longitude: number | null;
}

const useLocation = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [suggestions, setSuggestions] = useState<LocationData[]>([]);
	const [loading, setLoading] = useState(false);
	const [geoLoading, setGeoLoading] = useState(false);
	const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedTerm(searchTerm);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	useEffect(() => {
		if (debouncedTerm.length >= 1) {
			fetchLocations(debouncedTerm);
		} else {
			setSuggestions([]);
		}
	}, [debouncedTerm]);

	const fetchLocations = useCallback(async (query: string) => {
		if (query.length < 1) return;
		setLoading(true);
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					query
				)}&addressdetails=1&limit=8`
			);
			if (!response.ok) throw new Error("Network error");

			const data = await response.json();
			const formattedSuggestions = data.map((place: any) => {
				const address = place.address || {};
				const locationParts = [
					address.city ||
						address.town ||
						address.village ||
						address.municipality,
					address.county,
					address.state,
					address.country,
				].filter(Boolean);

				return {
					osm_id: place.osm_id,
					name: place.display_name.split(",")[0] || place.name || "",
					displayName: locationParts.join(", "),
					zipCode: address.postcode || "",
					latitude: parseFloat(place.lat) || null,
					longitude: parseFloat(place.lon) || null,
				};
			});
			setSuggestions(formattedSuggestions);
		} catch (error) {
			console.error("Error fetching locations:", error);
			setSuggestions([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const getCurrentLocation = useCallback(
		() =>
			new Promise<LocationData | null>((resolve) => {
				if (!navigator.geolocation) {
					console.error("Geolocation not supported");
					resolve(null);
					return;
				}
				setGeoLoading(true);
				navigator.geolocation.getCurrentPosition(
					async ({ coords }) => {
						try {
							const response = await fetch(
								`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`
							);
							if (!response.ok)
								throw new Error("Failed to fetch location");

							const data = await response.json();
							const address = data.address || {};
							const locationParts = [
								address.city ||
									address.town ||
									address.village ||
									address.municipality,
								address.county,
								address.state,
								address.country,
							].filter(Boolean);

							const location: LocationData = {
								osm_id: address.osm_id,
								name:
									data.display_name.split(",")[0] ||
									`${coords.latitude}, ${coords.longitude}`,
								displayName: locationParts.join(", "),
								zipCode: address.postcode || "",
								latitude: coords.latitude,
								longitude: coords.longitude,
							};
							setSearchTerm(location.displayName);
							resolve(location);
						} catch (error) {
							console.error(
								"Error fetching reverse geolocation:",
								error
							);
							resolve(null);
						} finally {
							setGeoLoading(false);
						}
					},
					(error) => {
						console.error("Geolocation error:", error.message);
						setGeoLoading(false);
						resolve(null);
					},
					{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
				);
			}),
		[]
	);

	const clearSearch = useCallback(() => {
		setSearchTerm("");
		setSuggestions([]);
	}, []);

	return {
		searchTerm,
		setSearchTerm,
		suggestions,
		loading,
		geoLoading,
		getCurrentLocation,
		clearSearch,
	};
};

export default useLocation;
