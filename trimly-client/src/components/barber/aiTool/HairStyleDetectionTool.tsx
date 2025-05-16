import { Button } from "@/components/ui/button";
import { Camera, Loader, Upload } from "lucide-react";
import Webcam from "react-webcam";
import { RadioGroup } from "@/components/ui/radio-group";
import { useRef, useState } from "react";
import { IHairstyle } from "@/types/Hairstyle";
import { HairstyleCarousel } from "./HairstyleCarousel";
import MuiButton from "@/components/common/buttons/MuiButton";

interface HairStyleDetectionToolProps {
  faceShape: string | null;
  hairstyles: IHairstyle[];
  detectFaceShape: (imageFile: File) => void;
  setFaceShape: (faceShape: string | null) => void;
  setHairstyles: (hairstyles: IHairstyle[]) => void;
  formik: any;
  isAnalyzing: boolean;
  isFetchingStyles: boolean;
}

export const HairStyleDetectionTool: React.FC<HairStyleDetectionToolProps> = ({
  detectFaceShape,
  setFaceShape,
  setHairstyles,
  formik,
  isAnalyzing,
  hairstyles,
  faceShape,
  isFetchingStyles,
}) => {
  const webcamRef = useRef<Webcam | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);

  const resetImage = () => {
    setImage(null);
    setFaceShape(null);
    setHairstyles([]);
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);

        const byteString = atob(imageSrc.split(",")[1]);
        const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], "captured-image.jpg", {
          type: mimeString,
        });

        imageFileRef.current = file;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageFileRef.current = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-darkblue">
            Select Gender
          </h2>

          <RadioGroup
            value={formik.values.gender}
            onValueChange={(value) => formik.setFieldValue("gender", value)}
            className="flex gap-6 mb-6"
          >
            {[
              { id: "male", label: "Male", value: "male" },
              { id: "female", label: "Female", value: "female" },
            ].map(({ id, label, value }) => (
              <div key={id}>
                <input
                  type="radio"
                  name="gender"
                  id={id}
                  value={value}
                  checked={formik.values.gender === value}
                  onChange={() => formik.setFieldValue("gender", value)}
                  className="peer hidden"
                />
                <label
                  htmlFor={id}
                  className="cursor-pointer px-6 py-3 rounded-xl border-2 border-gray-300 peer-checked:border-yellow-600 peer-checked:bg-yellow-100 peer-checked:text-yellow-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  {label}
                </label>
              </div>
            ))}
          </RadioGroup>

          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--darkblue)" }}
          >
            Capture or Upload a Photo
          </h2>

          {!image ? (
            <div className="space-y-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={captureImage}
                  className="btn-primary flex items-center bg-[var(--yellow)] hover:bg-[var(--yellow-hover)] justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Take Picture
                </Button>

                <Button
                  onClick={triggerFileInput}
                  variant="outline"
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload from Gallery
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={image}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={resetImage}
                  variant="outline"
                  className="btn-outline"
                >
                  Try Another Photo
                </Button>
                <MuiButton
                  onClick={() => detectFaceShape(imageFileRef.current!)}
                  disabled={isAnalyzing || isFetchingStyles}
                  loading={isAnalyzing || isFetchingStyles}
                  variant="yellow"
                  className="btn-primary bg-[var(--yellow)] hover:bg-[var(--yellow-hover)]"
                >
                  Analyze
                </MuiButton>
              </div>
            </div>
          )}
        </div>

        {isAnalyzing ||
          (isFetchingStyles && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <Loader
                  className="w-12 h-12 animate-spin mb-4"
                  style={{ color: "var(--yellow)" }}
                />
                <p className="text-xl">
                  {" "}
                  {isAnalyzing
                    ? "Analyzing your face shape..."
                    : "Fetching Hairstyles..."}
                </p>
              </div>
            </div>
          ))}

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
      </div>
    </div>
  );
};
