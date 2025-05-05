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

        {faceShape && !isAnalyzing && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2
                className="text-2xl font-semibold mb-2"
                style={{ color: "var(--darkblue)" }}
              >
                Your Result
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="px-4 py-2 rounded-full text-lg font-bold"
                  style={{ backgroundColor: "var(--yellow)", color: "white" }}
                >
                  {faceShape} Face
                </div>
              </div>

              <p className="text-gray-600">
                Based on your face shape, we've selected some{" "}
                {formik.values.gender} hairstyles that would complement your
                features perfectly.
              </p>
            </div>

            <HairstyleCarousel
              hairstyles={hairstyles}
              isLoading={isFetchingStyles}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
