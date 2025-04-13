import * as Yup from "yup";

export const withdrawalSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .integer("Amount must be a whole number"),
  method: Yup.string().oneOf(["upi", "bank"]).required("Method is required"),
  // UPI fields
  upiId: Yup.string().when("method", {
    is: "upi",
    then: (schema) =>
      schema
        .required("UPI ID is required")
        .matches(
          /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
          "Enter a valid UPI ID (e.g., name@bank)"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  // Bank fields
  accountHolderName: Yup.string().when("method", {
    is: "bank",
    then: (schema) => schema.required("Account holder name is required"),
    otherwise: (schema) => schema,
  }),
  accountNumber: Yup.string().when("method", {
    is: "bank",
    then: (schema) =>
      schema
        .required("Account number is required")
        .matches(/^\d+$/, "Account number must contain only digits")
        .min(9, "Account number must be at least 9 digits")
        .max(18, "Account number can't exceed 18 digits"),
    otherwise: (schema) => schema,
  }),
  ifscCode: Yup.string().when("method", {
    is: "bank",
    then: (schema) =>
      schema
        .required("IFSC code is required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
    otherwise: (schema) => schema,
  }),
  bankName: Yup.string().when("method", {
    is: "bank",
    then: (schema) => schema.required("Bank name is required"),
    otherwise: (schema) => schema,
  }),
});
