import React, { useContext } from "react";
import GradientButton from "../../uiTools/Button/GradientButton";
import "./../Token.css";
import TokenInput from "./TokenInput";
import { TokenContext } from "./TokenProvider";

const OpportunityOriginationContract = () => {
	const {
		admin,
		setAdmin,
		grantAdminRole,
		setOpportunityId,
		setUnderWriter,
		assignUnderWriter,
		underReviewOp,
	} = useContext(TokenContext);
	// return (<div>Hello1</div>)
	return (
		<div className=" p-2">
			<h2 className="text-center font-bold text-[34px]">Add Admin</h2>
			<div className="-mt-1 divider"></div>

			<div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						placeholder="Target Address"
						onChange={(event) => setAdmin(event.target.value)}
					/>
					<GradientButton onClick={() => grantAdminRole(0, admin)}>
						Add admin
					</GradientButton>
				</div>

				<h2 className="mt-16 text-center font-bold text-[34px]">
					Under Review Requests
				</h2>
				<div className="-mt-1 divider"></div>

				<div className="w-[95%] mx-auto overflow-x-auto">
					<table className="w-full">
						<tr className="token-table-header text-slate-200">
							<td className="font-bold">Opportunity name</td>
							<td className="font-bold">Borrower address</td>
							<td className="font-bold">Opportunity id</td>
						</tr>
						{underReviewOp.map((item) => {
							return (
								<>
									<tr>
										<td>{item.opportunityName}</td>
										<td>{item.borrower}</td>
										<td>{item.id}</td>
									</tr>
								</>
							);
						})}
					</table>
				</div>
				<br />

				<h2 className="mt-12 text-center font-bold text-[34px]">
					Assign Underwriter
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="flex flex-col md:flex-row items-center md:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8  mx-auto rounded-xl">
					<TokenInput
						placeholder="opportunity ID"
						onChange={(event) =>
							setOpportunityId(event.target.value)
						}
					/>
					<TokenInput
						placeholder="UnderWriter Address"
						onChange={(event) => setUnderWriter(event.target.value)}
					/>
					<GradientButton onClick={() => assignUnderWriter()}>
						Assign underWriter
					</GradientButton>
				</div>
			</div>
		</div>
	);
};

export default OpportunityOriginationContract;
