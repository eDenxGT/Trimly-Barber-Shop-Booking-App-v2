import { IBarberEntity } from "../../models/barber.entity.js";

export interface IGetNearest3ShopsForClientUseCase {
  execute({
    userId,
    latitude,
    longitude,
  }: {
    userId: string;
    latitude: number;
    longitude: number;
  }): Promise<IBarberEntity[] | null>;
}
