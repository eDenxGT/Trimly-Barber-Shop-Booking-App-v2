//* ====== Module Imports ====== *//
import { container } from "tsyringe";

//* ====== Bcrypt Imports ====== *//
import { IBcrypt } from "../security/bcrypt.interface.js";
import { PasswordBcrypt } from "../security/password.bcrypt.js";

//* ====== Service Imports ====== *//
import { IUserExistenceService } from "../../entities/useCaseInterfaces/services/user-existence-service.interface.js";
import { UserExistenceService } from "../../useCases/services/user-existence.service.js";
import { IOtpService } from "../../entities/useCaseInterfaces/services/otp-service.interface.js";
import { OtpService } from "../../useCases/services/otp.service.js";
import { OtpBcrypt } from "../security/otp.bcrypt.js";
import { IEmailService } from "../../entities/useCaseInterfaces/services/email-service.interface.js";
import { EmailService } from "../../useCases/services/email.service.js";
import { ITokenService } from "../../entities/useCaseInterfaces/services/token-service.interface.js";
import { JWTService } from "../../useCases/services/jwt.service.js";

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
import { IRazorpayService } from "../../entities/useCaseInterfaces/services/razorpay-service.interface.js";
import { RazorpayService } from "../../useCases/services/razorpay.service.js";
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
import { IGetChatByUserUseCase } from "../../entities/useCaseInterfaces/chat/get-chat-by-user-usecase.interface.js";
import { GetChatByUserUseCase } from "../../useCases/chat/get-chat-by-user.usecase.js";
import { CreateChatRoomUseCase } from "../../useCases/chat/create-chat-room.usecase.js";
import { ICreateChatRoomUseCase } from "../../entities/useCaseInterfaces/chat/create-chat-room-usecase.interface.js";
import { IGetAllChatsByUserUseCase } from "../../entities/useCaseInterfaces/chat/get-all-chats-by-user.usecase.interface.js";
import { GetAllChatsByUserUseCase } from "../../useCases/chat/get-all-chats-by-user.usecase.js";
import { GetChatByChatIdUseCase } from "../../useCases/chat/get-chat-by-chatid.usecase.js";
import { IGetChatByChatIdUseCase } from "../../entities/useCaseInterfaces/chat/get-chat-by-chatid.usecase.js";

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
  }
}
