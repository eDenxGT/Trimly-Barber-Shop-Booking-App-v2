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
	chatController,
	feedController,
	financeController,
	meetingController,
	s3Controller,
	serviceController,
	userController,
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
			.get(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					feedController.getAllPostsForBarber(req, res);
				}
			)
			.post(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					feedController.addPost(req, res);
				}
			);

		this.router
			.route("/barber/posts/:postId")
			.get(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					feedController.getPostByPostId(req, res);
				}
			)
			.put(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					feedController.editPost(req, res);
				}
			)
			.patch(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					feedController.updatePostStatus(req, res);
				}
			)
			.delete(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					feedController.deletePost(req, res);
				}
			);

		this.router.post(
			"/barber/posts/:postId/like",
			verifyAuth,
			authorizeRole(["barber"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				feedController.toggleLikePost(req, res);
			}
		);

		this.router.post(
			"/barber/posts/:postId/comment",
			verifyAuth,
			authorizeRole(["barber"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				feedController.addComment(req, res);
			}
		);
		this.router.patch(
			"/barber/posts/comment/:commentId/like",
			verifyAuth,
			authorizeRole(["barber"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				feedController.toggleCommentLike(req, res);
			}
		);

		//* ─────────────────────────────────────────────────────────────
		//*                   🛠️ S3 Endpoints
		//* ─────────────────────────────────────────────────────────────
		this.router.get(
			"/barber/s3/generate-presigned-url",
			verifyAuth,
			authorizeRole(["barber"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				s3Controller.generatePresignedUrl(req, res);
			}
		);

		//* ─────────────────────────────────────────────────────────────
		//*                   🛠️ Chat Endpoints
		//* ─────────────────────────────────────────────────────────────
		this.router
			.route("/barber/chat")
			.get(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					chatController.getChatById(req, res);
				}
			);

		this.router.get(
			"/barber/chats",
			verifyAuth,
			authorizeRole(["barber"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				chatController.getAllChatsByUserId(req, res);
			}
		);

		this.router.get(
			"/barber/communities",
			verifyAuth,
			authorizeRole(["barber"]),
			(req: Request, res: Response) => {
				chatController.getAllCommunitiesForBarberListing(req, res);
			}
		);

		this.router.get(
			"/barber/community-chats",
			verifyAuth,
			authorizeRole(["barber"]),
			(req: Request, res: Response) => {
				chatController.getAllCommunityChatsByBarberId(req, res);
			}
		);

		this.router.get(
			"/barber/community-chat",
			verifyAuth,
			authorizeRole(["barber"]),
			(req: Request, res: Response) => {
				chatController.getCommunityChatByChatIdForBarber(req, res);
			}
		);

		this.router.put(
			"/barber/community/join",
			verifyAuth,
			authorizeRole(["barber"]),
			(req: Request, res: Response) => {
				chatController.barberJoinCommunity(req, res);
			}
		);

		//* ─────────────────────────────────────────────────────────────
		//*                     🛠️ Meeting Endpoints
		//* ─────────────────────────────────────────────────────────────
		this.router.get(
			"/barber/meeting",
			verifyAuth,
			authorizeRole(["barber"]),
			(req: Request, res: Response) => {
				meetingController.getMeetingByCommunityId(req, res);
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
					financeController.getWalletPageData(req, res);
				}
			)
			.post(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					financeController.topUpWallet(req, res);
				}
			)
			// handling payment verification
			.put(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					financeController.verifyTopUpPayment(req, res);
				}
			)
			// handling payment failure
			.patch(
				verifyAuth,
				authorizeRole(["barber"]),
				blockStatusMiddleware.checkStatus as RequestHandler,
				(req: Request, res: Response) => {
					financeController.handleTopUpPaymentFailure(req, res);
				}
			);

		this.router.post(
			"/barber/wallet/withdraw",
			verifyAuth,
			authorizeRole(["barber"]),
			blockStatusMiddleware.checkStatus as RequestHandler,
			(req: Request, res: Response) => {
				financeController.withdrawFromWallet(req, res);
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
