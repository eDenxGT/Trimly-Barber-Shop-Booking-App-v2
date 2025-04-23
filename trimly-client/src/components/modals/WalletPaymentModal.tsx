import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/wallet/useWallet";
import { getWalletPageDataForClient } from "@/services/client/clientService";
import MuiButton from "../common/buttons/MuiButton";

interface WalletPaymentProps {
  amount: number;
  onPaymentConfirm: () => void;
}

export const WalletPaymentModal = ({
  amount,
  onPaymentConfirm,
}: WalletPaymentProps) => {
  const { data, isFetching, isError } = useWallet(getWalletPageDataForClient);
  const hasInsufficientBalance = data?.balance && data.balance < amount;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MuiButton variant="darkblue" className="gap-2 w-full">
          <Wallet className="h-4 w-4" />
          Pay with Wallet
        </MuiButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Wallet Payment</DialogTitle>
          <DialogDescription>
            Confirm payment using your wallet balance
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium">Wallet Balance</span>
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold"
            >
              ₹{data?.balance?.toFixed(2)}
            </motion.span>
          </div>
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <span className="text-sm font-medium">Payment Amount</span>
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-primary"
            >
              ₹{amount.toFixed(2)}
            </motion.span>
          </div>
          {hasInsufficientBalance && (
            <p className="text-sm text-destructive">
              Insufficient balance. Please add money to your wallet.
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <MuiButton
            disabled={hasInsufficientBalance || isFetching || isError}
            loading={isFetching && !isError}
            onClick={onPaymentConfirm}
            variant="darkblue"
            className="gap-2"
          >
            Confirm Payment
          </MuiButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
