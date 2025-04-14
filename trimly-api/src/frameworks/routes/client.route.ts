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
  bookingController,
  reviewController,
  shopController,
  userController,
  walletController,
} from "../di/resolver.js";

export class ClientRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    this.router
      .route("/client/details")
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          userController.updateUserDetails(req, res);
        }
      );

    this.router.put(
      "/client/update-password",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.changeUserPassword(req, res);
      }
    );

    this.router
      .route("/client/booking")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookingController.getAllBookings(req, res);
        }
      )
      // handling booking creation
      .post(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookingController.createBooking(req, res);
        }
      )
      // handling booking cancellation
      .patch(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookingController.cancelBooking(req, res);
        }
      );

    this.router
      .route("/client/payment")
      // handling payment verification
      .post(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookingController.verifyPayment(req, res);
        }
      )
      // handling payment failure
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookingController.handlePaymentFailure(req, res);
        }
      );

    this.router
      .route("/client/wallet")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          walletController.getWalletPageData(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          walletController.topUpWallet(req, res);
        }
      )
      // handling payment verification
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          walletController.verifyTopUpPayment(req, res);
        }
      )
      // handling payment failure
      .patch(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          walletController.handleTopUpPaymentFailure(req, res);
        }
      );

    this.router.post(
      "/client/wallet/withdraw",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        walletController.withdrawFromWallet(req, res);
      }
    );
    this.router.get(
      "/client/barber-shops",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        shopController.getAllNearestShopsForClient(req, res);
      }
    );
    this.router.post(
      "/client/review",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        reviewController.addReview(req, res);
      }
    );

    this.router.get(
      "/client/barber-shop/details",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        shopController.getShopDetailsById(req, res);
      }
    );

    this.router.get(
      "/client/refresh-session",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.refreshSession(req, res);
      }
    );
    // logout
    this.router.post(
      "/client/logout",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );
    this.router.post(
      "/client/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        console.log("refreshing client", req.body);
        authController.handleTokenRefresh(req, res);
      }
    );
  }
}
