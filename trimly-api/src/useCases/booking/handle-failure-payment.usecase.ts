import { inject, injectable } from "tsyringe";
import { IHandleFailurePaymentUseCase } from "../../entities/useCaseInterfaces/booking/handle-failure-payment-usecase.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";

@injectable()
export class HandleFailurePaymentUseCase
	implements IHandleFailurePaymentUseCase
{
	constructor(
		@inject("IBookingRepository")
		private _bookingRepository: IBookingRepository
	) {}
	async execute(orderId: string, status: "cancelled"): Promise<void> {
		await this._bookingRepository.update({ orderId }, { status });
	}
}
