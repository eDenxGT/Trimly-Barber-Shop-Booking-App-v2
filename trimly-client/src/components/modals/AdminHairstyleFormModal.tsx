import { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MuiButton from "@/components/common/buttons/MuiButton";
import { Upload, Scissors, X, Edit } from "lucide-react";
import { hairstyleSchema } from "@/utils/validations/add-hairstyle.validator";
import { useFormik } from "formik";
import { useToaster } from "@/hooks/ui/useToaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddHairstyleMutation,
  useUpdateHairstyleMutation,
} from "@/hooks/hairstyle-detector/useHairstyleMutation";
import { uploadImageToCloudinary } from "../../services/cloudinary/cloudinary";
import { IHairstyle } from "@/types/Hairstyle";

interface IFaceShape {
  id: string;
  label: string;
}

interface HairstyleFormModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  hairstyleData?: IHairstyle;
}

const faceShapes: IFaceShape[] = [
  { id: "oval", label: "Oval" },
  { id: "round", label: "Round" },
  { id: "square", label: "Square" },
  { id: "heart", label: "Heart" },
];

export const HairstyleFormModal = ({
  isModalOpen,
  onClose,
  onSuccess,
  hairstyleData,
}: HairstyleFormModalProps) => {
  const isEditMode = !!hairstyleData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);
  const imageChanged = useRef<boolean>(false);
  const { successToast, errorToast } = useToaster();
  const [selectedFaceShape, setSelectedFaceShape] = useState("");

  const { mutateAsync: addHairstyleMutation } = useAddHairstyleMutation();
  const { mutateAsync: updateHairstyleMutation } = useUpdateHairstyleMutation();

  useEffect(() => {
    if (hairstyleData) {
      formik.setValues({
        name: hairstyleData.name || "",
        gender: hairstyleData.gender || "male",
        faceShapes: hairstyleData.faceShapes || [],
      });
      setPreview(hairstyleData.image || null);
    }
  }, [hairstyleData]);

  const handleSubmit = async (values: any) => {
    if (!isEditMode && !imageFileRef.current) {
      errorToast("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = hairstyleData?.image || "";

      if (imageFileRef.current && (imageChanged.current || !isEditMode)) {
        const uploadedUrl = await uploadImageToCloudinary(imageFileRef.current);
        if (!uploadedUrl) {
          errorToast("Failed to upload image");
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const hairstylePayload = {
        name: values.name,
        gender: values.gender as "male" | "female",
        faceShapes: values.faceShapes,
        image: imageUrl,
      };

      if (isEditMode && hairstyleData?.hairstyleId) {
        await updateHairstyleMutation(
          {
            hairstyleId: hairstyleData.hairstyleId,
            ...hairstylePayload,
          },
          {
            onSuccess: () => {
              successToast("Hairstyle updated successfully!");
            },
            onError: (error: any) => {
              errorToast(
                error?.response?.data?.message ||
                  "Operation failed. Please try again."
              );
            },
          }
        );
      } else {
        await addHairstyleMutation(hairstylePayload, {
          onSuccess: () => {
            successToast("Hairstyle added successfully!");
          },
          onError: (error: any) => {
            errorToast(
              error?.response?.data?.message ||
                "Operation failed. Please try again."
            );
          },
        });
      }

      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error handling hairstyle:", error);
      errorToast(
        error?.response?.data?.message || "Operation failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "male",
      faceShapes: [] as string[],
    },
    validationSchema: hairstyleSchema,
    onSubmit: handleSubmit,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageFileRef.current = file;
      imageChanged.current = true;
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setPreview(imageData as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFaceShape = () => {
    if (
      selectedFaceShape &&
      !formik.values.faceShapes.includes(selectedFaceShape)
    ) {
      formik.setFieldValue("faceShapes", [
        ...formik.values.faceShapes,
        selectedFaceShape,
      ]);
      setSelectedFaceShape("");
    }
  };

  const handleRemoveFaceShape = (shape: string) => {
    formik.setFieldValue(
      "faceShapes",
      formik.values.faceShapes.filter((s) => s !== shape)
    );
  };

  const handleClose = () => {
    formik.resetForm();
    setPreview(null);
    setSelectedFaceShape("");
    imageFileRef.current = null;
    imageChanged.current = false;
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-darkblue flex items-center">
            {isEditMode ? (
              <>
                <Edit className="h-5 w-5 mr-2" />
                Edit Hairstyle
              </>
            ) : (
              <>
                <Scissors className="h-5 w-5 mr-2" />
                Add New Hairstyle
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the hairstyle details"
              : "Fill in the details to add a new hairstyle to the catalog"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column - Basic details */}
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Hairstyle Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter hairstyle name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  className="border-gray-300 focus:border-yellow focus:ring-yellow transition-all"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Gender</Label>
                <RadioGroup
                  name="gender"
                  value={formik.values.gender}
                  onValueChange={(value) =>
                    formik.setFieldValue("gender", value)
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Face Shapes - Enhanced UI */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Recommended Face Shapes
                </Label>
                <div className="flex flex-wrap gap-2 mb-2 min-h-12">
                  {formik.values.faceShapes.length > 0 ? (
                    formik.values.faceShapes.map((shape) => {
                      const shapeObj = faceShapes.find((s) => s.id === shape);
                      return (
                        <div
                          key={shape}
                          className="flex items-center bg-yellow/10 text-sm text-darkblue px-3 py-1 rounded-full border border-yellow/30"
                        >
                          <span>{shapeObj?.label}</span>
                          <X
                            className="h-4 w-4 ml-2 text-darkblue hover:text-red-500 cursor-pointer"
                            onClick={() => handleRemoveFaceShape(shape)}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No face shapes selected
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Select
                    value={selectedFaceShape}
                    onValueChange={setSelectedFaceShape}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select face shape" />
                    </SelectTrigger>
                    <SelectContent>
                      {faceShapes
                        .filter(
                          (shape: IFaceShape) =>
                            !formik.values.faceShapes.includes(shape.id)
                        )
                        .map((shape: IFaceShape) => (
                          <SelectItem key={shape.id} value={shape.id}>
                            {shape.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <MuiButton
                    type="button"
                    variant="outlined"
                    onClick={handleAddFaceShape}
                    disabled={!selectedFaceShape}
                    className="border-2 whitespace-nowrap"
                  >
                    Add
                  </MuiButton>
                </div>
                {formik.touched.faceShapes && formik.errors.faceShapes && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.faceShapes}
                  </p>
                )}
              </div>
            </div>

            {/* Right column - Image upload and preview */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Hairstyle Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {preview ? (
                  <div className="space-y-4">
                    <div className="relative w-60 h-60 mx-auto overflow-hidden rounded-lg shadow-md">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Label
                      htmlFor="image"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md cursor-pointer inline-flex items-center gap-2 transition-colors"
                    >
                      <Upload size={16} />
                      Change Image
                    </Label>
                  </div>
                ) : (
                  <Label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center h-40 cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-gray-500 font-medium">
                      Click to upload image
                    </span>
                    <span className="text-gray-400 text-sm mt-1">
                      SVG, PNG, JPG or WEBP (max 5MB)
                    </span>
                  </Label>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-4 pt-2">
            <MuiButton
              type="button"
              variant="outlined"
              onClick={handleClose}
              className="border-2"
            >
              Cancel
            </MuiButton>
            <MuiButton
              type="submit"
              loading={isSubmitting}
              disabled={
                isSubmitting ||
                !formik.isValid ||
                (!isEditMode && imageFileRef.current === null)
              }
              variant="darkblue"
            >
              {isEditMode ? "Update" : "Add"}
            </MuiButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
