import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AnimatePresence, motion } from "framer-motion";
import { IHairstyle } from "@/types/Hairstyle";
import { HairStyleDetectionTool } from "@/components/barber/aiTool/HairStyleDetectionTool";
import { HairstyleCarousel } from "@/components/barber/aiTool/HairstyleCarousel";
import { useToaster } from "@/hooks/ui/useToaster";
import { useFaceShapeDetection } from "@/hooks/barber/useHairStyle";
import { getBarberHairstyles } from "@/services/barber/barberService";

export const AiHairstyleSuggestionToolPage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [faceShape, setFaceShape] = useState<string | null>(null);
  const [isFetchingStyles, setIsFetchingStyles] = useState(false);
  const [hairstyles, setHairstyles] = useState<IHairstyle[]>([]);

  const { successToast, errorToast } = useToaster();

  const { mutate: barberDetectFaceShape, isPending: isAnalyzing } =
    useFaceShapeDetection();

  const handleDetectFaceShape = (imageFile: File) => {
    return new Promise<string>((resolve, reject) => {
      barberDetectFaceShape(imageFile, {
        onSuccess: (data) => {
          setFaceShape(data.faceShape);
          console.log("Detected Face Shape:", data);
          successToast("Face shape detected successfully");
          resolve(data.faceShape);
        },
        onError: (error) => {
          console.error(error);
          reject("Failed to detect face shape");
        },
      });
    });
  };

  const formik = useFormik({
    initialValues: {
      gender: "male",
    },
    validationSchema: Yup.object({
      gender: Yup.string()
        .oneOf(["male", "female"])
        .required("Gender is required"),
    }),
    onSubmit: async () => {
      if (!imageFile) {
        errorToast("Please upload an image");
        return;
      }

      try {
        const detectedFaceShape = await handleDetectFaceShape(imageFile);

        if (!detectedFaceShape) {
          errorToast("Failed to detect face shape");
          return;
        }

        await handleFaceShapeDetected(detectedFaceShape);
      } catch (error: any) {
        console.error("Error in face shape detection:", error);
        errorToast(
          error.message || "An error occurred during face shape detection"
        );
      }
    },
  });

  const handleFaceShapeDetected = async (detectedFaceShape: string) => {
    try {
      setIsFetchingStyles(true);
      const data = await getBarberHairstyles({
        gender: formik.values.gender,
        faceShape: detectedFaceShape,
      });
      console.log("Fetched Hairstyles:", data);
      setHairstyles(data?.hairstyles || []);
    } catch (error: any) {
      console.error("Error fetching hairstyles:", error);
      errorToast(
        error.message || "An error occurred while fetching hairstyles"
      );
    } finally {
      setIsFetchingStyles(false);
    }
  };

  const detectFaceShape = (imageFile: File) => {
    setImageFile(imageFile);
    formik.submitForm();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="barber-ai-tool-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mt-10"
      >
        <HairStyleDetectionTool
          faceShape={faceShape}
          hairstyles={hairstyles}
          detectFaceShape={detectFaceShape}
          setFaceShape={setFaceShape}
          setHairstyles={setHairstyles}
          formik={formik}
          isAnalyzing={isAnalyzing}
          isFetchingStyles={isFetchingStyles}
        />
      </motion.div>
    </AnimatePresence>
  );
};
