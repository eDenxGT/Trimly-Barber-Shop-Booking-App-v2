import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MuiTextField } from "../common/fields/MuiTextField";
import { withdrawalSchema } from "@/utils/validations/withdrawal.validator";

interface WithdrawalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (amount: number, method: "upi" | "bank", details: any) => void;
  balance: number;
}

export function WithdrawalModal({
  isOpen,
  onOpenChange,
  onSuccess,
  balance,
}: WithdrawalModalProps) {
  const formik = useFormik({
    initialValues: {
      amount: 50,
      method: "upi" as "upi" | "bank",
      upiId: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    },
    validationSchema: withdrawalSchema,
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (values.amount > balance) {
        errors.amount = `Amount cannot exceed your balance of ₹${balance}`;
      }
      if (values.amount < 50) {
        errors.amount = "Minimum withdrawal amount is ₹50";
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      const details =
        values.method === "upi"
          ? { upiId: values.upiId }
          : {
              accountHolderName: values.accountHolderName,
              accountNumber: values.accountNumber,
              ifscCode: values.ifscCode,
              bankName: values.bankName,
            };

      onSuccess(values.amount, values.method, details);
      // resetForm();
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      formik.resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the amount and account details for withdrawal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-full">
              <MuiTextField
                id="amount"
                name="amount"
                type="number"
                label="Amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.amount && !!formik.errors.amount}
                helperText={formik.touched.amount ? formik.errors.amount : ""}
                placeholder={`Enter amount (₹50 or upto ₹${balance})`}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Method</Label>
            <div className="col-span-3">
              <RadioGroup
                value={formik.values.method}
                onValueChange={(value) => formik.setFieldValue("method", value)}
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
              {formik.errors.method && formik.touched.method && (
                <div className="text-sm text-red-500 mt-1">
                  {formik.errors.method}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {formik.values.method === "upi" ? (
              <motion.div
                key="upi"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4"
              >
                <MuiTextField
                  id="upiId"
                  name="upiId"
                  placeholder="name@upi"
                  type="text"
                  label="UPI ID"
                  value={formik.values.upiId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.upiId && !!formik.errors.upiId}
                  helperText={formik.touched.upiId ? formik.errors.upiId : ""}
                />
              </motion.div>
            ) : (
              <motion.div
                key="bank"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex flex-col items-center gap-4"
              >
                <MuiTextField
                  id="accountHolderName"
                  name="accountHolderName"
                  placeholder="Enter account holder name"
                  type="text"
                  label="Account Holder Name"
                  value={formik.values.accountHolderName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    !!formik.touched.accountHolderName &&
                    !!formik.errors.accountHolderName
                  }
                  helperText={
                    formik.touched.accountHolderName
                      ? formik.errors.accountHolderName
                      : ""
                  }
                />

                <MuiTextField
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="Enter account number"
                  type="number"
                  label="Account Number"
                  value={formik.values.accountNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    !!formik.touched.accountNumber &&
                    !!formik.errors.accountNumber
                  }
                  helperText={
                    formik.touched.accountNumber
                      ? formik.errors.accountNumber
                      : ""
                  }
                />

                <MuiTextField
                  id="ifscCode"
                  name="ifscCode"
                  placeholder="Enter IFSC code"
                  type="text"
                  label="IFSC Code"
                  value={formik.values.ifscCode}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    formik.setFieldValue("ifscCode", value);
                  }}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.ifscCode && !!formik.errors.ifscCode}
                  helperText={
                    formik.touched.ifscCode ? formik.errors.ifscCode : ""
                  }
                />

                <MuiTextField
                  id="bankName"
                  name="bankName"
                  placeholder="Enter bank name"
                  type="text"
                  label="Bank Name"
                  value={formik.values.bankName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.bankName && !!formik.errors.bankName}
                  helperText={
                    formik.touched.bankName ? formik.errors.bankName : ""
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                formik.isSubmitting ||
                !formik.isValid ||
                formik.values.amount <= 0 ||
                formik.values.amount > balance
              }
              className="bg-[var(--darkblue)] hover:bg-[var(--darkblue-hover)]"
            >
              {formik.isSubmitting ? "Processing..." : "Withdraw"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
