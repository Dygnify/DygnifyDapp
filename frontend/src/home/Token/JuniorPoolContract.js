import React, { useContext, useEffect, useState } from "react";
import GradientButton from "../../uiTools/Button/GradientButton";
import "./../Token.css";
import TokenInput from "./TokenInput";
import { TokenContext } from "./TokenProvider";

const JuniorPoolContract = () => {
	// const [darkMode, setDarkMode] = useState(localStorage.getItem("dark-mode"));

	// useEffect(()=>{
	// 	setDarkMode(localStorage.getItem('dark-mode'));
	// },[darkMode])

	const {
		admin,
		setAdmin,
		grantAdminRoleOfPool,
		setJuniorPool,
		lockPool,
		unlockPool,
	} = useContext(TokenContext);

	return (
		<div className="p-2">
			<div className=" p-0">
				<h2 className="text-center font-bold text-[34px]">Add Admin</h2>
				<div className="-mt-1 divider"></div>
				<div>
					<div className="my-gradient px-4 py-8 flex flex-col md:flex-row items-center md:justify-center gap-y-2 sm:gap-x-8 mb-4 md:w-[60%] mx-auto rounded-xl">
						<div className="flex flex-col gap-y-4">
							<TokenInput
								placeholder="Juniorpool Contract Address"
								onChange={(event) =>
									setJuniorPool(event.target.value)
								}
							/>
							<TokenInput
								placeholder="Target Address"
								onChange={(event) =>
									setAdmin(event.target.value)
								}
							/>
						</div>
						<GradientButton
							onClick={() => grantAdminRoleOfPool(admin)}
						>
							Change Admin Role
						</GradientButton>
					</div>
					<br />
					<br />
					<h2 className="text-center font-bold text-[34px]">
						Locking of Tranches
					</h2>
					<div className="-mt-1 divider"></div>
					<div className="my-gradient px-4 py-8 flex flex-col items-center md:justify-center gap-y-4 mb-4  md:w-[60%] mx-auto rounded-xl">
						<div className="flex flex-col md:flex-row gap-y-2 sm:gap-x-8">
							<TokenInput
								placeholder="Juniorpool Contract Address"
								onChange={(event) =>
									setJuniorPool(event.target.value)
								}
		
							/>
							<GradientButton onClick={() => lockPool(1)}>
								Lock senior tranche
							</GradientButton>
						</div>
						<div className="flex flex-col md:flex-row gap-y-2 sm:gap-x-8">
							<TokenInput
								onChange={(event) =>
									setJuniorPool(event.target.value)
								}
								placeholder="Juniorpool Contract Address"
		
							/>

							<GradientButton onClick={() => lockPool(0)}>
								Lock junior tranche
							</GradientButton>
						</div>
					</div>
					<br />
					<br />
					<h2 className="text-center font-bold text-[34px]">
						Unlocking of Tranches
					</h2>
					<div className="-mt-1 divider"></div>
					<div className="my-gradient px-4 py-8 flex flex-col items-center md:justify-center gap-y-4 mb-4  md:w-[60%] mx-auto rounded-xl">
						<div className="flex flex-col md:flex-row gap-y-2 sm:gap-x-8">
							<TokenInput
								onChange={(event) =>
									setJuniorPool(event.target.value)
								}
								placeholder="Juniorpool Contract Address"
		
							/>

							<GradientButton onClick={() => unlockPool(1)}>
								Unlock senior tranche
							</GradientButton>
						</div>
						<div className="flex flex-col md:flex-row gap-y-2 sm:gap-x-8">
							<TokenInput
								onChange={(event) =>
									setJuniorPool(event.target.value)
								}
								placeholder="Juniorpool Contract Address"
		
							/>

							<GradientButton onClick={() => unlockPool(0)}>
								Unlock junior tranche
							</GradientButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JuniorPoolContract;
