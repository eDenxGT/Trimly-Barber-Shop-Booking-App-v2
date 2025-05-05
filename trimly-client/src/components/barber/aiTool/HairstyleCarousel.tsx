import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IHairstyle } from "@/types/Hairstyle";

interface HairstyleCarouselProps {
  hairstyles: IHairstyle[];
  isLoading: boolean;
}

export const HairstyleCarousel: React.FC<HairstyleCarouselProps> = ({
  hairstyles,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <p>Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: "var(--darkblue)" }}
      >
        Recommended Hairstyles
      </h2>

      {hairstyles.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {hairstyles.map((style) => (
              <CarouselItem
                key={style.hairstyleId}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card className="overflow-hidden h-full">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg">{style.name}</h3>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      className="w-full btn-outline text-sm"
                      onClick={() => {
                        const query = encodeURIComponent(
                          `${style.name} hairstyles for ${style.gender}`
                        );
                        window.open(
                          `https://www.google.com/search?tbm=isch&q=${query}`,
                          "_blank"
                        );
                      }}
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
  );
};
