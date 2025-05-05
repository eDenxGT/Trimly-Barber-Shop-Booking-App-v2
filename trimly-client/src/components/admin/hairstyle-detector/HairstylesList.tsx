import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MuiButton from "@/components/common/buttons/MuiButton";
import { PlusCircle, Scissors, Search, Edit, Trash2 } from "lucide-react";
import { IHairstyle } from "@/types/Hairstyle";
import { getSmartDate } from "@/utils/helpers/timeFormatter";

const placeholderImage = "/path/to/placeholder-image.jpg";

export const HairstylesManagement = ({
  hairstyles,
  searchTerm,
  setSearchTerm,
  setIsCreationModalOpened,
  handleEditHairstyle,
  handleDeleteHairstyle,
  debouncedSearchTerm,
  isLoading,
}: {
  hairstyles: IHairstyle[];
  searchTerm: string;
  handleEditHairstyle: (hairstyle: IHairstyle) => void;
  handleDeleteHairstyle: (hairstyle: IHairstyle) => void;
  setSearchTerm: (value: string) => void;
  debouncedSearchTerm: string;
  setIsCreationModalOpened: (value: boolean) => void;
  isLoading: boolean;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (hairstyle: IHairstyle) => {
    handleEditHairstyle(hairstyle);
  };

  const handleDelete = (hairstyle: IHairstyle) => {
    handleDeleteHairstyle(hairstyle);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-darkblue">
          Hairstyles Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search hairstyles..."
              value={searchTerm}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>

          <MuiButton
            onClick={() => setIsCreationModalOpened(true)}
            variant="darkblue"
            className="whitespace-nowrap"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Hairstyle
          </MuiButton>
        </div>
      </div>

      {hairstyles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Scissors className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-600">
            No hairstyles found
          </h2>
          <p className="mt-2 mb-3 text-gray-500">
            {debouncedSearchTerm
              ? "Try adjusting your search term or filters"
              : "Start by adding a new hairstyle"}
          </p>
          {!debouncedSearchTerm && (
            <MuiButton
              onClick={() => setIsCreationModalOpened(true)}
              variant="darkblue"
              className="mt-6 "
            >
              <PlusCircle size={18} className="mr-2" />
              Add Hairstyle
            </MuiButton>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {hairstyles.map((hairstyle) => (
              <motion.div
                key={hairstyle.hairstyleId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <Card className="overflow-hidden py-0 h-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col">
                  <div className="relative aspect-[1/1] overflow-hidden bg-gray-100">
                    <img
                      src={hairstyle.image || placeholderImage}
                      alt={hairstyle.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = placeholderImage;
                      }}
                    />
                    <Badge className="absolute top-3 left-3 text-xs capitalize bg-gray-700">
                      {hairstyle.gender}
                    </Badge>
                  </div>

                  <CardContent className="p-5 flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-darkblue">
                      {hairstyle.name}
                    </h3>

                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Face Shapes:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hairstyle.faceShapes.map((shape) => (
                          <Badge
                            key={shape}
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {shape}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-400">
                      Added on{" "}
                      {getSmartDate(hairstyle.createdAt?.toString() || "")}
                    </p>
                  </CardContent>

                  <CardFooter className="p-3 pt-0 border-t bg-gray-50">
                    <div className="flex justify-between w-full">
                      <MuiButton
                        variant="outlined"
                        className="flex-1 mr-2"
                        onClick={() => handleEdit(hairstyle)}
                        disabled={isLoading}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </MuiButton>
                      <MuiButton
                        variant="outlined"
                        className="flex-1 border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(hairstyle)}
                        disabled={isLoading}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </MuiButton>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
