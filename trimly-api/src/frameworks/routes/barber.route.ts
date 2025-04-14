//* ====== Module Imports ====== *//
import { Request, RequestHandler, Response } from "express";

//* ====== Middleware Imports ====== *//;
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../interfaceAdapters/middlewares/auth.middleware.js";

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";

//* ====== Controller Imports ====== *//
import {
  authController,
  blockStatusMiddleware,
  bookingController,
  feedController,
  serviceController,
  userController,
  walletController,
} from "../di/resolver.js";

export class BarberRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Details Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/barber/details")
      .put(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          userController.updateUserDetails(req, res);
        }
      );

    this.router.put(
      "/barber/update-password",
      verifyAuth,
      authorizeRole(["barber"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.changeUserPassword(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Booking Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/barber/booking")
      .get(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookingController.getAllBookings(req, res);
        }
      )
      .patch(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          bookingController.updateBookingComplete(req, res);
        }
      );

    //* ─────────────────────────────────────────────────────────────
    //*                     🛠️ Post Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/barber/posts")
      // .get(
      //   verifyAuth,
      //   authorizeRole(["barber"]),
      //   blockStatusMiddleware.checkStatus as RequestHandler,
      //   (req: Request, res: Response) => {
      //     postController.getAllPosts(req, res);
      //   }
      // )
      .post(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          feedController.addPost(req, res);
        }
      );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Service Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/barber/services")
      .get(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          console.log("getting services", req.body);
          serviceController.getAllServicesByBarberId(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          serviceController.addService(req, res);
        }
      );

    this.router
      .route("/barber/services/:serviceId")
      .put(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          serviceController.updateServiceById(req, res);
        }
      )
      .delete(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          serviceController.deleteServiceById(req, res);
        }
      );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Wallet Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/barber/wallet")
      .get(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          walletController.getWalletPageData(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          walletController.topUpWallet(req, res);
        }
      )
      // handling payment verification
      .put(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          walletController.verifyTopUpPayment(req, res);
        }
      )
      // handling payment failure
      .patch(
        verifyAuth,
        authorizeRole(["barber"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          walletController.handleTopUpPaymentFailure(req, res);
        }
      );

    this.router.post(
      "/barber/wallet/withdraw",
      verifyAuth,
      authorizeRole(["barber"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        walletController.withdrawFromWallet(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Session Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/barber/refresh-session",
      verifyAuth,
      authorizeRole(["barber"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.refreshSession(req, res);
      }
    );

    // logout
    this.router.post(
      "/barber/logout",
      verifyAuth,
      authorizeRole(["barber"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );

    this.router.post(
      "/barber/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        console.log("refreshing barber", req.body);
        authController.handleTokenRefresh(req, res);
      }
    );
  }
}
