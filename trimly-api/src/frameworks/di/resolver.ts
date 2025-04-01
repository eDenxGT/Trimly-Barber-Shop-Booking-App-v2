//* ====== Module Imports ====== *//
import { container } from "tsyringe";

import { DependencyInjection } from "./index.js";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller.js";
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface.js";
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block-status.middleware.js";
import { UserController } from "../../interfaceAdapters/controllers/user.controller.js";
import { IUserController } from "../../entities/controllerInterfaces/users/user-controller.interface.js";
import { IServiceController } from "../../entities/controllerInterfaces/service/service-controller.interface.js";
import { ServiceController } from "../../interfaceAdapters/controllers/service.controller.js";
import { ShopController } from "../../interfaceAdapters/controllers/shop.controller.js";
import { IShopController } from "../../entities/controllerInterfaces/shop/shop-controller.interface.js";

//* ====== Middleware Imports ====== *//

//* ====== Controller Imports ====== *//
// import { UserController } from "@/interfaceAdapters/controllers/user.controller";
// import { ShopController } from "@/interfaceAdapters/controllers/shop.controller";

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
