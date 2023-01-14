import React, { useContext } from "react";
import GradientButton from "../../uiTools/Button/GradientButton";
import "./../Token.css";
import TokenInput from "./TokenInput";
import { TokenContext } from "./TokenProvider";

const SeniorPoolContract = () => {
	const {
		admin,
		setAdmin,
		grantAdminRole,
		setReceiverContract,
		approveUSDCFromSenior,
		setOpportunityIdForInvest,
		investInToJunior,
		activeOpportunityList,
	} = useContext(TokenContext);

	return (
		<div className="p-2">
			<h2 className="text-center font-bold text-[34px]">Add Admin</h2>
			<div className="-mt-1 divider"></div>
			<div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						placeholder="Target Address"
						onChange={(event) => setAdmin(event.target.value)}
					/>
					<GradientButton onClick={() => grantAdminRole(1, admin)}>
						Add Admin
					</GradientButton>
				</div>
				<br />
				<h2 className="mt-12 text-center  font-bold text-[34px]">
					All Active Opportunities
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="w-[95%] mx-auto overflow-x-auto">
					<table className="w-full">
						<tr className="token-table-header text-slate-200">
							<td className=" font-bold">Opportunity name</td>
							<td className=" font-bold">Opportunity Address</td>
							<td className="font-bold">Opportunity id</td>
						</tr>
						{activeOpportunityList.map((item) => {
							return (
								<>
									<tr>
										<td>{item.opportunityName}</td>
										<td>{item.opportunityPoolAddress}</td>
										<td>{item.id}</td>
									</tr>
								</>
							);
						})}
					</table>
				</div>
				<br />
				<br />
				<h2 className="text-center font-bold text-[34px]">
					Fund Opportunity
				</h2>
				<div className="-mt-1 divider"></div>

				<div className="md:w-[60%] mx-auto font-semibold mb-2 pl-2">
					<p>Step-1</p>
				</div>
				<div className="flex flex-col md:flex-row items-center md:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						placeholder="Receiver contract Address"
						onChange={(event) =>
							setReceiverContract(event.target.value)
						}
					/>
					<GradientButton onClick={() => approveUSDCFromSenior()}>
						Approve
					</GradientButton>
				</div>
				<br />
				<br />
				<div className="md:w-[60%] mx-auto font-semibold mb-2 pl-2">
					<p>Step-2</p>
				</div>
				<div className="flex flex-col md:flex-row items-center md:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						placeholder="Opportunity Id"
						onChange={(event) =>
							setOpportunityIdForInvest(event.target.value)
						}
					/>
					<GradientButton onClick={() => investInToJunior()}>
						Invest in Senior tranche
					</GradientButton>
				</div>
			</div>
		</div>
	);
};

export default SeniorPoolContract;
