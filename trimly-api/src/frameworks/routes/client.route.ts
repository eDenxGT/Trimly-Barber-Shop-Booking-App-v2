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
  chatController,
  dashboardController,
  feedController,
  financeController,
  notificationController,
  reviewController,
  s3Controller,
  shopController,
  userController,
} from "../di/resolver.js";

export class ClientRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Details Endpoints
    //* ─────────────────────────────────────────────────────────────
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

    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Home Page Endpoint
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/client/home-data",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        dashboardController.getClientHomePageData(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Booking Endpoints
    //* ─────────────────────────────────────────────────────────────
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

    this.router.post(
      "/client/booking/wallet",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        bookingController.handleBookWithWallet(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Wallet Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/client/wallet")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          financeController.getWalletPageData(req, res);
        }
      )
      .post(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          financeController.topUpWallet(req, res);
        }
      )
      // handling payment verification
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          financeController.verifyTopUpPayment(req, res);
        }
      )
      // handling payment failure
      .patch(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          financeController.handleTopUpPaymentFailure(req, res);
        }
      );

    this.router.post(
      "/client/wallet/withdraw",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        financeController.withdrawFromWallet(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️ Notifications Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/client/notifications",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        notificationController.getNotificationsByUser(req, res);
      }
    );

    this.router.patch(
      "/client/notifications/read",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        notificationController.markAllNotificationsAsReadByUser(req, res);
      }
    );

    this.router.patch(
      "/client/notifications/:notificationId/read",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        notificationController.markSingleNotificationAsReadByUser(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ S3 Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/client/s3/generate-presigned-url",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        s3Controller.generatePresignedUrl(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Chat Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router
      .route("/client/chat")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req: Request, res: Response) => {
          chatController.getChatById(req, res);
        }
      );

    this.router.get(
      "/client/chats",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        chatController.getAllChatsByUserId(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Shop Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/client/barber-shops",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        shopController.getAllNearestShopsForClient(req, res);
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

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Post Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.get(
      "/client/posts",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        feedController.getAllPostsForClient(req, res);
      }
    );

    this.router.get(
      "/client/posts/:postId",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        feedController.getPostByPostId(req, res);
      }
    );

    this.router.post(
      "/client/posts/:postId/like",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        feedController.toggleLikePost(req, res);
      }
    );

    this.router.get(
      "/client/posts/liked-users/:postId",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        feedController.getPostLikedUsers(req, res);
      }
    );

    this.router.post(
      "/client/posts/:postId/comment",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        feedController.addComment(req, res);
      }
    );
    this.router.patch(
      "/client/posts/comment/:commentId/like",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        feedController.toggleCommentLike(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Review Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.post(
      "/client/review",
      verifyAuth,
      authorizeRole(["client"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        reviewController.addReview(req, res);
      }
    );

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Session Endpoints
    //* ─────────────────────────────────────────────────────────────
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
        authController.handleTokenRefresh(req, res);
      }
    );
  }
}
