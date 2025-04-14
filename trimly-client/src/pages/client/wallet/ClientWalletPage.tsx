import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { WithdrawalsList } from "@/components/wallet/WithdrawalsList";
import { WithdrawSection } from "@/components/wallet/WithdrawSection";
import { TopUpModal } from "@/components/modals/TopUpModal";
import { WithdrawalModal } from "@/components/modals/WithdrawalModal";
import { useLoading } from "@/hooks/common/useLoading";
import { useToaster } from "@/hooks/ui/useToaster";
import { useWallet, useWithDrawMutation } from "@/hooks/wallet/useWallet";
import {
  clientTopUpWallet,
  getWalletPageDataForClient,
  handleFailureClientTopUpPayment,
  handleVerifyClientTopUpPayment,
} from "@/services/client/clientService";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { clientWithdrawFromWallet } from "./../../../services/client/clientService";

export default function ClientWalletPage() {
  const { data, isFetching, isError } = useWallet(getWalletPageDataForClient);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { successToast, errorToast } = useToaster();
  const queryClient = useQueryClient();
  const { setLoadingState } = useLoading();
  const { mutate: clientWithdraw } = useWithDrawMutation(
    clientWithdrawFromWallet
  );

  const handleTopUpSuccess = () => {
    setIsTopUpModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["wallet-page"] });
  };

  const handleWithdrawalSuccess = (
    amount: number,
    accountType: "upi" | "bank",
    accountDetails: {
      upiId?: string;
      accountHolderName?: string;
      accountNumber?: string;
      ifscCode?: string;
      bankName?: string;
    }
  ) => {
    clientWithdraw(
      {
        method: accountType,
        amount,
        ...accountDetails,
      },
      {
        onSuccess: (data) => {
          setIsWithdrawModalOpen(false);
          successToast(
            data.message ||
              `Your request to withdraw ₹${amount} is being processed.`
          );
        },
        onError: (error: any) => {
          console.error("Withdrawal failed:", error);
          errorToast(
            error.response.data.message ||
              "Failed to process withdrawal request."
          );
        },
      }
    );
  };

  useEffect(() => {
    setLoadingState(isFetching);
  }, [isFetching]);

  if (isError) {
    return <h1>Error loading wallet data</h1>;
  }

  return (
    <div className="container mx-auto mt-16 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wallet</h1>
      {/* Top section: Wallet Balance and Withdrawal Requests side by side */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Wallet Balance */}
        <WithdrawSection
          balance={data?.balance || 0}
          role="client"
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          setIsWithdrawModalOpen={setIsWithdrawModalOpen}
        />

        {/* Withdrawal Status */}
        <WithdrawalsList withdrawals={data?.withdrawals || []} />
      </div>

      {/* Bottom section: Transaction History (full width) using the reusable component */}
      <TransactionHistory
        transactions={data?.transactions || []}
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
        balance={data?.balance || 0}
      />
    </div>
  );
}
