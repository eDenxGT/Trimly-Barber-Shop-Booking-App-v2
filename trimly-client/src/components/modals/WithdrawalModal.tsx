import * as Yup from "yup";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

interface WithdrawalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (amount: number, accountType: "upi" | "bank", accountDetails: string) => void;
  balance: number;
}

export function WithdrawalModal({ 
  isOpen, 
  onOpenChange, 
  onSuccess,
  balance
}: WithdrawalModalProps) {
  const formik = useFormik({
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
      
      // Call the success handler
      onSuccess(values.amount, values.accountType, values.accountDetails);
      resetForm();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the amount and account details for withdrawal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full ${
                    formik.errors.amount && formik.touched.amount
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.errors.amount && formik.touched.amount && (
                  <div className="text-sm text-red-500 mt-1">
                    {formik.errors.amount}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Method</Label>
            <div className="col-span-3">
              <RadioGroup
                value={formik.values.accountType}
                onValueChange={(value) =>
                  formik.setFieldValue("accountType", value)
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
              {formik.errors.accountType && formik.touched.accountType && (
                <div className="text-sm text-red-500 mt-1">
                  {formik.errors.accountType}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {formik.values.accountType === "upi" ? (
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
                    value={formik.values.accountDetails}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full ${
                      formik.errors.accountDetails && formik.touched.accountDetails
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.errors.accountDetails && formik.touched.accountDetails && (
                    <div className="text-sm text-red-500 mt-1">
                      {formik.errors.accountDetails}
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
                    value={formik.values.accountDetails}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full ${
                      formik.errors.accountDetails && formik.touched.accountDetails
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.errors.accountDetails && formik.touched.accountDetails && (
                    <div className="text-sm text-red-500 mt-1">
                      {formik.errors.accountDetails}
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
              onClick={() => onOpenChange(false)}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
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