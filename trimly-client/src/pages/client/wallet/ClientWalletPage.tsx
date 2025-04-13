import WalletDashboard from "@/components/common/wallet/WalletDashboard";
import { useWallet } from "@/hooks/wallet/useWallet";
import { getWalletPageDataForClient } from "@/services/client/clientService";

export default function ClientWalletPage() {
  const { data } = useWallet(getWalletPageDataForClient);
  console.log(data);

  return (
    <WalletDashboard
      role="client"
      balance={data?.balance || 0}
      transactions={data?.transactions || []}
      withdrawals={data?.withdrawals || []}
    />
  );
}
