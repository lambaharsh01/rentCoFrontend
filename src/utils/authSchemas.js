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

export const loginSchema = yup.object().shape({
  userEmail: yup
    .string()
    .required("Please enter your email")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email")
    .email("Please enter a valid email Id"),
  password: yup
    .string()
    .required("Please enter your email")
    .min(5, "Wrong password")
    .max(30, "Wrong password"),
});

export const tenantSchema = yup.object().shape({
  // groupId: yup.string().required("Group ID not found, can not proceed ahead"),
  tenantName: yup
    .string()
    .required("Please enter tenant's name")
    .min(3, "Name is too short")
    .max(30, "Name is too long"),

  tenantEmail: yup
    .string()
    .test("emptyOrValidEmail", "Please enter a valid email", function (value) {
      if (!value) return true;
      return yup
        .string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .isValidSync(value);
    }),
  tenantPhoneNumber: yup
    .string()
    .required("Please enter tenant's phone number")
    .matches(/^[6-9]\d{9}$/, "Please enter a valid phone number"),
  tenantBackupPhoneNumber: yup
    .string()
    .test(
      "emptyOrValidBackupPhoneNumber",
      "Please enter a valid backup phone number",
      function (value) {
        if (!value) return true;
        return yup
          .string()
          .matches(/^[6-9]\d{9}$/)
          .isValidSync(value);
      }
    ),
  gender: yup.string().required("Please select a gender"),
  tenancyType: yup.string().required("Please select tenancy type"),
  propertyName: yup
    .string()
    .min(3, "Property name should be at least 3 characters")
    .max(30, "Property name should be at max 30 characters"),
  aadhaarNumber: yup
    .string()
    .test(
      "emptyOrValidAadharNumber",
      "Please enter a valid aadhaar number",
      function (value) {
        if (!value) return true;
        return yup.string().min(12).max(12).isValidSync(value);
      }
    ),
  rentAmount: yup
    .number()
    .transform((value, originalValue) => {
      if (!originalValue) return 0;
      return value;
    })
    .required("Please Enter rent amount")
    .min(1, "Rent has to be more than 0"),
});
