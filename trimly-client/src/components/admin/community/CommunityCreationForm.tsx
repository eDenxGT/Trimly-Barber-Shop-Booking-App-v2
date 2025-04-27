import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { ICommunityChat } from "@/types/Chat";
import { generateUniqueId } from "@/utils/helpers/generateUniqueId";
import { ImageUploadField } from "@/components/common/fields/ImageUploadField";
import { useCallback, useRef } from "react";
import { addCommunitySchema } from "@/utils/validations/community.validator";
import MuiButton from "@/components/common/buttons/MuiButton";
import { uploadImageToCloudinary } from "@/services/cloudinary/cloudinary";
import { useToaster } from "@/hooks/ui/useToaster";

interface CommunityCreationFormProps {
  onSubmit: (values: Partial<ICommunityChat>) => void;
  isLoading: boolean;
}

export const CommunityCreationForm = ({
  onSubmit,
  isLoading,
}: CommunityCreationFormProps) => {
  const imageRef = useRef<Blob | null>(null);

  const { errorToast } = useToaster();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
    validationSchema: addCommunitySchema,
    onSubmit: async (values) => {
      if (!imageRef.current) {
        errorToast("Image is required");
        return;
      }
      isLoading = true;
      const uploadedAvatarUrl = await uploadImageToCloudinary(imageRef.current);
      if (!uploadedAvatarUrl) {
        errorToast("Image upload failed");
        return;
      }
      isLoading = false;

      const newCommunity: Partial<ICommunityChat> = {
        communityId: generateUniqueId("community"),
        name: values.name,
        description: values.description || undefined,
        imageUrl: uploadedAvatarUrl || undefined,
        createdAt: new Date(),
      };
      onSubmit(newCommunity);
    },
  });

  const handleImageChange = useCallback((file: Blob | null) => {
    imageRef.current = file;
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto bg-white shadow-lg animate-fade-in">
      <CardHeader className="space-y-1 bg-gradient-to-r from-yellow/10 to-yellow/5 rounded-t-lg">
        <h2 className="text-2xl font-semibold text-zinc-800">
          Create New Community
        </h2>
        <p className="text-sm text-zinc-600">
          Connect with other barbers in your community
        </p>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
              Community Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter community name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`transition-all duration-200 focus:ring-yellow focus:border-yellow
                ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-zinc-200"
                }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-zinc-700"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your community..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className="min-h-[100px] transition-all duration-200 focus:ring-yellow focus:border-yellow"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">
                {formik.errors.description}
              </p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Community Picture</h3>
            <ImageUploadField
              handleRemove={() => formik.setFieldValue("avatar", null)}
              onImageChange={handleImageChange}
              aspectRatio="square"
              label="Upload Community Picture"
              maxSizeMB={5}
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              Image size should be under 1MB and image ratio needs to be 1:1
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4 bg-zinc-50/50 rounded-b-lg">
          <MuiButton
            type="submit"
            loading={isLoading}
            disabled={!formik.isValid || formik.isSubmitting || isLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Community
          </MuiButton>
        </CardFooter>
      </form>
    </Card>
  );
};
