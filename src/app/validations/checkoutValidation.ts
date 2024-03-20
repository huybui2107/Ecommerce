import * as yup from "yup";

export const validationSchema = [
  yup.object({
    fullName: yup.string().required("Full name is required"),
    address1: yup.string().required("Address line 1 is required"),
    address2: yup.string().required("Address line 2 is required"),
    city: yup.string().required("city is required"),
    state: yup.string().required("state is required"),
    zip: yup.string().required("zip is required"),
    country: yup.string().required("country is required"),
  }),
  yup.object({}),
  yup.object({
    cardNumber: yup
      .string()
      .required("Card number is required")
      .max(16, "Card number must be at most 16 digits long"),
    cvv: yup
      .string()
      .required("CVV is required")
      .max(3, "CVV must be at most 3 digits long"),
    expireDate: yup
      .string()
      .required("Expire date is required")
      .max(4, "Expiration date must be in MM/YY format"),
    nameOnCard: yup.string().required("Name on card date is required"),
  }),
];
