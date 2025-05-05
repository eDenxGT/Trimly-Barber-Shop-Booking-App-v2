import { useMutation } from "@tanstack/react-query";
import {
  IFaceShapeDetectionResponse,
} from "@/types/Response";
import {
  barberDetectFaceShape,
 
} from "@/services/barber/barberService";

export const useFaceShapeDetection = () => {
  return useMutation<IFaceShapeDetectionResponse, Error, File>({
    mutationFn: barberDetectFaceShape,
  });
};

