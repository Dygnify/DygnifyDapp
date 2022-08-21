import LockedValueChart from "../../../../investor/components/LockedValueChart";
import GradientButton from "../../../../tools/Button/GradientButton";
import ArrowLeft from "../../Components/SVG/ArrowLeft";
import { useState, useRef } from "react";

export default function Final({ handlePrev, finalSubmit, formData }) {
  const [checked, setChecked] = useState(false);
  const submitRef = useRef();

  const handleClick = () => {
    finalSubmit(formData);
  };

  console.log(formData);

  return (
    <div style={{ display: "flex" }} className="flex-col gap-4">
      <div style={{ display: "flex" }} className="flex-col gap-3">
        <div className="">
          <h4
            className="text-primary
				font-bold
				text-xl

				mb-2"
            style={{ color: "#9281FF" }}
          >
            Loan Details
          </h4>

          <div style={{ display: "flex" }} className="justify-between">
            <div style={{ display: "flex" }} className="flex-col gap-1">
              <div className="font-[500] text-lg">
                <span className=" text-[#A0ABBB]">Pool Name</span>
                <span className="pl-4 text-[#fff]">{formData.loan_name}</span>
              </div>

              <div className="font-[500] text-lg">
                <span className=" text-[#A0ABBB]">Loan Tenure</span>
                <span className="pl-4 text-[#fff]">{formData.loan_tenure}</span>
              </div>

              <div className="font-[500] text-lg">
                <span className=" text-[#A0ABBB]">Loan Interest</span>
                <span className="pl-4 text-[#fff]">
                  {formData.loan_interest}
                </span>
              </div>
            </div>

            <div style={{ display: "flex" }} className="flex-col gap-1">
              <div className="font-[500] text-lg">
                <span className=" text-[#A0ABBB]">Loan amount</span>
                <span className="pl-4 text-[#fff]">{formData.loan_amount}</span>
              </div>

              <div className="font-[500] text-lg">
                <span className=" text-[#A0ABBB]">Repayment frequency</span>
                <span className="pl-4 text-[#fff]">
                  {formData.payment_frequency}
                </span>
              </div>

              <div className="font-[500] text-lg">
                <p className="font-[500] text-[#A0ABBB]">
                  Loan Type{" "}
                  <span className="pl-4 text-[#fff]">
                    {formData.loan_type == 1 ? "Term Loan" : "Bullet Loan"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex" }}
            className="font-[500] text-lg mt-[0.1rem]"
          >
            <span className="w-[15%] text-[#A0ABBB]">Loan Purpose</span>
            <span className="w-[85%] pl-4 text-[#fff]">
              {formData.loan_purpose}
            </span>
          </div>
        </div>

        <div className="">
          <h4
            className="text-primary font-[500] text-xl mb-2"
            style={{ color: "#9281FF" }}
          >
            Collateral
          </h4>

          <div style={{ display: "flex" }} className="justify-between mb-2">
            <div className="font-[500] text-lg">
              <span className=" text-[#A0ABBB]">Collateral document Name</span>
              <span className="pl-4 text-[#fff]">
                {formData.collateral_document_name}
              </span>
            </div>

            <div className="font-[500] text-lg">
              <span className=" text-[#A0ABBB]">Collateral File</span>
              <span className="pl-4 text-[#fff]">
                {formData.collateral_document[0]?.name}
              </span>
            </div>
          </div>

          <div
            style={{ display: "flex" }}
            className="flex-col font-[500] text-lg mt-[0.1rem]"
          >
            <span className="text-[#A0ABBB]">
              Collateral Document Description{" "}
            </span>
            <span className="text-[#fff]">
              {formData.collateral_document_description}
            </span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => {
            setChecked((prev) => !prev);
          }}
          id="terms"
        />
        &nbsp;
        <label htmlFor="terms"> I agree to all terms and condition </label>
      </div>

      <div
        style={{ display: "flex" }}
        className="flex-row justify-between w-full items-center content-center"
      >
        <div
          style={{ display: "flex" }}
          className="justify-center flex-row w-1/3 ml-10"
        >
          <label
            onClick={handlePrev}
            className="text-gray-500 flex-row"
            style={{
              cursor: "pointer",
              marginLeft: 5,
              display: "flex",
            }}
          >
            <ArrowLeft color="#64748B" />
            Back
          </label>
        </div>

        <label
          typeof="submit"
          htmlFor="ProcessModal"
          onClick={handleClick}
          style={{
            borderRadius: "100px",
            padding: "12px 24px",
            color: "white",
          }}
          className={`btn btn-wide  capitalize font-medium border-none ${
            checked
              ? "bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF]"
              : ""
          }`}
          disabled={!checked}
        >
          Submit
        </label>
      </div>

      <div style={{ display: "flex" }} className=" justify-center">
        <div style={{ fontWeight: 600, fontSize: "14px", color: "#FBBF24" }}>
          Note - This pool created will only be valid for 60 days from the day
          after verification{" "}
        </div>
      </div>
    </div>
  );
}
