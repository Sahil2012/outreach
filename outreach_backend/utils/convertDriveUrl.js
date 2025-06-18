function convertGoogleDriveUrl(viewUrl) {
  const match = viewUrl.match(/\/file\/d\/([^\/]+)(?:\/|$)/);
  
  if (!match) throw new Error("Invalid Google Drive URL");
  return `https://drive.google.com/uc?id=${match[1]}&export=download`;
}

export default convertGoogleDriveUrl;
