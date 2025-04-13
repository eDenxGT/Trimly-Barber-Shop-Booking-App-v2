import { inject, injectable } from "tsyringe";
import { IReviewController } from "../../entities/controllerInterfaces/review/review-controller.interface.js";

@injectable()
export class ReviewController implements IReviewController {
  constructor() {}
}
