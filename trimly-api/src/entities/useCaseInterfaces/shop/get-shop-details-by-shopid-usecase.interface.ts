import { IBarberEntity } from "../../models/barber.entity.js";

export interface IGetShopDetailsByShopIdUseCase {
	execute(shopId: string, forType: string): Promise<IBarberEntity | null>;
}
