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
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { ICommunityChat } from "@/types/Chat";
import { generateUniqueId } from "@/utils/helpers/generateUniqueId";
import { ImageUploadField } from "@/components/common/fields/ImageUploadField";
import { useCallback, useRef } from "react";
import { addCommunitySchema } from "@/utils/validations/community.validator";
import MuiButton from "@/components/common/buttons/MuiButton";
import { uploadImageToCloudinary } from "@/services/cloudinary/cloudinary";
import { useToaster } from "@/hooks/ui/useToaster";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CommunityCreationFormProps {
  onSubmit: (values: Partial<ICommunityChat>) => void;
  isLoading: boolean;
  initialData?: Partial<ICommunityChat>;
  formType: "create" | "edit";
}

export const CommunityForm = ({
  onSubmit,
  isLoading,
  initialData,
  formType,
}: CommunityCreationFormProps) => {
  const imageRef = useRef<Blob | null>(null);
  const navigate = useNavigate();

  const { errorToast } = useToaster();

  const formik = useFormik({
    initialValues: {
      name: formType === "edit" ? initialData?.name || "" : "",
      description: formType === "edit" ? initialData?.description || "" : "",
      imageUrl: formType === "edit" ? initialData?.imageUrl || "" : "",
    },
    validationSchema: addCommunitySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (formType === "create" && !imageRef.current) {
          errorToast("Image is required");
          return;
        }

        isLoading = true;

        let finalImageUrl = values.imageUrl;

        if (imageRef.current) {
          const uploadedImageUrl = await uploadImageToCloudinary(
            imageRef.current
          );
          if (!uploadedImageUrl) {
            errorToast("Image upload failed");
            return;
          }
          finalImageUrl = uploadedImageUrl;
        }

        const newCommunity: Partial<ICommunityChat> = {
          ...(formType === "create"
            ? {
                communityId: generateUniqueId("community"),
                createdAt: new Date(),
              }
            : { communityId: initialData?.communityId }),
          name: values.name,
          description: values.description || undefined,
          imageUrl: finalImageUrl || undefined,
        };

        onSubmit(newCommunity);
      } catch (err) {
        console.error(err);
        errorToast("Something went wrong during submission");
      } finally {
        isLoading = false;
      }
    },
  });

  const handleImageChange = useCallback((file: Blob | null) => {
    imageRef.current = file;
  }, []);

  const isEdit = formType === "edit";

  return (
    <Card className="w-full max-w-lg mx-auto bg-white shadow-lg animate-fade-in">
      <CardHeader className="space-y-1 bg-gradient-to-r from-yellow/10 to-yellow/5 rounded-t-lg">
        <h2 className="text-2xl font-semibold text-zinc-800">
          <Button
            className="bg-gray-100 hover:bg-gray-200 text-black mr-2 rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {isEdit ? "Edit Community" : "Create New Community"}
        </h2>
        <p className="text-sm text-zinc-600">
          {isEdit
            ? "Update your community details"
            : "Connect with other barbers in your community"}
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
              handleRemove={() => formik.setFieldValue("imageUrl", null)}
              onImageChange={handleImageChange}
              initialImage={formik.values.imageUrl}
              aspectRatio="square"
              label="Upload Community Picture"
              maxSizeMB={5}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4 bg-zinc-50/50 rounded-b-lg">
          <MuiButton
            type="submit"
            loading={isLoading || formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting || isLoading}
          >
            {isEdit ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Update Community
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Community
              </>
            )}
          </MuiButton>
        </CardFooter>
      </form>
    </Card>
  );
};
