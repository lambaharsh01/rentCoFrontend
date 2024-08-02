import * as yup from "yup";

export const initialUserSchema = yup.object().shape({
  userName: yup
    .string()
    .required("Please enter your name")
    .min(3, "Name is too short")
    .max(30, "Name is too long"),
  userEmail: yup
    .string()
    .required("Please enter your email")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email")
    .email("Please enter a valid email Id"),
  phoneNumber: yup
    .string()
    .required("Please enter phone number")
    .matches(/^[6-9]\d{9}$/, "Please enter a valid phone number"),
  day: yup
    .number("Please enter valid birth day")
    .transform((value, originalValue) => {
      return isNaN(originalValue) ? null : value;
    })
    .nullable()
    .typeError("Please enter valid birth day")
    .min(1, "birth day should be more then 0")
    .max(31, "birth day should be less than 32"),
  month: yup
    .number("Please enter birth month")
    .transform((value, originalValue) => {
      return isNaN(originalValue) ? null : value;
    })
    .nullable()
    .typeError("Please enter a valid month")
    .min(1, "birth month should be more then 0")
    .max(12, "birth month should be less than 13"),
  year: yup
    .number("Please enter birth year")
    .transform((value, originalValue) => {
      return isNaN(originalValue) ? null : value;
    })
    .nullable()
    .typeError("Please enter a valid year")
    .max(2010, "birth year should be less then 2010"),
  gender: yup.string().required("Please Select a gender"),
});
