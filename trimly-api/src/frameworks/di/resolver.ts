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
import { IChatController } from "../../entities/controllerInterfaces/chat/chat-controller.interface.js";
import { ChatController } from "../../interfaceAdapters/controllers/chat.controller.js";
import { DirectChatSocketHandler } from "../../interfaceAdapters/websockets/handlers/direct-chat.handler.js";
import { IDirectChatSocketHandler } from "../../entities/socketHandlerInterfaces/direct-chat-handler.interface.js";
import { CommunityChatSocketHandler } from "../../interfaceAdapters/websockets/handlers/community-chat.handler.js";
import { ICommunityChatSocketHandler } from "../../entities/socketHandlerInterfaces/community-chat-handler.interface.js";
import { S3Controller } from "../../interfaceAdapters/controllers/s3.controller.js";
import { IS3Controller } from "../../entities/controllerInterfaces/s3/s3-controller.interface.js";

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

export const chatController =
  container.resolve<IChatController>(ChatController);

export const s3Controller = container.resolve<IS3Controller>(S3Controller);

//* ====== Socket Handler Resolving ====== *//
export const directChatSocketHandler =
  container.resolve<IDirectChatSocketHandler>(DirectChatSocketHandler);

export const communityChatSocketHandler =
  container.resolve<ICommunityChatSocketHandler>(CommunityChatSocketHandler);
