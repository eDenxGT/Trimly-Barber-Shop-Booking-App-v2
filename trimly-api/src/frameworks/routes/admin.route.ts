//* ====== Module Imports ====== *//
import { Request, RequestHandler, Response } from "express";

//* ====== Middleware Imports ====== *//

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../interfaceAdapters/middlewares/auth.middleware.js";
import {
  authController,
  blockStatusMiddleware,
  chatController,
  financeController,
  meetingController,
  shopController,
  userController,
} from "../di/resolver.js";

//* ====== Controller Imports ====== *//

export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Details Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/details")
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          userController.updateUserDetails(req, res);
        }
      );

    this.router.put(
      "/admin/update-password",
      verifyAuth,
      authorizeRole(["admin"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.changeUserPassword(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Shops Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/shops")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          shopController.getAllShops(req, res);
        }
      );

    this.router
      .route("/admin/shop/:shopId")
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          console.log(req.body);
          shopController.updateShopStatus(req, res);
        }
      );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Withdrawals Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/withdrawals")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          financeController.getAllUserWithdrawals(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          financeController.approveWithdrawal(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          financeController.rejectWithdrawal(req, res);
        }
      );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Chat Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/community")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.getCommunityForEdit(req, res);
        }
      )
      .put(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.editCommunity(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.updateCommunityStatus(req, res);
        }
      )
      .delete(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.deleteCommunity(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          chatController.createCommunity(req, res);
        }
      );

    this.router.get(
      "/admin/communities",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        chatController.getAllCommunitiesForAdmin(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Meeting Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.post(
      "/admin/meeting",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        meetingController.scheduleMeet(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Users Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/admin/users")
      .get(
        verifyAuth,
        authorizeRole(["admin"]),
        (req: Request, res: Response) => {
          userController.getAllUsers(req, res);
        }
      );

    this.router.patch(
      "/admin/user-status",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        userController.updateUserStatus(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Session Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/admin/refresh-session",
      verifyAuth,
      authorizeRole(["admin"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.refreshSession(req, res);
      }
    );

    // logout
    this.router.post(
      "/admin/logout",
      verifyAuth,
      authorizeRole(["admin"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );
    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        console.log("refreshing Admin", req.body);
        authController.handleTokenRefresh(req, res);
      }
    );
  }
}
