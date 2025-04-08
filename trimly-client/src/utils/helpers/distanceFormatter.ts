export function formatDistance(distanceInMeters?: number | null): string {
	if (distanceInMeters === undefined || distanceInMeters === null) {
		return "N/A";
	}

	if (distanceInMeters < 1000) {
		return `${Math.round(distanceInMeters)} m`;
	} else {
		return `${(distanceInMeters / 1000).toFixed(1)} km`;
	}
}
