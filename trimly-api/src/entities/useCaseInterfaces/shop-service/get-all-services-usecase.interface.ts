import { IServiceEntity } from "../../models/service.enity.js";

export interface IGetAllServicesUseCase {
	execute(filter: Partial<IServiceEntity>): Promise<IServiceEntity[] | null>;
}
