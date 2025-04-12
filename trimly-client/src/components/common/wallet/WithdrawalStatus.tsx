import { Badge } from "@/components/ui/badge"
import type { IWithdrawal } from "@/types/Wallet"
import { motion } from "framer-motion"
import { CheckCircle, Clock, XCircle } from "lucide-react"

interface WithdrawalStatusProps {
  withdrawal: IWithdrawal
  className?: string
}

export const WithdrawalStatus = ({ withdrawal, className = "" }: WithdrawalStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />
      case "approved":
        return <CheckCircle className="h-3 w-3" />
      case "rejected":
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const formatDate = (date?: Date) => {
    if (!date) return "N/A"
    return date instanceof Date ? date.toLocaleDateString() : new Date(date).toLocaleDateString()
  }

  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-lg p-4 ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">₹{withdrawal.amount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(withdrawal.requestedAt)} • {withdrawal.method}
          </p>
        </div>
        <Badge className={getStatusColor(withdrawal.status)}>
          <span className="flex items-center gap-1">
            {getStatusIcon(withdrawal.status)}
            {capitalizeStatus(withdrawal.status)}
          </span>
        </Badge>
      </div>

      {/* Account details section */}
      <div className="text-sm truncate">
        <span className="text-muted-foreground">To: </span>
        {withdrawal.method === "upi" && withdrawal.upiId ? (
          <span>{withdrawal.upiId}</span>
        ) : withdrawal.method === "bank" && withdrawal.accountNumber ? (
          <span>
            {withdrawal.accountHolderName && `${withdrawal.accountHolderName}, `}
            {withdrawal.accountNumber}
            {withdrawal.bankName && ` (${withdrawal.bankName})`}
          </span>
        ) : (
          <span>Account details not available</span>
        )}
      </div>

      {/* Rejection reason */}
      {withdrawal.status === "rejected" && withdrawal.remarks && (
        <p className="text-sm text-red-500 mt-2">Reason: {withdrawal.remarks}</p>
      )}
    </motion.div>
  )
}
