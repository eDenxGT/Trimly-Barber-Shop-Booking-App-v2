import WalletDashboard from "@/components/common/wallet/WalletDashboard";
import { useWallet } from "@/hooks/wallet/useWallet";
import { getWalletPageDataForClient } from "@/services/client/clientService";

export default function ClientWalletPage() {
  const { data } = useWallet(getWalletPageDataForClient);
  const walletBalance = data?.balance || 0;
  const transactions = data?.transactions || [];
  const withdrawals = data?.withdrawals || [];

  return (
    <WalletDashboard
      role="client"
      initialBalance={walletBalance}
      initialTransactions={transactions}
      initialWithdrawals={withdrawals}
    />
  );
}
