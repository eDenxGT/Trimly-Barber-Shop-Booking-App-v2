import { IServiceEntity } from "../../models/service.enity.js";

export interface IAddServiceUseCase {
	execute(data: Partial<IServiceEntity>): Promise<void>;
}
