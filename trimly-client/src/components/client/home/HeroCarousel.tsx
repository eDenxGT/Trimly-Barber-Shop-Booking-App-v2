import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  {
    src: "https://img.freepik.com/premium-photo/excellent-barber-cutting-hair-his-satisfied-client-generative-by-ai_894067-13888.jpg",
    alt: "Barber cutting hair",
  },
  {
    src: "https://wallpapercave.com/wp/wp9441714.jpg",
    alt: "Barber shop interior",
  },
  {
    src: "https://img.freepik.com/free-photo/client-doing-hair-cut-barber-shop-salon_1303-20719.jpg?w=740&t=st=1696372712~exp=1696373312~hmac=89108b99c3ac8c0d7add150b7daf573ed747db60bbcf75ae4b25ad8da6819329",
    alt: "Beard trimming",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isTransitioning]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            className="object-cover object-center transform transition-transform duration-10000 ease-in-out scale-105 w-full h-full"
          />
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isTransitioning) return;
              setIsTransitioning(true);
              setCurrentSlide(index);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-[#feba43]"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
