import * as Yup from "yup";

export const BusinessIncorValidationSchema = Yup.object().shape({
  incorpDocName: Yup.string().required().label("Document Name"),

  incorpDoc: Yup.mixed().required("A file is required"),
});

export const BusinessProofValidationSchema = Yup.object().shape({
  identityDocName: Yup.string().required().label("Document Name"),
  identityDoc: Yup.mixed().required("A file is required"),
  addressDocName: Yup.string().required().label("Document Name"),
  addressDoc: Yup.mixed().required("A file is required"),
});

export const BusinessLicenseValidationSchema = Yup.object().shape({
  licenseDocName: Yup.string().required().label("Document Name"),

  licenseDoc: Yup.mixed().required("A file is required"),
});
