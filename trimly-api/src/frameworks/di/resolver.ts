//* ====== Module Imports ====== *//
import { container } from "tsyringe";

import { DependencyInjection } from "./index.js";

//* ====== Middleware Imports ====== *//
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block-status.middleware.js";

//* ====== Controller Imports ====== *//
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller.js";
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface.js";
import { UserController } from "../../interfaceAdapters/controllers/user.controller.js";
import { IUserController } from "../../entities/controllerInterfaces/users/user-controller.interface.js";
import { IServiceController } from "../../entities/controllerInterfaces/service/service-controller.interface.js";
import { ServiceController } from "../../interfaceAdapters/controllers/service.controller.js";
import { ShopController } from "../../interfaceAdapters/controllers/shop.controller.js";
import { IShopController } from "../../entities/controllerInterfaces/shop/shop-controller.interface.js";
import { IBookingController } from "../../entities/controllerInterfaces/booking/booking-controller.interface.js";
import { BookingController } from "../../interfaceAdapters/controllers/booking.controller.js";
import { ReviewController } from "../../interfaceAdapters/controllers/review.controller.js";
import { IReviewController } from "../../entities/controllerInterfaces/review/review-controller.interface.js";
import { IFeedController } from "../../entities/controllerInterfaces/feed/feed-controller.interface.js";
import { FeedController } from "../../interfaceAdapters/controllers/feed.controller.js";
import { FinanceController } from "../../interfaceAdapters/controllers/finance.controller.js";
import { IFinanceController } from "../../entities/controllerInterfaces/finance/finance-controller.interface.js";

// Registering all registries using a single class
DependencyInjection.registerAll();

//* ====== Middleware Resolving ====== *//
export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);

//* ====== Controller Resolving ====== *//
export const userController =
  container.resolve<IUserController>(UserController);

export const authController =
  container.resolve<IAuthController>(AuthController);

export const serviceController =
  container.resolve<IServiceController>(ServiceController);

export const shopController =
  container.resolve<IShopController>(ShopController);

export const bookingController =
  container.resolve<IBookingController>(BookingController);

export const financeController =
  container.resolve<IFinanceController>(FinanceController);

export const reviewController =
  container.resolve<IReviewController>(ReviewController);

export const feedController =
  container.resolve<IFeedController>(FeedController);
