import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Image } from "lucide-react";
import { ICommunityChat } from "@/types/Chat";

const validationSchema = Yup.object({
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

interface CommunityCreationFormProps {
  onSubmit: (values: Partial<ICommunityChat>) => void;
  adminId: string;
}

export const CommunityCreationForm = ({
  onSubmit,
  adminId,
}: CommunityCreationFormProps) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const newCommunity: Partial<ICommunityChat> = {
        communityId: gneerate,
        name: values.name,
        description: values.description || undefined,
        imageUrl: values.imageUrl || undefined,
        createdBy: adminId,
        createdAt: new Date(),
        members: [adminId],
      };
      onSubmit(newCommunity);
    },
  });

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

          <div className="space-y-2">
            <Label
              htmlFor="imageUrl"
              className="text-sm font-medium text-zinc-700"
            >
              Community Image URL (Optional)
            </Label>
            <div className="relative">
              <Input
                id="imageUrl"
                name="imageUrl"
                type="text"
                placeholder="https://example.com/image.jpg"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.imageUrl}
                className="pl-10 transition-all duration-200 focus:ring-yellow focus:border-yellow"
              />
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <p className="text-sm text-red-500">{formik.errors.imageUrl}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4 bg-zinc-50/50 rounded-b-lg">
          <Button
            type="submit"
            className="bg-yellow hover:bg-yellow/90 text-white transition-all duration-200"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Community
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
