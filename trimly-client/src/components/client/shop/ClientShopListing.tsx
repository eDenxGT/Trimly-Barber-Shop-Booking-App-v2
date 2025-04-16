import {
  Search,
  SlidersHorizontal,
  MapPin,
  Wifi,
  CarFront,
  ChevronDown,
  X,
  Star,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BarberShopCard } from "@/components/common/cards/BarberShopCard";
import { IBarber } from "@/types/User";
import InfiniteScroll from "react-infinite-scroll-component";
import { BarberShopCardSkeleton } from "@/components/common/skeletons/BarberShopCardSkeleton";

interface ClientShopListingProps {
  searchParams: string;
  sortRules?: { sortBy: string; sortOrder: string }[];
  amenities?: string[];
  onSearch: (value: string) => void;
  handleSortChange: (value: string) => void;
  handleAmenityChange: (amenity: string, checked: boolean) => void;
  shops: IBarber[];
  activeFilters: string[];
  removeFilter: (filter: string) => void;
  clearAllFilters: () => void;

  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
}

export function ClientShopListing({
  searchParams,
  amenities,
  sortRules,
  onSearch,
  handleSortChange,
  handleAmenityChange,
  shops,
  activeFilters,
  removeFilter,
  clearAllFilters,
  hasNextPage,
  fetchNextPage,
  isFetching,
  isError,
  refetch,
}: ClientShopListingProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with search and filters */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Barber Shops Near You</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, services, or location"
              className="pl-10"
              value={searchParams || ""}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Reset filters button */}
          <Button
            onClick={clearAllFilters}
            variant="outline"
            className="self-start"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuRadioGroup
                value={`${sortRules?.[0]?.sortBy}-${sortRules?.[0]?.sortOrder}`}
                onValueChange={handleSortChange}
              >
                <DropdownMenuRadioItem value="rating-desc">
                  Highest rated
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rating-asc">
                  Lowest rated
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filters sheet for mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wifi-mobile"
                      checked={amenities?.includes("wifi")}
                      onCheckedChange={(checked) =>
                        handleAmenityChange("wifi", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="wifi-mobile"
                      className="flex items-center gap-2"
                    >
                      <Wifi className="h-4 w-4" /> WiFi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking-mobile"
                      checked={amenities?.includes("parking")}
                      onCheckedChange={(checked) =>
                        handleAmenityChange("parking", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="parking-mobile"
                      className="flex items-center gap-2"
                    >
                      <CarFront className="h-4 w-4" /> Parking
                    </Label>
                  </div>
                </div>

                <Separator className="my-4" />

                <h3 className="font-medium mb-2">Sort By</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nearest-mobile"
                      checked={
                        sortRules?.[0]?.sortBy === "distance" &&
                        sortRules?.[0]?.sortOrder === "asc"
                      }
                      onCheckedChange={(checked) => {
                        if (checked) handleSortChange("distance-asc");
                      }}
                    />
                    <Label
                      htmlFor="nearest-mobile"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" /> Nearest first
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highest-rated-mobile"
                      checked={
                        sortRules?.[0]?.sortBy === "rating" &&
                        sortRules?.[0]?.sortOrder === "desc"
                      }
                      onCheckedChange={(checked) => {
                        if (checked) handleSortChange("rating-desc");
                      }}
                    />
                    <Label
                      htmlFor="highest-rated-mobile"
                      className="flex items-center gap-2"
                    >
                      <Star className="h-4 w-4" /> Highest rated
                    </Label>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Desktop filters */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="wifi"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  id="wifi"
                  checked={amenities?.includes("wifi")}
                  onCheckedChange={(checked) =>
                    handleAmenityChange("wifi", checked as boolean)
                  }
                />
                <Wifi className="h-4 w-4" /> WiFi
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="parking"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  id="parking"
                  checked={amenities?.includes("parking")}
                  onCheckedChange={(checked) =>
                    handleAmenityChange("parking", checked as boolean)
                  }
                />
                <CarFront className="h-4 w-4" /> Parking
              </Label>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {filter}
                <button onClick={() => removeFilter(filter)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {activeFilters.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-sm"
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-500">
          Showing {shops.length} barber shops
        </div>
      </div>

      {/* Display loading skeletons during initial loading or when fetching */}
      {isFetching && shops.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <BarberShopCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Error loading barber shops
          <div className="mt-4">
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={shops.length}
          next={fetchNextPage}
          hasMore={hasNextPage || false}
          loader={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, index) => (
                <BarberShopCardSkeleton key={index} />
              ))}
            </div>
          }
          endMessage={
            shops.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                No more barber shops to load
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <BarberShopCard key={shop.userId} shop={shop} />
            ))}
          </div>
        </InfiniteScroll>
      )}

      {/* No results state */}
      {shops.length === 0 && !isFetching && !isError && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No barber shops found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
