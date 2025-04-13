import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import type { ITransaction } from "@/types/Wallet";
import {
  formatDateTime,
} from "./../../../utils/helpers/timeFormatter";

export type TransactionType = "credit" | "debit";
export type TransactionSource = "booking" | "topup" | "withdrawal" | "refund";

interface TransactionHistoryProps {
  transactions: ITransaction[];
  title?: string;
  className?: string;
  maxHeight?: string;
  showFilter?: boolean;
  initialFilter?: TransactionSource | "all";
}

export function TransactionHistory({
  transactions,
  title = "Transaction History",
  className = "",
  maxHeight = "400px",
  showFilter = true,
  initialFilter = "all",
}: TransactionHistoryProps) {
  const [filter, setFilter] = useState<TransactionSource | "all">(
    initialFilter
  );

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.source === filter);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {showFilter && (
          <Select
            defaultValue={initialFilter}
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
        )}
      </CardHeader>
      <CardContent>
        <div className={`overflow-auto`} style={{ maxHeight }}>
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
                        {formatDateTime(transaction?.createdAt?.toString())}
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
                            ₹{transaction?.amount?.toLocaleString()}
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
  );
}
