//* ====== Module Imports ====== *//
import { container } from "tsyringe";

import { DependencyInjection } from "./index.js";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller.js";
import { IAuthController } from "../../entities/controllerInterfaces/users/auth-controller.interface.js";
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block-status.middleware.js";
import { UserController } from "../../interfaceAdapters/controllers/user.controller.js";
import { IUserController } from "../../entities/controllerInterfaces/users/user-controller.interface.js";

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

// export const shopController = container.resolve(ShopController);
