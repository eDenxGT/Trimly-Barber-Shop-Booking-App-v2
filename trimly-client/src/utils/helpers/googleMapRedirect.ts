export const openInGoogleMap = (latitude?: number, longitude?: number) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  window.open(url, "_blank");
};
