import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type FaceShape =
  | "Oval"
  | "Heart"
  | "Square"
  | "Round"
  | "Long"
  | "Diamond"
  | "Triangle"
  | null;

interface Hairstyle {
  id: string;
  name: string;
  image: string;
  description?: string;
  tag?: string;
  forFaceShapes: FaceShape[];
}

// Mock data for hairstyles
const hairstyles: Hairstyle[] = [
  {
    id: "1",
    name: "Classic Pompadour",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",
    description: "Timeless elegance for a sophisticated look",
    tag: "Popular",
    forFaceShapes: ["Oval", "Diamond"],
  },
  {
    id: "2",
    name: "Textured Crop",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
    description: "Modern style with natural texture",
    tag: "Trending",
    forFaceShapes: ["Round", "Square"],
  },
  {
    id: "3",
    name: "Fade with Side Part",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033",
    description: "Clean and professional",
    forFaceShapes: ["Heart", "Oval", "Triangle"],
  },
  {
    id: "4",
    name: "Long Layered",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f",
    description: "Adds volume and movement",
    forFaceShapes: ["Diamond", "Square", "Long"],
  },
  {
    id: "5",
    name: "Buzz Cut",
    image: "https://images.unsplash.com/photo-1621607149593-58de16d8b458",
    description: "Low maintenance and bold",
    tag: "Easy Care",
    forFaceShapes: ["Oval", "Square", "Diamond"],
  },
  {
    id: "6",
    name: "Slicked Back",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",
    description: "Sophisticated and sleek",
    forFaceShapes: ["Heart", "Oval", "Long"],
  },
];

export const AiHairstyleSuggestionToolPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [faceShape, setFaceShape] = useState<FaceShape>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to simulate face shape detection
  const detectFaceShape = async (imageData: string) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For demo, randomly select a face shape
    const shapes: FaceShape[] = [
      "Oval",
      "Heart",
      "Square",
      "Round",
      "Long",
      "Diamond",
      "Triangle",
    ];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

    setFaceShape(randomShape);
    setIsLoading(false);
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        detectFaceShape(imageSrc);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        detectFaceShape(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetImage = () => {
    setImage(null);
    setFaceShape(null);
  };

  // Filter hairstyles based on detected face shape
  const recommendedHairstyles = faceShape
    ? hairstyles.filter((style) => style.forFaceShapes.includes(faceShape))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl font-bold mb-4 text-center"
          style={{ color: "var(--darkblue)" }}
        >
          Face Shape Analyzer
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Discover your face shape and get personalized hairstyle
          recommendations
        </p>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
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
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader
                className="w-12 h-12 animate-spin mb-4"
                style={{ color: "var(--yellow)" }}
              />
              <p className="text-xl">Analyzing your face shape...</p>
            </div>
          </div>
        )}

        {faceShape && !isLoading && (
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
                Based on your face shape, we've selected some hairstyles that
                would complement your features perfectly.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2
                className="text-2xl font-semibold mb-6"
                style={{ color: "var(--darkblue)" }}
              >
                Recommended Hairstyles
              </h2>

              {recommendedHairstyles.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {recommendedHairstyles.map((style) => (
                      <CarouselItem
                        key={style.id}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <Card className="overflow-hidden h-full">
                          <div className="aspect-square relative overflow-hidden">
                            <img
                              src={style.image}
                              alt={style.name}
                              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                            />
                            {style.tag && (
                              <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {style.tag}
                              </span>
                            )}
                          </div>
                          <CardContent className="pt-4">
                            <h3 className="font-semibold text-lg">
                              {style.name}
                            </h3>
                            {style.description && (
                              <p className="text-gray-500 text-sm mt-1">
                                {style.description}
                              </p>
                            )}
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button
                              variant="outline"
                              className="w-full btn-outline text-sm"
                            >
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-4 mt-6">
                    <CarouselPrevious className="static transform-none mx-0" />
                    <CarouselNext className="static transform-none mx-0" />
                  </div>
                </Carousel>
              ) : (
                <p className="text-center text-gray-500 py-12">
                  No specific recommendations available for this face shape.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
