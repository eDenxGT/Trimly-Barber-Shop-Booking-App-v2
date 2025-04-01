export const handleShare = async () => {
	try {
		if (!navigator.share) {
			await navigator.clipboard.writeText(window.location.href);
			alert("Link copied to clipboard! You can share it manually.");
			return;
		}

		await navigator.share({
			text: `Check out this`,
			url: window.location.href,
		});
	} catch (error: any) {
		if (error.name !== "AbortError") {
			console.error("Error sharing:", error);
			alert("Failed to share. Please try again.");
		}
	}
};
