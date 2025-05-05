import * as Yup from "yup";

export const hairstyleSchema = Yup.object({
  name: Yup.string().required("Please enter a hairstyle name"),
  gender: Yup.string().oneOf(["male", "female"]).required("Gender is required"),
  faceShapes: Yup.array().min(1, "Please select at least one face shape"),
});
