import { Button } from "@/components/ui/button"
import BarberToolsBG from "@/assets/common/barber-tools.png";
import BarberHappy from "@/assets/common/barber-happy.png";

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* {[1, 2, 3, 4].map((barber) => (
              // <BarberShopCard  key={barber} />
            ))} */}
          </div>
        </div>
      </section>

      {/* Categories Section
      <section className="w-full py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {["Haircut", "Beard Trim", "Hair Color", "Shave"].map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
        </div>
      </section>

      Booking Status & Map Section 
      <section className="w-full py-8 sm:py-12 bg-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Your Booking Status</h3>
              <div className="mb-6">
                <Progress value={33} className="h-2 bg-gray-300" />
                <div className="flex justify-between mt-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs">
                      1
                    </div>
                    <span className="text-xs mt-1">Booked</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">2</div>
                    <span className="text-xs mt-1">Confirmed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">3</div>
                    <span className="text-xs mt-1">Completed</span>
                  </div>
                </div>
              </div>
              <Card className="border shadow-sm">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex gap-3 sm:gap-4">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      alt="Barber shop"
                      width={60}
                      height={60}
                      className="rounded-md object-cover w-12 h-12 sm:w-[60px] sm:h-[60px]"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">Master place Barbershop</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">2.5 km</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-3 sm:p-4 pt-0 flex flex-wrap sm:flex-nowrap justify-between gap-2">
                  <div className="flex gap-2 sm:gap-4">
                    <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm">
                      <Phone size={14} className="mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm">
                      <Calendar size={14} className="mr-1" />
                      Reschedule
                    </Button>
                  </div>
                  <Button size="sm" className="h-8 bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm">
                    Details
                  </Button>
                </CardFooter>
              </Card>
            </Card>

            <Card className="p-4 sm:p-6 mt-4 md:mt-0">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Find nearby barbers</h3>
              <div className="relative h-[200px] sm:h-[250px] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src="/placeholder.svg?height=250&width=500"
                  alt="Map"
                  width={500}
                  height={250}
                  className="object-cover w-full h-full"
                />
              // Map pins 
                <div className="absolute top-1/4 left-1/4">
                  <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <MapPin size={14} />
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2">
                  <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <MapPin size={14} />
                  </div>
                </div>
                <div className="absolute bottom-1/3 right-1/4">
                  <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <MapPin size={14} />
                  </div>
                </div>
              </div>
              <Button className="w-full bg-blue-800 hover:bg-blue-900">
                Explore <ChevronRight size={16} className="ml-1" />
              </Button>
            </Card>  
          </div>
        </div>
      </section> */}
    </main>
  )
}

