const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

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

export const handlePostShare = async (postId: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check this post on Trimly!",
        text: "Look at this cool haircut!",
        url: `${frontendUrl}/feed/post/${postId}`,
      });
    } catch (error) {
      console.error("Sharing failed:", error);
    }
  } else {
    navigator.clipboard.writeText(`${frontendUrl}/feed/post/${postId}`);
    alert("Link copied to clipboard!");
  }
};
