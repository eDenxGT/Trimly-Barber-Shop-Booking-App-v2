import { inject, injectable } from "tsyringe";
import { IUpdateShopStatusUseCase } from "../../entities/useCaseInterfaces/shop/update-shop-status-usecase.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { ISendEmailUseCase } from "../../entities/useCaseInterfaces/common/send-email-usecase.interface.js";
import {
	SHOP_APPROVED_MAIL_CONTENT,
	SHOP_REJECTION_WITH_MESSAGE_MAIL,
	statusTypes,
} from "../../shared/constants.js";

@injectable()
export class UpdateShopStatusUseCase implements IUpdateShopStatusUseCase {
	constructor(
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("ISendEmailUseCase")
		private _sendEmailUseCase: ISendEmailUseCase
	) {}
	async execute(
		id: string,
		status: statusTypes,
		message?: string
	): Promise<void> {
		const barberShop = await this._barberRepository.findOne({ userId: id });
		if (status === "blocked") {
			await this._barberRepository.delete({ userId: id });
			this._sendEmailUseCase.execute(
				barberShop?.email as string,
				"Trimly - Application rejected",
				SHOP_REJECTION_WITH_MESSAGE_MAIL(
					barberShop?.shopName as string,
					message as string
				)
			);
		} else {
			await this._barberRepository.update({ userId: id }, { status });
			this._sendEmailUseCase.execute(
				barberShop?.email as string,
				"Trimly - Application approved",
				SHOP_APPROVED_MAIL_CONTENT(barberShop?.shopName as string)
			);
		}
	}
}
