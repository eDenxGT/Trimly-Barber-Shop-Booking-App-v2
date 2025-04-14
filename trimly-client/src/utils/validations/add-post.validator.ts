import * as Yup from "yup";

export const PostSchema = Yup.object().shape({
  caption: Yup.string().required("Caption is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().required("Image is required"),
});
