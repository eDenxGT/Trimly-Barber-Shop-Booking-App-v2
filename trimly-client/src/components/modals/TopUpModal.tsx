import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MuiTextField } from "../common/fields/MuiTextField";
import { RazorpayButton } from "@/services/payment/RazorPay";
import { CurrencyCode } from "react-razorpay/dist/constants/currency";

const topUpSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .min(50, "Minimum amount is ₹50")
    .integer("Amount must be a whole number"),
});

interface TopUpModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleCreateOrder: (amount: number) => Promise<{
    orderId: string;
    amount: number;
    currency: CurrencyCode;
    customData?: any;
  }>;
  handleVerifyPayment: (res: any) => Promise<void>;
  handleFailure: ({
    orderId,
    status,
  }: {
    orderId: string;
    status: string;
  }) => void;
  onTopUpSuccess: () => void;
}

export function TopUpModal({
  isOpen,
  onOpenChange,
  handleCreateOrder,
  onTopUpSuccess,
  handleFailure,
  handleVerifyPayment,
}: TopUpModalProps) {
  const formik = useFormik({
    initialValues: {
      amount: 50,
    },
    validationSchema: topUpSchema,
    validateOnMount: true,
    onSubmit: () => {},
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      formik.resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
          <DialogDescription>
            Enter the amount you want to add (minimum ₹50).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
            placeholder="Enter amount (₹50 or more)"
          />

          <div className="mt-2">
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={formik.isSubmitting}
              >
                Cancel
              </Button>

              <RazorpayButton
                onSuccess={onTopUpSuccess}
                className="max-h-8 "
                onCreateOrder={() => handleCreateOrder(formik.values.amount)}
                disabled={formik.isSubmitting || !formik.isValid}
                onVerifyPayment={handleVerifyPayment}
                onFailure={handleFailure}
                amount={formik.values.amount}
                description="Add Money to Wallet"
                buttonText="Add Money"
              />
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
