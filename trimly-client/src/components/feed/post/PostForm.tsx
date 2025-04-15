import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image, X } from "lucide-react";
import { useFormik } from "formik";
import { useToaster } from "@/hooks/ui/useToaster";
import { IPost } from "@/types/Feed";
import MuiButton from "@/components/common/buttons/MuiButton";
import { uploadImageToCloudinary } from "@/services/cloudinary/cloudinary";
import { PostSchema } from "@/utils/validations/add-post.validator";
import MuiAnimatedButton from "@/components/common/buttons/AnimatedButton";

interface PostFormProps {
  post?: IPost;
  onSubmit: (values: {
    caption: string;
    description: string;
    image: string;
    postId?: string;
  }) => void;
  isSubmitting: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  post,
  onSubmit,
  isSubmitting = true,
}) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const { infoToast } = useToaster();
  const imageFileRef = useRef<File | null>(null);
  const navigate = useNavigate();

  const initialValues = {
    caption: post?.caption || "",
    description: post?.description || "",
    image: post?.image || "",
  };

  useEffect(() => {
    if (post?.image) {
      setImagePreview(post.image);
    }
  }, [post]);

  const formik = useFormik({
    initialValues,
    validationSchema: PostSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        let imageUrl: string | null = null;

        if (imageFileRef.current) {
          setIsImageUploading(true);
          imageUrl = await uploadImageToCloudinary(
            imageFileRef.current as File
          );
          setIsImageUploading(false);
        }

        const submitData: IPost = {
          caption: values.caption,
          description: values.description,
          image: imageUrl || values.image,
        };

        if (post?.postId) {
          submitData.postId = post.postId;
        }

        onSubmit(submitData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsImageUploading(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      infoToast("Invalid file type, Please upload a JPEG, PNG, or WebP image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      infoToast("File too large, Image size should be less than 5MB");
      return;
    }

    imageFileRef.current = file;
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    formik.setFieldValue("image", file);
  };

  const handleCancel = () => {
    navigate("/barber/my-posts");
  };

  const clearImage = () => {
    setImagePreview("");
    imageFileRef.current = null;
    formik.setFieldValue("image", "");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-gray-400">
      <CardHeader className="flex justify-center items-center">
        <MuiAnimatedButton
          variant="darkblue"
          className="h-7 w-12"
          onClick={handleCancel}
          disabled={isSubmitting || isImageUploading}
        >
          <ArrowLeft className="h-4 w-4" />
        </MuiAnimatedButton>
        <CardTitle className="text-center text-2xl font-bold">
          {post ? "Edit Post" : "Create New Post"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-base font-medium">
              Caption <span className="text-red-500">*</span>
            </Label>
            <Input
              id="caption"
              name="caption"
              className={`h-12 ${
                formik.errors.caption && formik.touched.caption
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Enter a catchy caption"
              value={formik.values.caption}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.caption && formik.touched.caption && (
              <p className="text-red-500 text-sm">{formik.errors.caption}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              className={`min-h-[120px] ${
                formik.errors.description && formik.touched.description
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Describe your post in detail"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.description && formik.touched.description && (
              <p className="text-red-500 text-sm">
                {formik.errors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-base font-medium">
              Image <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col gap-4">
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  formik.errors.image && formik.touched.image
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Image
                    className="h-8 w-8"
                    style={{ color: "var(--darkblue)" }}
                  />
                  <span className="text-sm text-gray-500">
                    {imagePreview ? "Change image" : "Click to upload an image"}
                  </span>
                  <span className="text-xs text-gray-400">
                    (JPEG, PNG, or WebP, max 5MB)
                  </span>
                </label>
              </div>

              {imagePreview && (
                <div className="relative mt-2 border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {formik.errors.image && formik.touched.image && (
              <p className="text-red-500 text-sm">
                {String(formik.errors.image)}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap mt-4 justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="btn-outline"
            disabled={isSubmitting || isImageUploading}
          >
            Cancel
          </Button>
          <MuiButton
            type="submit"
            disabled={isSubmitting || isImageUploading}
            loading={isSubmitting || isImageUploading}
          >
            <span className="flex items-center gap-2">
              {post ? "Update Post" : "Create Post"}
            </span>
          </MuiButton>
        </CardFooter>
      </form>
    </Card>
  );
};
