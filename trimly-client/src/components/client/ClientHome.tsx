import { Button } from "@/components/ui/button"
import BarberToolsBG from "@/assets/common/barber-tools.png";
import BarberHappy from "@/assets/common/barber-happy.png";
import { BarberShopCard } from "../common/cards/BarberShopCard";

export default function ClientHome() {
  return (
    <main className="min-h-screen">
     <section className="w-full bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 items-center gap-6 py-8 md:py-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Find the Best Barbers Near You!
          </h1>
          {/* Removed the paragraph as it's not present in the image */}
          <div className="mt-4">
            <Button
              size="lg"
              className="bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-6 py-2"
            >
              Find Now !
            </Button>
          </div>
        </div>
        <div className="relative h-[300px] sm:h-[350px] md:h-[400px] bg-orange-400 rounded-lg overflow-hidden mt-6 md:mt-0">
          {/* Background with barber tools */}
          <div
            className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-50"
            style={{ backgroundImage: `url(${BarberToolsBG})` }}
          ></div>
          {/* Barber image */}
          <img
            src={BarberHappy}
            alt="Barber with phone"
            width={500}
            height={400}
            className="object-contain h-full w-full relative z-10"
          />
        </div>
      </div>
    </section>


      {/* Popular Barbers Section */}
      <section className="w-full py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center">Popular Barbers Near You !</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((barber) => (
              <BarberShopCard  key={barber} />
            ))}
          </div>
        </div>
      </section>

 
    </main>
  )
}

