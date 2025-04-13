import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToaster } from "@/hooks/ui/useToaster";
import type { ITransaction, IWithdrawal } from "@/types/Wallet";
import { WithdrawSection } from "./WithdrawSection";
import { WithdrawalStatus } from "./WithdrawalStatus";
import { WithdrawalModal } from "@/components/modals/WithdrawalModal";
import { TopUpModal } from "@/components/modals/TopUpModal";
import { TransactionHistory } from "./TransactionHistory";
import {
  clientTopUpWallet,
  handleFailureClientTopUpPayment,
  handleVerifyClientTopUpPayment,
} from "@/services/client/clientService";
import { useQueryClient } from "@tanstack/react-query";

export type UserRole = "client" | "barber";

interface WalletDashboardProps {
  role: UserRole;
  balance: number;
  transactions: ITransaction[];
  withdrawals: IWithdrawal[];
}

export default function WalletDashboard({
  role,
  balance,
  transactions,
  withdrawals,
}: WalletDashboardProps) {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { successToast } = useToaster();
  const queryClient = useQueryClient();

  const handleTopUpSuccess = () => {
    setIsTopUpModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["wallet-page"] });
  };

  const handleWithdrawalSuccess = (
    amount: number,
    accountType: "upi" | "bank",
    accountDetails: string
  ) => {
    // Add transaction
    const newTransaction: ITransaction = {
      transactionId: `tx-${Date.now()}`,
      createdAt: new Date(),
      amount: amount,
      type: "debit",
      source: "withdrawal",
    };
    // Add withdrawal request
    const newWithdrawal: IWithdrawal = {
      withdrawalId: `w-${Date.now()}`,
      walletId: "wallet-123", // This would come from your actual wallet data
      userId: "user-123", // This would come from your auth context
      userType: role,
      amount: amount,
      status: "pending",
      method: accountType,
      requestedAt: new Date(),
      ...(accountType === "upi"
        ? { upiId: accountDetails }
        : {
            accountNumber: accountDetails,
            // Other bank details would be collected in a real form
          }),
    } as IWithdrawal;

    setIsWithdrawModalOpen(false);
    successToast(`Your request to withdraw ₹${amount} is being processed.`);
  };

  return (
    <div className="container mx-auto mt-16 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

      {/* Top section: Wallet Balance and Withdrawal Requests side by side */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Wallet Balance */}
        <WithdrawSection
          balance={balance}
          role={role}
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          setIsWithdrawModalOpen={setIsWithdrawModalOpen}
        />

        {/* Withdrawal Status */}
        <div>
          {withdrawals.length > 0 ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[300px] overflow-auto">
                  {withdrawals.map((withdrawal) => (
                    <WithdrawalStatus
                      key={withdrawal.withdrawalId}
                      withdrawal={withdrawal}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  No withdrawal requests yet
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom section: Transaction History (full width) using the reusable component */}
      <TransactionHistory
        transactions={transactions}
        maxHeight="400px"
        showFilter={true}
        initialFilter="all"
      />

      {/* Modals */}
      <TopUpModal
        onTopUpSuccess={handleTopUpSuccess}
        handleCreateOrder={clientTopUpWallet}
        handleFailure={handleFailureClientTopUpPayment}
        handleVerifyPayment={handleVerifyClientTopUpPayment}
        isOpen={isTopUpModalOpen}
        onOpenChange={setIsTopUpModalOpen}
      />

      <WithdrawalModal
        isOpen={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        onSuccess={handleWithdrawalSuccess}
        balance={balance}
      />
    </div>
  );
}
