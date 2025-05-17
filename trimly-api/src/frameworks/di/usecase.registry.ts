//* ====== Module Imports ====== *//
import { container } from "tsyringe";

//* ====== Bcrypt Imports ====== *//
import { IBcrypt } from "../security/bcrypt.interface.js";
import { PasswordBcrypt } from "../security/password.bcrypt.js";

//* ====== Service Imports ====== *//
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface.js";
import { UserExistenceService } from "../../interfaceAdapters/services/user-existence.service.js";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface.js";
import { OtpService } from "../../interfaceAdapters/services/otp.service.js";
import { OtpBcrypt } from "../security/otp.bcrypt.js";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface.js";
import { EmailService } from "../../interfaceAdapters/services/email.service.js";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface.js";
import { JWTService } from "../../interfaceAdapters/services/jwt.service.js";
import { S3Service } from "../../interfaceAdapters/services/s3.service.js";
import { IS3Service } from "../../entities/serviceInterfaces/s3-service.interface.js";
import { IGoogleCalendarService } from "../../entities/serviceInterfaces/google-calendar-service.interface.js";
import { GoogleCalendarService } from "../../interfaceAdapters/services/google-calendar.service.js";

//* ====== Socket Handler Imports ====== *//
import { NotificationSocketHandler } from "../../interfaceAdapters/websockets/handlers/notification.handler.js";
import { INotificationSocketHandler } from "../../entities/socketHandlerInterfaces/notification-handler.interface.js";

