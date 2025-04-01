import { IServiceEntity } from "../../../models/service.enity.js";

export interface IUpdateServiceUseCase {
	execute(
		filter: Partial<IServiceEntity>,
		data: Partial<IServiceEntity>
	): Promise<IServiceEntity | null>;
}
