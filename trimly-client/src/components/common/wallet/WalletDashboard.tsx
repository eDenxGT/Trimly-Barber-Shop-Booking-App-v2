import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToaster } from "@/hooks/ui/useToaster";
import type { ITransaction, IWithdrawal } from "@/types/Wallet";
import { AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { WithdrawSection } from "./WithdrawSection";
import { WithdrawalStatus } from "./WithdrawalStatus";

export type TransactionType = "credit" | "debit";
export type TransactionSource = "booking" | "topup" | "withdrawal" | "refund";
export type WithdrawalStatusType = "pending" | "approved" | "rejected";
export type UserRole = "client" | "barber";

interface WalletDashboardProps {
  role: UserRole;
  initialBalance: number;
  initialTransactions: ITransaction[];
  initialWithdrawals: IWithdrawal[];
}

// Validation schemas
const topUpSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .integer("Amount must be a whole number"),
});

const withdrawalSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .integer("Amount must be a whole number"),
  accountType: Yup.string()
    .oneOf(["upi", "bank"])
    .required("Account type is required"),
  accountDetails: Yup.string().required("Account details are required"),
});

export default function WalletDashboard({
  role,
  initialBalance,
  initialTransactions,
  initialWithdrawals,
}: WalletDashboardProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [transactions, setTransactions] =
    useState<ITransaction[]>(initialTransactions);
  const [withdrawals, setWithdrawals] =
    useState<IWithdrawal[]>(initialWithdrawals);
  const [filter, setFilter] = useState<TransactionSource | "all">("all");
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { successToast } = useToaster();

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.source === filter);

  const topUpFormik = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema: topUpSchema,
    onSubmit: async (values, { resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBalance((prev) => prev + values.amount);

      const newTransaction: ITransaction = {
        transactionId: `tx-${Date.now()}`,
        createdAt: new Date(),
        amount: values.amount,
        type: "credit",
        source: "topup",
      };

      setTransactions((prev) => [newTransaction, ...prev]);
      setIsTopUpModalOpen(false);
      resetForm();
      successToast(`₹${values.amount} has been added to your wallet.`);
    },
  });

  // Withdrawal form using useFormik
  const withdrawFormik = useFormik({
    initialValues: {
      amount: 0,
      accountType: "upi" as "upi" | "bank",
      accountDetails: "",
    },
    validationSchema: withdrawalSchema,
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (values.amount > balance) {
        errors.amount = `Amount cannot exceed your balance of ₹${balance}`;
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update balance (deduct immediately for UX, though in real app this might happen after approval)
      setBalance((prev) => prev - values.amount);

      // Add transaction
      const newTransaction: ITransaction = {
        transactionId: `tx-${Date.now()}`,
        createdAt: new Date(),
        amount: values.amount,
        type: "debit",
        source: "withdrawal",
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      // Add withdrawal request
      const newWithdrawal: IWithdrawal = {
        withdrawalId: `w-${Date.now()}`,
        walletId: "wallet-123", // This would come from your actual wallet data
        userId: "user-123", // This would come from your auth context
        userType: role,
        amount: values.amount,
        status: "pending",
        method: values.accountType,
        requestedAt: new Date(),
        ...(values.accountType === "upi"
          ? { upiId: values.accountDetails }
          : {
              accountNumber: values.accountDetails,
              // Other bank details would be collected in a real form
            }),
      } as IWithdrawal;

      setWithdrawals((prev) => [newWithdrawal, ...prev]);
      setIsWithdrawModalOpen(false);
      resetForm();
      successToast(
        `Your request to withdraw ₹${values.amount} is being processed.`
      );
    },
  });

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
                  {/* <AnimatePresence> */}
                  {withdrawals.map((withdrawal) => (
                    <WithdrawalStatus
                      key={withdrawal.withdrawalId}
                      withdrawal={withdrawal}
                    />
                  ))}
                  {/* </AnimatePresence> */}
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

      {/* Bottom section: Transaction History (full width) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Select
            defaultValue="all"
            onValueChange={(value) =>
              setFilter(value as TransactionSource | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="booking">Bookings</SelectItem>
              <SelectItem value="topup">Top Ups</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="refund">Refunds</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <motion.tr
                        key={transaction.transactionId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b"
                      >
                        <TableCell className="font-medium">
                          {transaction.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              transaction.source === "booking"
                                ? "border-blue-500 text-blue-500"
                                : transaction.source === "topup"
                                ? "border-green-500 text-green-500"
                                : transaction.source === "withdrawal"
                                ? "border-orange-500 text-orange-500"
                                : "border-purple-500 text-purple-500"
                            }
                          >
                            {transaction.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {transaction.type === "credit" ? (
                              <ArrowDownCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowUpCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={
                                transaction.type === "credit"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              ₹{transaction.amount.toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Up Modal */}
      <Dialog open={isTopUpModalOpen} onOpenChange={setIsTopUpModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={topUpFormik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="mr-2 text-lg">₹</span>
                <div className="w-full">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min={1}
                    value={topUpFormik.values.amount}
                    onChange={topUpFormik.handleChange}
                    onBlur={topUpFormik.handleBlur}
                    className={`w-full ${
                      topUpFormik.errors.amount && topUpFormik.touched.amount
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {topUpFormik.errors.amount && topUpFormik.touched.amount && (
                    <div className="text-sm text-red-500 mt-1">
                      {topUpFormik.errors.amount}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTopUpModalOpen(false)}
                disabled={topUpFormik.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={topUpFormik.isSubmitting}
                className="bg-[var(--darkblue)] hover:bg-[var(--darkblue-hover)]"
              >
                {topUpFormik.isSubmitting ? "Processing..." : "Add Money"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Modal */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the amount and account details for withdrawal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={withdrawFormik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="mr-2 text-lg">₹</span>
                <div className="w-full">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min={1}
                    max={balance}
                    value={withdrawFormik.values.amount}
                    onChange={withdrawFormik.handleChange}
                    onBlur={withdrawFormik.handleBlur}
                    className={`w-full ${
                      withdrawFormik.errors.amount &&
                      withdrawFormik.touched.amount
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {withdrawFormik.errors.amount &&
                    withdrawFormik.touched.amount && (
                      <div className="text-sm text-red-500 mt-1">
                        {withdrawFormik.errors.amount}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Method</Label>
              <div className="col-span-3">
                <RadioGroup
                  value={withdrawFormik.values.accountType}
                  onValueChange={(value) =>
                    withdrawFormik.setFieldValue("accountType", value)
                  }
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi">UPI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                </RadioGroup>
                {withdrawFormik.errors.accountType &&
                  withdrawFormik.touched.accountType && (
                    <div className="text-sm text-red-500 mt-1">
                      {withdrawFormik.errors.accountType}
                    </div>
                  )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {withdrawFormik.values.accountType === "upi" ? (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor="accountDetails" className="text-right">
                    UPI ID
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="accountDetails"
                      name="accountDetails"
                      placeholder="name@upi"
                      value={withdrawFormik.values.accountDetails}
                      onChange={withdrawFormik.handleChange}
                      onBlur={withdrawFormik.handleBlur}
                      className={`w-full ${
                        withdrawFormik.errors.accountDetails &&
                        withdrawFormik.touched.accountDetails
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {withdrawFormik.errors.accountDetails &&
                      withdrawFormik.touched.accountDetails && (
                        <div className="text-sm text-red-500 mt-1">
                          {withdrawFormik.errors.accountDetails}
                        </div>
                      )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor="accountDetails" className="text-right">
                    Account No.
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="accountDetails"
                      name="accountDetails"
                      placeholder="Enter account number"
                      value={withdrawFormik.values.accountDetails}
                      onChange={withdrawFormik.handleChange}
                      onBlur={withdrawFormik.handleBlur}
                      className={`w-full ${
                        withdrawFormik.errors.accountDetails &&
                        withdrawFormik.touched.accountDetails
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {withdrawFormik.errors.accountDetails &&
                      withdrawFormik.touched.accountDetails && (
                        <div className="text-sm text-red-500 mt-1">
                          {withdrawFormik.errors.accountDetails}
                        </div>
                      )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWithdrawModalOpen(false)}
                disabled={withdrawFormik.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={withdrawFormik.isSubmitting}
                className="bg-[var(--darkblue)] hover:bg-[var(--darkblue-hover)]"
              >
                {withdrawFormik.isSubmitting ? "Processing..." : "Withdraw"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
