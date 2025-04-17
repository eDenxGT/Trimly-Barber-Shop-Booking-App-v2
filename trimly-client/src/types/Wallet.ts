export interface ITransaction {
	transactionId: string;
	userId: string;
	orderId: string;
	walletId: string;
	type: "credit" | "debit";
	source: "booking" | "topup" | "withdrawal" | "refund";
	amount: number;
	status: "pending" | "success" | "failed";
	referenceId: string;
	createdAt: Date;
}

export interface IWallet {
	ownerId: string;
	ownerType: "barber" | "client";
	balance: number;
	currency: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IWithdrawal {
	withdrawalId: string;
	walletId: string;
	userId: string;
	userType: "client" | "barber";
	amount: number;
	status: "pending" | "approved" | "rejected";
	method: "upi" | "bank";
	accountHolderName?: string;
	accountNumber?: string;
	ifscCode?: string;
	bankName?: string;
	upiId?: string;
	remarks?: string;
	userDetails?: {
		fullName?: string;
		avatar?: string;
	};
	requestedAt?: Date;
	processedAt?: Date;
}

export interface WithdrawRequestDTO {
	amount: number;
	method: "upi" | "bank";
	upiId?: string;
	accountHolderName?: string;
	accountNumber?: string;
	ifscCode?: string;
	bankName?: string;
}

export interface WithdrawalQueryParams {
	page: number;
	limit: number;
	status?: string;
	method?: string;
	search?: string;
	sortField?: string;
	sortDirection?: "asc" | "desc";
 }
 

 