export async function uploadToS3(presignedUrl: string, file: File) {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`S3 Upload failed with status: ${res.status}`);
  }
}
