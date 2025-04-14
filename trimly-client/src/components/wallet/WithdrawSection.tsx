import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRoles } from "@/types/UserRoles";
import MuiButton from "../common/buttons/MuiButton";
import { ArrowDownToLine, PlusCircle } from "lucide-react";

export const WithdrawSection = ({
  balance,
  role,
  setIsTopUpModalOpen,
  setIsWithdrawModalOpen,
}: {
  balance: number;
  role: UserRoles;
  setIsTopUpModalOpen: (open: boolean) => void;
  setIsWithdrawModalOpen: (open: boolean) => void;
}) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-0 pb-6 overflow-hidden h-full">
          <CardHeader className="bg-[var(--darkblue)] text-white py-2">
            <CardTitle className="text-xl">Wallet Balance</CardTitle>
            <CardDescription className="text-gray-200">
              Available funds
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">₹</span>
              <span className="text-4xl font-bold ml-1">
                {balance.toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              {role === "client" && (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MuiButton
                    variant="yellow"
                    className="w-full"
                    onClick={() => setIsTopUpModalOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Top Up Wallet
                  </MuiButton>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <MuiButton
                  variant="darkblue"
                  className="w-full"
                  onClick={() => setIsWithdrawModalOpen(true)}
                >
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </MuiButton>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
