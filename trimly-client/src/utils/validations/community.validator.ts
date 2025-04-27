import * as Yup from "yup";

export const addCommunitySchema = Yup.object({
  name: Yup.string()
    .required("Community name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  description: Yup.string().max(
    200,
    "Description must be less than 200 characters"
  ),
  imageUrl: Yup.string().url("Must be a valid URL").nullable(),
});