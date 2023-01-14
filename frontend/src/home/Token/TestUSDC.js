import React, { useContext } from "react";
import GradientButton from "../../uiTools/Button/GradientButton";
import "./../Token.css";
import TokenInput from "./TokenInput";
import { TokenContext } from "./TokenProvider";

const TestUSDC = () => {
	const { setuser, balanceOf } = useContext(TokenContext);

	return (
		<div className="p-2">
			<div className="flex justify-center">
				<h2 className="text-center font-bold text-[34px]">Test USDC</h2>
			</div>
			<div className="divider"></div>
			<div className="mt-8 flex flex-col md:flex-row items-center md:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
				<TokenInput
					placeholder="Address"
					onChange={(event) => setuser(event.target.value)}
				/>
				<GradientButton onClick={() => balanceOf()}>
					balanceOf
				</GradientButton>
			</div>
		</div>
	);
};

export default TestUSDC;
