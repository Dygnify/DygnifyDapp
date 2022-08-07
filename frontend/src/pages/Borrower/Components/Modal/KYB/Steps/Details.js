import { useFormik } from "formik";
import GradientButton from "../../../../tools/Button/GradientButton";
import FileFields from "../../../../tools/Inputs/FileFields";
import InputGroup from "../../../../tools/Inputs/InputGroup";
import TextArea from "../../../../tools/Inputs/TextArea";
import TextField from "../../../../tools/Inputs/TextField";
import FileUploader from "../../../Components/FileUploader";
import { CollateralDetailsValidationSchema } from "../../../LoanForm/validations/validation";

export default function Details({ handleNext, handlePrev, formData }) {
  const formik = useFormik({
    initialValues: {
      incorporationDocument_name: "",
      incorporationDocument: "",
    },
    validationSchema: CollateralDetailsValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleNext(values, true);
    },
  });
  return (
    <div className="bg-[#20232A]  w-full mb-2" style={{ borderRadius: "17px" }}>
      <form onSubmit={formik.handleSubmit}>
        <div className="justify-between" style={{ display: "flex" }}>
          <FileUploader
            name="collateral_document"
            handleFile={(file) => {
              formik.setFieldValue("collateral_document", file);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.collateral_document &&
              formik.errors.collateral_document
                ? formik.errors.collateral_document
                : null
            }
            label="Upload Collateral Image"
            className="w-1/2 ml-2"
          />
        </div>

        <div
          style={{ display: "flex", marginTop: 20 }}
          className="flex-row justify-around w-full "
        >
          <GradientButton onClick={handlePrev}>Back</GradientButton>
          <GradientButton type="submit">Next</GradientButton>
        </div>
      </form>
    </div>
  );
}