//* ====== UseCase Imports ====== *//
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface.js";
import { RegisterUserUseCase } from "../../useCases/auth/register-user.usecase.js";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/sent-otp-usecase.interface.js";
import { SendOtpEmailUseCase } from "../../useCases/auth/send-otp-email.usecase.js";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify-otp-usecase.interface.js";
import { VerifyOtpUseCase } from "../../useCases/auth/verify-otp.usecase.js";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/login-usecase.interface.js";
import { LoginUserUseCase } from "../../useCases/auth/login-user.usecase.js";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface.js";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh-token.usecase.js";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface.js";
import { GenerateTokenUseCase } from "../../useCases/auth/generate-token.usecase.js";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/revoke-refresh-token-usecase.interface.js";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke-refresh-token.usecase.js";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/auth/blacklist-token-usecase.interface.js";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist-token.usecase.js";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterfaces/auth/forgot-password-usecase.interface.js";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgot-password.usecase.js";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/reset-password-usecase.interface.js";
import { ResetPasswordUseCase } from "../../useCases/auth/reset-password.usecase.js";
import { IGoogleUseCase } from "../../entities/useCaseInterfaces/auth/google-usecase.js";
import { GoogleUseCase } from "../../useCases/auth/google.usecase.js";
import { ISendEmailUseCase } from "../../entities/useCaseInterfaces/common/send-email-usecase.interface.js";
import { SendEmailUseCase } from "../../useCases/common/send-email.usecase.js";
import { IUpdateUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/update-user-details-usecase.interface.js";
import { UpdateUserDetailsUseCase } from "../../useCases/users/update-user-details.usecase.js";
import { IChangeUserPasswordUseCase } from "../../entities/useCaseInterfaces/users/change-user-password-usecase.interface.js";
import { ChangeUserPasswordUseCase } from "../../useCases/users/change-user-password.usecase.js";
import { AddServiceUseCase } from "../../useCases/shop/service/add-service.usecase.js";
import { GetAllServicesUseCase } from "../../useCases/shop/service/get-all-services.usecase.js";
import { UpdateServiceUseCase } from "../../useCases/shop/service/update-service.usecase.js";
import { DeleteServiceUseCase } from "../../useCases/shop/service/delete-service.usecase.js";
import { IGetAllShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-shops-usecase.interface.js";
import { GetAllShopsUseCase } from "../../useCases/shop/get-all-shops.usecase.js";
import { IAddServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/add-service-usecase.interface.js";
import { IGetAllServicesUseCase } from "../../entities/useCaseInterfaces/shop/service/get-all-services-usecase.interface.js";
import { IUpdateServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/update-service-usecase.interface.js";
import { IDeleteServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/delete-service-usecase.interface.js";
import { IUpdateShopStatusUseCase } from "../../entities/useCaseInterfaces/shop/update-shop-status-usecase.interface.js";
import { UpdateShopStatusUseCase } from "../../useCases/shop/update-shop-status.usecase.js";
import { IGetAllUsersUseCase } from "../../entities/useCaseInterfaces/users/get-all-users-usecase.interface.js";
import { GetAllUsersUseCase } from "../../useCases/users/get-all-users.usecase.js";
import { IUpdateUserStatusUseCase } from "../../entities/useCaseInterfaces/users/update-user-status-usecase.interface.js";
import { UpdateUserStatusUseCase } from "../../useCases/users/update-user-status.usecase.js";
import { IGetUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/get-user-details-usecase.interface.js";
import { GetUserDetailsUseCase } from "../../useCases/users/get-user-details.usecase.js";
import { IGetAllNearestShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-nearest-shops-usecase.interface.js";
import { GetAllNearestShopsUseCase } from "../../useCases/shop/get-all-nearest-shops.usecase.js";
import { IGetShopDetailsByShopIdUseCase } from "../../entities/useCaseInterfaces/shop/get-shop-details-by-shopid-usecase.interface.js";
import { GetShopDetailsByShopIdUseCase } from "../../useCases/shop/get-shop-details-by-shopid.usecase.js";
import { ICreateBookingUseCase } from "../../entities/useCaseInterfaces/booking/create-booking-usecase.interface.js";
import { CreateBookingUseCase } from "../../useCases/booking/create-booking.usecase.js";
import { IVerifyPaymentUseCase } from "../../entities/useCaseInterfaces/booking/verify-payment-usecase.interface.js";
import { VerifyPaymentUseCase } from "../../useCases/booking/verify-payment.usecase.js";
import { IHandleFailurePaymentUseCase } from "../../entities/useCaseInterfaces/booking/handle-failure-payment-usecase.interface.js";
import { HandleFailurePaymentUseCase } from "../../useCases/booking/handle-failure-payment.usecase.js";
import { GetAllBookingsByShopIdUseCase } from "../../useCases/booking/get-all-bookings-by-shopid.usecase.js";
import { IGetAllBookingsByShopIdUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-shopid-usecase.interface.js";
import { IGetAllBookingsByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-user-usecase.interface.js";
import { GetAllBookingsByUserUseCase } from "../../useCases/booking/get-all-bookings-by-user.usecase.js";
import { ICancelBookingUseCase } from "../../entities/useCaseInterfaces/booking/cancel-booking-usecase.interface.js";
import { CancelBookingUseCase } from "../../useCases/booking/cancel-booking.usecase.js";
import { IGetWalletOverviewUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-overview-usecase.interface.js";
import { GetWalletOverviewUseCase } from "../../useCases/finance/get-wallet-overview.usecase.js";
import { IGetWalletByUserUseCase } from "../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface.js";
import { GetWalletByUserUseCase } from "../../useCases/finance/wallet/get-wallet-by-user.usecase.js";
import { GetTransactionByUserUseCase } from "../../useCases/finance/transaction/get-transaction-by-user.usecase.js";
import { IGetTransactionByUserUseCase } from "../../entities/useCaseInterfaces/finance/transaction/get-transaction-by-user-usecase.interface.js";
import { IGetWithdrawalByUserUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/get-withdrawal-by-user-usecase.interface.js";
import { GetWithdrawalByUserUseCase } from "../../useCases/finance/withdrawal/get-withdrawal-by-user-usecase.js";
import { TopUpWalletUseCase } from "../../useCases/finance/wallet/topup-wallet.usecase.js";
import { ITopUpWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/topup-wallet-usecase.interface.js";
import { IRazorpayService } from "../../entities/serviceInterfaces/razorpay-service.interface.js";
import { RazorpayService } from "../../interfaceAdapters/services/razorpay.service.js";
import { IVerifyTopUpPaymentUseCase } from "../../entities/useCaseInterfaces/finance/wallet/verify-topup-payment-usecase.interface.js";
import { VerifyTopUpPaymentUseCase } from "../../useCases/finance/wallet/verify-topup-payment.usecase.js";
import { IUpdateWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/update-wallet-balance-usecase.interface.js";
import { UpdateWalletBalanceUseCase } from "../../useCases/finance/wallet/update-wallet-balance.usecase.js";
import { WithdrawFromWalletUseCase } from "../../useCases/finance/withdrawal/withdraw-from-wallet.usecase.js";
import { IHandleTopUpPaymentFailureUseCase } from "../../entities/useCaseInterfaces/finance/wallet/handle-topup-failure-payment-usecase.interface.js";
import { HandleTopUpPaymentFailureUseCase } from "../../useCases/finance/wallet/handle-topup-failure-payment.usecase.js";
import { IAddShopReviewUseCase } from "../../entities/useCaseInterfaces/review/add-shop-review-usecase.interface.js";
import { AddShopReviewUseCase } from "../../useCases/review/add-shop-review.usecase.js";
import { IAddPostUseCase } from "../../entities/useCaseInterfaces/feed/post/add-post-usecase.interface.js";
import { AddPostUseCase } from "../../useCases/feed/post/add-post.usecase.js";
import { IGetAllPostsByBarberUseCase } from "../../entities/useCaseInterfaces/feed/post/get-all-posts-by-barber-usecase.interface.js";
import { GetAllPostsByBarberUseCase } from "../../useCases/feed/post/get-all-posts-by-barber.usecase.js";
import { GetSinglePostByPostIdUseCase } from "../../useCases/feed/post/get-single-post-by-postid.usecase.js";
import { IGetSinglePostByPostIdUseCase } from "../../entities/useCaseInterfaces/feed/post/get-single-post-by-postid-usecase.interface.js";
import { IUpdatePostUseCase } from "../../entities/useCaseInterfaces/feed/post/update-post-usecase.interface.js";
import { UpdatePostUseCase } from "../../useCases/feed/post/update-post.usecase.js";
import { IDeletePostUseCase } from "../../entities/useCaseInterfaces/feed/post/delete-post-usecase.interface.js";
import { DeletePostUseCase } from "../../useCases/feed/post/delete-post.usecase.js";
import { IUpdatePostStatusUseCase } from "../../entities/useCaseInterfaces/feed/post/update-post-status-usecase.interface.js";
import { UpdatePostStatusUseCase } from "../../useCases/feed/post/update-post-status.usecase.js";
import { IToggleLikePostUseCase } from "../../entities/useCaseInterfaces/feed/post/toggle-like-post-usecase.interface.js";
import { ToggleLikePostUseCase } from "../../useCases/feed/post/toggle-like-post.usecase.js";
import { IAddCommentUseCase } from "../../entities/useCaseInterfaces/feed/comment/add-comment-usecase.interface.js";
import { AddCommentUseCase } from "../../useCases/feed/comment/add-comment.usecase.js";
import { ToggleCommentLikeUseCase } from "../../useCases/feed/comment/toggle-comment-like.usecase.js";
import { IToggleCommentLikeUseCase } from "../../entities/useCaseInterfaces/feed/comment/toggle-comment-like-usecase.interface.js";
import { GetAllPostsForClientUseCase } from "../../useCases/feed/post/get-all-posts-for-client.usecase.js";
import { IGetAllPostsForClientUseCase } from "../../entities/useCaseInterfaces/feed/post/get-all-posts-for-client-usecase.interface.js";
import { ICreateWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface.js";
import { CreateWalletUseCase } from "../../useCases/finance/wallet/create-wallet-usecase.js";
import { CompleteBookingUseCase } from "../../useCases/booking/complete-booking.usecase.js";
import { ICompleteBookingUseCase } from "../../entities/useCaseInterfaces/booking/complete-booking-usecase.interface.js";
import { IIncrementWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/increment-wallet-balance-usecase.interface.js";
import { IncrementWalletBalanceUseCase } from "./../../useCases/finance/wallet/increment-wallet-balance.usecase.js";
import { IDecrementWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/decrement-wallet-balance-usecase.interface.js";
import { DecrementWalletBalanceUseCase } from "../../useCases/finance/wallet/decrement-wallet-balance.usecase.js";
import { IWithdrawFromWalletUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/withdraw-from-wallet-usecase.interface.js";
import { IGetAllUserWithdrawalsUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/get-all-user-withdrawals-usecase.interface.js";
import { GetAllUserWithdrawalsUseCase } from "../../useCases/finance/withdrawal/get-all-user-withdrawals.usecase.js";
import { IApproveWithdrawalUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/approve-withdrawal-usecase.interface.js";
import { ApproveWithdrawalUseCase } from "../../useCases/finance/withdrawal/approve-withdrawal.usecase.js";
import { IRejectWithdrawalUseCase } from "../../entities/useCaseInterfaces/finance/withdrawal/reject-withdrawal-usecase.interface.js";
import { RejectWithdrawalUseCase } from "../../useCases/finance/withdrawal/reject-withdrawal.usecase.js";
import { IBookWithWalletUseCase } from "../../entities/useCaseInterfaces/booking/book-with-wallet-usecase.interface.js";
import { BookWithWalletUseCase } from "../../useCases/booking/book-with-wallet.usecase.js";
import { IGetChatByUserUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-chat-by-user-usecase.interface.js";
import { GetChatByUserUseCase } from "../../useCases/chat/direct-chat/get-chat-by-user.usecase.js";
import { CreateChatRoomUseCase } from "../../useCases/chat/direct-chat/create-chat-room.usecase.js";
import { ICreateChatRoomUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/create-chat-room-usecase.interface.js";
import { IGetAllChatsByUserUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-all-chats-by-user.usecase.interface.js";
import { GetAllChatsByUserUseCase } from "../../useCases/chat/direct-chat/get-all-chats-by-user.usecase.js";
import { GetChatByChatIdUseCase } from "../../useCases/chat/direct-chat/get-chat-by-chatid.usecase.js";
import { IGetChatByChatIdUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/get-chat-by-chatid.usecase.js";
import { SendDirectMessageUseCase } from "../../useCases/chat/direct-chat/send-direct-messsage.usecase.js";
import { ISendDirectMessageUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/send-direct-messsage-usecase.interface.js";
import { ICreateCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/create-community-usecase.interface.js";
import { CreateCommunityUseCase } from "../../useCases/chat/community/create-community.usecase.js";
import { IGetAllCommunitiesForAdminUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-communities-for-admin-usecase.interface.js";
import { GetAllCommunitiesForAdminUseCase } from "../../useCases/chat/community/get-all-communities-for-admin.usecase.js";
import { GetCommunityForEditUseCase } from "../../useCases/chat/community/get-community-for-edit.usecase.js";
import { IGetCommunityForEditUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-for-edit-usecase.interface.js";
import { IEditCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/edit-community-usecase.interface.js";
import { EditCommunityUseCase } from "../../useCases/chat/community/edit-community.usecase.js";
import { IUpdateCommunityStatusUseCase } from "../../entities/useCaseInterfaces/chat/community/update-community-status-usecase.interface.js";
import { UpdateCommunityStatusUseCase } from "../../useCases/chat/community/update-community-status.usecase.js";
import { IDeleteCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/delete-community-usecase.interface.js";
import { DeleteCommunityUseCase } from "../../useCases/chat/community/delete-community.usecase.js";
import { GetAllCommunitiesForBarberUseCase } from "../../useCases/chat/community/get-all-communities-for-barber.usecase.js";
import { IGetAllCommunitiesForBarberUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-communities-for-barber-usecase.interface.js";
import { IBarberJoinCommunityUseCase } from "../../entities/useCaseInterfaces/chat/community/barber-join-community-usecase.interface.js";
import { BarberJoinCommunityUseCase } from "../../useCases/chat/community/barber-join-community.usecase.js";
import { IGetAllCommunityChatsByUserUseCase } from "../../entities/useCaseInterfaces/chat/community/get-all-community-chats-by-user-usecase.interface.js";
import { GetAllCommunityChatsByUserUseCase } from "../../useCases/chat/community/get-all-community-chats-by-user.usecase.js";
import { IGetCommunityChatUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-chat-usecase.interface.js";
import { GetCommunityChatUseCase } from "../../useCases/chat/community/get-community-chat-by-user.usecase.js";
import { ISendCommunityMessageUseCase } from "../../entities/useCaseInterfaces/chat/community/send-community-message-usecase.interface.js";
import { SendCommunityMessageUseCase } from "../../useCases/chat/community/send-community-message.usecase.js";
import { IGetCommunityByCommunityIdUseCase } from "../../entities/useCaseInterfaces/chat/community/get-community-by-communityid-usecase.interface.js";
import { GetCommunityByCommunityIdUseCase } from "../../useCases/chat/community/get-community-by-communityid.usecase.js";
import { IReadDirectMessageUseCase } from "../../entities/useCaseInterfaces/chat/direct-chat/read-direct-message-usecase.interface.js";
import { ReadDirectMessageUseCase } from "../../useCases/chat/direct-chat/read-direct-message.usecase.js";
import { IGeneratePresignedUrlUseCase } from "../../entities/useCaseInterfaces/s3/generate-presigned-url-usecase.interface.js";
import { GeneratePresignedUrlUseCase } from "../../useCases/s3/generate-presigned-url.usecase.js";
import { IScheduleMeetingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/schedule-meeting-usecase.interface.js";
import { ScheduleMeetingUseCase } from "../../useCases/chat/meeting/schedule-meeting.usecase.js";
import { IGetMeetingByCommunityIdUseCase } from "../../entities/useCaseInterfaces/chat/meeting/get-meeting-by-communityid-usecase.interface.js";
import { GetMeetingByCommunityIdUseCase } from "../../useCases/chat/meeting/get-meeting-by-communityid.usecase.js";
import { IGetAllMeetingsForListingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/get-all-meetings-for-listing-usecase.interface.js";
import { GetAllMeetingsForListingUseCase } from "../../useCases/chat/meeting/get-all-meetings-for-listing.usecase.js";
import { UpdateMeetingDetailsUseCase } from "../../useCases/chat/meeting/update-meeting-details.usecase.js";
import { IUpdateMeetingDetailsUseCase } from "../../entities/useCaseInterfaces/chat/meeting/update-meeting-details-usecase.interface.js";
import { ICancelMeetingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/cancel-meeting-usecase.interface.js";
import { CancelMeetingUseCase } from "../../useCases/chat/meeting/cancel-meeting.usecase.js";
import { CompleteMeetingUseCase } from "../../useCases/chat/meeting/complete-meeting.usecase.js";
import { ICompleteMeetingUseCase } from "../../entities/useCaseInterfaces/chat/meeting/complete-meeting-usecase.interface.js";
import { IGetNearest3ShopsForClientUseCase } from "../../entities/useCaseInterfaces/shop/get-nearest-3-shops-for-client-usecase.interface.js";
import { GetNearest3ShopsForClientUseCase } from "../../useCases/shop/get-nearest-3-shops-for-client.usecase.js";
import { IGetLastBookingByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-last-booking-by-user-usecase.interface.js";
import { GetLastBookingByUserUseCase } from "../../useCases/booking/get-last-booking-by-user.usecase.js";
import { GetBarberDashboardDataUseCase } from "../../useCases/dashboard/get-barber-dashboard-data.usecase.js";
import { IGetBarberDashboardDataUseCase } from "../../entities/useCaseInterfaces/dashboard/get-barber-dashboard-data-usecase..interface.js";
import { GetAdminDashboardDataUseCase } from "../../useCases/dashboard/get-admin-dashboard-data.usecase.js";
import { IGetAdminDashboardDataUseCase } from "../../entities/useCaseInterfaces/dashboard/get-admin-dashboard-data-usecase.interface.js";
import { IGetHairstylesByFaceShapeUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-hairstyles-by-face-shape-usecase.interface.js";
import { GetHairstylesByFaceShapeUseCase } from "../../useCases/hairstyle-detector/get-hairstyles-by-face-shape.usecase.js";
import { AddHairstyleUseCase } from "../../useCases/hairstyle-detector/add-hairstyle.usecase.js";
import { IAddHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/add-hairstyle-usecase.interface.js";
import { IGetAllHairstylesUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-all-hairstyles-usecase.interface.js";
import { GetAllHairstylesUseCase } from "../../useCases/hairstyle-detector/get-all-hairstyles.usecase.js";
import { IUpdateHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/update-hairstyle-usecase.interface.js";
import { UpdateHairstyleUseCase } from "../../useCases/hairstyle-detector/update-hairstyle.usecase.js";
import { IDeleteHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/delete-hairstyle-usecase.interface.js";
import { DeleteHairstyleUseCase } from "../../useCases/hairstyle-detector/delete-hairstyle.usecase.js";
import { GetPostLikedUsersUseCase } from "../../useCases/feed/post/get-post-liked-users.usecase.js";
import { IGetPostLikedUsersUseCase } from "../../entities/useCaseInterfaces/feed/post/get-post-liked-users-usecase.interface.js";
import { IGetNotificationsByUserUseCase } from "../../entities/useCaseInterfaces/notifications/get-notifications-by-user-usecase.interface.js";
import { GetNotificationsByUserUseCase } from "../../useCases/notification/get-notifications-by-user.usecase.js";
import { ISendNotificationByUserUseCase } from "../../entities/useCaseInterfaces/notifications/send-notification-by-user-usecase.interface.js";
import { SendNotificationByUserUseCase } from "../../useCases/notification/send-notification-by-user.usecase.js";
import { SocketService } from "../../interfaceAdapters/services/socket.service.js";
import { ISocketService } from "../../entities/serviceInterfaces/socket-service.interface.js";
import { MarkSingleNotificationAsReadByUserUseCase } from "../../useCases/notification/mark-single-notification-as-read-by-user.usecase.js";
import { IMarkSingleNotificationAsReadByUserUseCase } from "../../entities/useCaseInterfaces/notifications/mark-single-notification-as-read-by-user-usecase.interface.js";
import { MarkAllNotificationsAsReadByUserUseCase } from "../../useCases/notification/mark-all-notifications-as-read-by-user.usecase.js";
import { IMarkAllNotificationsAsReadByUserUseCase } from "../../entities/useCaseInterfaces/notifications/mark-all-notifications-as-read-by-user-usecase.interface.js";

export class UseCaseRegistry {
  static registerUseCases(): void {
    //* ====== Register UseCases ====== *//
    container.register<IRegisterUserUseCase>("IRegisterUserUseCase", {
      useClass: RegisterUserUseCase,
    });

    container.register<ISendOtpEmailUseCase>("ISendOtpEmailUseCase", {
      useClass: SendOtpEmailUseCase,
    });

    container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
      useClass: VerifyOtpUseCase,
    });

    container.register<ILoginUserUseCase>("ILoginUserUseCase", {
      useClass: LoginUserUseCase,
    });

    container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
      useClass: RefreshTokenUseCase,
    });

    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });

    container.register<IRevokeRefreshTokenUseCase>(
      "IRevokeRefreshTokenUseCase",
      {
        useClass: RevokeRefreshTokenUseCase,
      }
    );

    container.register<IBlackListTokenUseCase>("IBlackListTokenUseCase", {
      useClass: BlackListTokenUseCase,
    });

    container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase", {
      useClass: ForgotPasswordUseCase,
    });

    container.register<IResetPasswordUseCase>("IResetPasswordUseCase", {
      useClass: ResetPasswordUseCase,
    });

    container.register<IGoogleUseCase>("IGoogleUseCase", {
      useClass: GoogleUseCase,
    });

    container.register<ISendEmailUseCase>("ISendEmailUseCase", {
      useClass: SendEmailUseCase,
    });

    container.register<IUpdateUserDetailsUseCase>("IUpdateUserDetailsUseCase", {
      useClass: UpdateUserDetailsUseCase,
    });

    container.register<IChangeUserPasswordUseCase>(
      "IChangeUserPasswordUseCase",
      {
        useClass: ChangeUserPasswordUseCase,
      }
    );

    container.register<IAddServiceUseCase>("IAddServiceUseCase", {
      useClass: AddServiceUseCase,
    });

    container.register<IGetAllServicesUseCase>("IGetAllServicesUseCase", {
      useClass: GetAllServicesUseCase,
    });

    container.register<IUpdateServiceUseCase>("IUpdateServiceUseCase", {
      useClass: UpdateServiceUseCase,
    });

    container.register<IDeleteServiceUseCase>("IDeleteServiceUseCase", {
      useClass: DeleteServiceUseCase,
    });

    container.register<IGetAllShopsUseCase>("IGetAllShopsUseCase", {
      useClass: GetAllShopsUseCase,
    });

    container.register<IUpdateShopStatusUseCase>("IUpdateShopStatusUseCase", {
      useClass: UpdateShopStatusUseCase,
    });

    container.register<IGetAllUsersUseCase>("IGetAllUsersUseCase", {
      useClass: GetAllUsersUseCase,
    });

    container.register<IUpdateUserStatusUseCase>("IUpdateUserStatusUseCase", {
      useClass: UpdateUserStatusUseCase,
    });

    container.register<IGetUserDetailsUseCase>("IGetUserDetailsUseCase", {
      useClass: GetUserDetailsUseCase,
    });

    container.register<IGetAllNearestShopsUseCase>(
      "IGetAllNearestShopsUseCase",
      {
        useClass: GetAllNearestShopsUseCase,
      }
    );

    container.register<IGetShopDetailsByShopIdUseCase>(
      "IGetShopDetailsByShopIdUseCase",
      {
        useClass: GetShopDetailsByShopIdUseCase,
      }
    );

    container.register<IGetAllBookingsByShopIdUseCase>(
      "IGetAllBookingsByShopIdUseCase",
      {
        useClass: GetAllBookingsByShopIdUseCase,
      }
    );

    container.register<ICreateBookingUseCase>("ICreateBookingUseCase", {
      useClass: CreateBookingUseCase,
    });

    container.register<IVerifyPaymentUseCase>("IVerifyPaymentUseCase", {
      useClass: VerifyPaymentUseCase,
    });

    container.register<IHandleFailurePaymentUseCase>(
      "IHandleFailurePaymentUseCase",
      {
        useClass: HandleFailurePaymentUseCase,
      }
    );

    container.register<IGetAllBookingsByUserUseCase>(
      "IGetAllBookingsByUserUseCase",
      { useClass: GetAllBookingsByUserUseCase }
    );

    container.register<ICancelBookingUseCase>("ICancelBookingUseCase", {
      useClass: CancelBookingUseCase,
    });

    container.register<ICompleteBookingUseCase>("ICompleteBookingUseCase", {
      useClass: CompleteBookingUseCase,
    });

    container.register<IGetWalletOverviewUseCase>("IGetWalletOverviewUseCase", {
      useClass: GetWalletOverviewUseCase,
    });

    container.register<IGetWalletByUserUseCase>("IGetWalletByUserUseCase", {
      useClass: GetWalletByUserUseCase,
    });

    container.register<IGetTransactionByUserUseCase>(
      "IGetTransactionByUserUseCase",
      {
        useClass: GetTransactionByUserUseCase,
      }
    );

    container.register<IGetWithdrawalByUserUseCase>(
      "IGetWithdrawalByUserUseCase",
      {
        useClass: GetWithdrawalByUserUseCase,
      }
    );

    container.register<ITopUpWalletUseCase>("ITopUpWalletUseCase", {
      useClass: TopUpWalletUseCase,
    });

    container.register<IVerifyTopUpPaymentUseCase>(
      "IVerifyTopUpPaymentUseCase",
      {
        useClass: VerifyTopUpPaymentUseCase,
      }
    );

    container.register<IUpdateWalletBalanceUseCase>(
      "IUpdateWalletBalanceUseCase",
      {
        useClass: UpdateWalletBalanceUseCase,
      }
    );

    container.register<IWithdrawFromWalletUseCase>(
      "IWithdrawFromWalletUseCase",
      {
        useClass: WithdrawFromWalletUseCase,
      }
    );

    container.register<IHandleTopUpPaymentFailureUseCase>(
      "IHandleTopUpPaymentFailureUseCase",
      {
        useClass: HandleTopUpPaymentFailureUseCase,
      }
    );

    container.register<IAddShopReviewUseCase>("IAddShopReviewUseCase", {
      useClass: AddShopReviewUseCase,
    });

    container.register<IAddPostUseCase>("IAddPostUseCase", {
      useClass: AddPostUseCase,
    });

    container.register<IGetAllPostsByBarberUseCase>(
      "IGetAllPostsByBarberUseCase",
      {
        useClass: GetAllPostsByBarberUseCase,
      }
    );

    container.register<IGetSinglePostByPostIdUseCase>(
      "IGetSinglePostByPostIdUseCase",
      {
        useClass: GetSinglePostByPostIdUseCase,
      }
    );

    container.register<IUpdatePostUseCase>("IUpdatePostUseCase", {
      useClass: UpdatePostUseCase,
    });

    container.register<IDeletePostUseCase>("IDeletePostUseCase", {
      useClass: DeletePostUseCase,
    });

    container.register<IUpdatePostStatusUseCase>("IUpdatePostStatusUseCase", {
      useClass: UpdatePostStatusUseCase,
    });

    container.register<IToggleLikePostUseCase>("IToggleLikePostUseCase", {
      useClass: ToggleLikePostUseCase,
    });

    container.register<IAddCommentUseCase>("IAddCommentUseCase", {
      useClass: AddCommentUseCase,
    });

    container.register<IToggleCommentLikeUseCase>("IToggleCommentLikeUseCase", {
      useClass: ToggleCommentLikeUseCase,
    });

    container.register<IGetAllPostsForClientUseCase>(
      "IGetAllPostsForClientUseCase",
      {
        useClass: GetAllPostsForClientUseCase,
      }
    );

    container.register<ICreateWalletUseCase>("ICreateWalletUseCase", {
      useClass: CreateWalletUseCase,
    });

    container.register<IIncrementWalletBalanceUseCase>(
      "IIncrementWalletBalanceUseCase",
      {
        useClass: IncrementWalletBalanceUseCase,
      }
    );

    container.register<IDecrementWalletBalanceUseCase>(
      "IDecrementWalletBalanceUseCase",
      {
        useClass: DecrementWalletBalanceUseCase,
      }
    );

    container.register<IGetAllUserWithdrawalsUseCase>(
      "IGetAllUserWithdrawalsUseCase",
      {
        useClass: GetAllUserWithdrawalsUseCase,
      }
    );

    container.register<IApproveWithdrawalUseCase>("IApproveWithdrawalUseCase", {
      useClass: ApproveWithdrawalUseCase,
    });

    container.register<IRejectWithdrawalUseCase>("IRejectWithdrawalUseCase", {
      useClass: RejectWithdrawalUseCase,
    });

    container.register<IBookWithWalletUseCase>("IBookWithWalletUseCase", {
      useClass: BookWithWalletUseCase,
    });

    container.register<IGetChatByUserUseCase>("IGetChatByUserUseCase", {
      useClass: GetChatByUserUseCase,
    });

    container.register<ICreateChatRoomUseCase>("ICreateChatRoomUseCase", {
      useClass: CreateChatRoomUseCase,
    });

    container.register<IGetAllChatsByUserUseCase>("IGetAllChatsByUserUseCase", {
      useClass: GetAllChatsByUserUseCase,
    });

    container.register<IGetChatByChatIdUseCase>("IGetChatByChatIdUseCase", {
      useClass: GetChatByChatIdUseCase,
    });

    container.register<ISendDirectMessageUseCase>("ISendDirectMessageUseCase", {
      useClass: SendDirectMessageUseCase,
    });

    container.register<ICreateCommunityUseCase>("ICreateCommunityUseCase", {
      useClass: CreateCommunityUseCase,
    });

    container.register<IGetAllCommunitiesForAdminUseCase>(
      "IGetAllCommunitiesForAdminUseCase",
      {
        useClass: GetAllCommunitiesForAdminUseCase,
      }
    );

    container.register<IGetCommunityForEditUseCase>(
      "IGetCommunityForEditUseCase",
      {
        useClass: GetCommunityForEditUseCase,
      }
    );

    container.register<IEditCommunityUseCase>("IEditCommunityUseCase", {
      useClass: EditCommunityUseCase,
    });

    container.register<IUpdateCommunityStatusUseCase>(
      "IUpdateCommunityStatusUseCase",
      {
        useClass: UpdateCommunityStatusUseCase,
      }
    );

    container.register<IDeleteCommunityUseCase>("IDeleteCommunityUseCase", {
      useClass: DeleteCommunityUseCase,
    });

    container.register<IGetAllCommunitiesForBarberUseCase>(
      "IGetAllCommunitiesForBarberUseCase",
      {
        useClass: GetAllCommunitiesForBarberUseCase,
      }
    );

    container.register<IBarberJoinCommunityUseCase>(
      "IBarberJoinCommunityUseCase",
      {
        useClass: BarberJoinCommunityUseCase,
      }
    );

    container.register<IGetAllCommunityChatsByUserUseCase>(
      "IGetAllCommunityChatsByUserUseCase",
      {
        useClass: GetAllCommunityChatsByUserUseCase,
      }
    );

    container.register<IGetCommunityChatUseCase>("IGetCommunityChatUseCase", {
      useClass: GetCommunityChatUseCase,
    });

    container.register<ISendCommunityMessageUseCase>(
      "ISendCommunityMessageUseCase",
      {
        useClass: SendCommunityMessageUseCase,
      }
    );

    container.register<IGetCommunityByCommunityIdUseCase>(
      "IGetCommunityByCommunityIdUseCase",
      {
        useClass: GetCommunityByCommunityIdUseCase,
      }
    );

    container.register<IReadDirectMessageUseCase>("IReadDirectMessageUseCase", {
      useClass: ReadDirectMessageUseCase,
    });

    container.register<IGeneratePresignedUrlUseCase>(
      "IGeneratePresignedUrlUseCase",
      {
        useClass: GeneratePresignedUrlUseCase,
      }
    );

    container.register<IScheduleMeetingUseCase>("IScheduleMeetingUseCase", {
      useClass: ScheduleMeetingUseCase,
    });

    container.register<IGetMeetingByCommunityIdUseCase>(
      "IGetMeetingByCommunityIdUseCase",
      {
        useClass: GetMeetingByCommunityIdUseCase,
      }
    );

    container.register<IGetAllMeetingsForListingUseCase>(
      "IGetAllMeetingsForListingUseCase",
      {
        useClass: GetAllMeetingsForListingUseCase,
      }
    );

    container.register<IUpdateMeetingDetailsUseCase>(
      "IUpdateMeetingDetailsUseCase",
      {
        useClass: UpdateMeetingDetailsUseCase,
      }
    );

    container.register<ICancelMeetingUseCase>("ICancelMeetingUseCase", {
      useClass: CancelMeetingUseCase,
    });

    container.register<ICompleteMeetingUseCase>("ICompleteMeetingUseCase", {
      useClass: CompleteMeetingUseCase,
    });

    container.register<IGetNearest3ShopsForClientUseCase>(
      "IGetNearest3ShopsForClientUseCase",
      {
        useClass: GetNearest3ShopsForClientUseCase,
      }
    );

    container.register<IGetLastBookingByUserUseCase>(
      "IGetLastBookingByUserUseCase",
      {
        useClass: GetLastBookingByUserUseCase,
      }
    );

    container.register<IGetBarberDashboardDataUseCase>(
      "IGetBarberDashboardDataUseCase",
      {
        useClass: GetBarberDashboardDataUseCase,
      }
    );

    container.register<IGetAdminDashboardDataUseCase>(
      "IGetAdminDashboardDataUseCase",
      {
        useClass: GetAdminDashboardDataUseCase,
      }
    );

    container.register<IGetHairstylesByFaceShapeUseCase>(
      "IGetHairstylesByFaceShapeUseCase",
      {
        useClass: GetHairstylesByFaceShapeUseCase,
      }
    );

    container.register<IAddHairstyleUseCase>("IAddHairstyleUseCase", {
      useClass: AddHairstyleUseCase,
    });

    container.register<IGetAllHairstylesUseCase>("IGetAllHairstylesUseCase", {
      useClass: GetAllHairstylesUseCase,
    });

    container.register<IUpdateHairstyleUseCase>("IUpdateHairstyleUseCase", {
      useClass: UpdateHairstyleUseCase,
    });

    container.register<IDeleteHairstyleUseCase>("IDeleteHairstyleUseCase", {
      useClass: DeleteHairstyleUseCase,
    });

    container.register<IGetPostLikedUsersUseCase>("IGetPostLikedUsersUseCase", {
      useClass: GetPostLikedUsersUseCase,
    });

    container.register<IGetNotificationsByUserUseCase>(
      "IGetNotificationsByUserUseCase",
      {
        useClass: GetNotificationsByUserUseCase,
      }
    );

    container.register<ISendNotificationByUserUseCase>(
      "ISendNotificationByUserUseCase",
      {
        useClass: SendNotificationByUserUseCase,
      }
    );

    container.register<IMarkAllNotificationsAsReadByUserUseCase>(
      "IMarkAllNotificationsAsReadByUserUseCase",
      {
        useClass: MarkAllNotificationsAsReadByUserUseCase,
      }
    );

    container.register<IMarkSingleNotificationAsReadByUserUseCase>(
      "IMarkSingleNotificationAsReadByUserUseCase",
      {
        useClass: MarkSingleNotificationAsReadByUserUseCase,
      }
    );

    //* ====== Register Bcrypts ====== *//
    container.register<IBcrypt>("IPasswordBcrypt", {
      useClass: PasswordBcrypt,
    });

    container.register<IBcrypt>("IOtpBcrypt", {
      useClass: OtpBcrypt,
    });

    //* ====== Register Services ====== *//
    container.register<IUserExistenceService>("IUserExistenceService", {
      useClass: UserExistenceService,
    });

    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });

    container.register<ITokenService>("ITokenService", {
      useClass: JWTService,
    });

    container.register<IRazorpayService>("IRazorpayService", {
      useClass: RazorpayService,
    });

    container.register<IS3Service>("IS3Service", {
      useClass: S3Service,
    });

    container.register<IGoogleCalendarService>("IGoogleCalendarService", {
      useClass: GoogleCalendarService,
    });

    container.register<ISocketService>("ISocketService", {
      useClass: SocketService,
    });

    //* ====== Register Socket Handlers ====== *//
    container.register<INotificationSocketHandler>(
      "INotificationSocketHandler",
      {
        useClass: NotificationSocketHandler,
      }
    );
  }
}
