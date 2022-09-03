import React, { createContext, useReducer } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import Token from "./home/Token";

import LandingPage from "./pages/LandingPage/LandingPage";
import BorrowerDashboard from "./pages/Borrower/BorrowerDashboard";
import Overview from "./pages/Borrower/Overview";
import BorrowList from "./pages/Borrower/BorrowList";
import InvestorDashboard from "./pages/Investor/InvestorDashboard";

import InvestorOverview from "./pages/Investor/InvestorOverview";
import Invest from "./pages/Investor/Invest";
import Withdraw from "./pages/Investor/Withdraw";
import ViewPool from "./pages/Investor/ViewPool";
import UnderwriterDashboard from "./pages/Underwriters/UnderwriterDashboard";
import BorrowRequest from "./pages/Underwriters/BorrowRequest";
import PoolDetails from "./pages/Underwriters/PoolDetails";
import ApprovalHistory from "./pages/Underwriters/ApprovalHistory";
import Transactions from "./pages/Investor/Transactions";
import ViewSeniorPool from "./pages/Investor/ViewSeniorPool";
import Transaction from "./pages/Borrower/Transaction";
import BorrowerProfile from "./pages/Borrower/BorrowerProfile";
import EditBorrowerProfile from "./pages/Borrower/EditBorrowerProfile";
import UnderwriterQueries from "./pages/Borrower/UnderwriterQueries";
import QueriesPoolDetails from "./pages/Borrower/QueriesPoolDetails";

//reducer
import { initialState, reducer } from "./reducer/UseReducer";
//

export const UserContext = createContext(); //

const Paths = () => {
	const [state, dispatch] = useReducer(reducer, initialState); //

	return (
		<HashRouter>
			<UserContext.Provider value={{ state, dispatch }}>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/token" element={<Token />} />

					{/* // rename */}
					<Route path="/investor-dashboard" element={<InvestorDashboard />}>
						<Route index element={<InvestorOverview />} />
						<Route path="invest" element={<Invest />} />
						<Route path="withdraw" element={<Withdraw />} />
						<Route path="transaction" element={<Transactions />} />
						<Route path="viewPool" element={<ViewPool />} />
						<Route path="viewSeniorPool" element={<ViewSeniorPool />} />
					</Route>

					<Route
						path="/underwriterDashboard"
						element={<UnderwriterDashboard />}
					>
						<Route index element={<BorrowRequest />} />
						<Route path="poolDetail" element={<PoolDetails />} />
						<Route path="approvalHistory" element={<ApprovalHistory />} />
					</Route>

					<Route path="/borrower_dashboard" element={<BorrowerDashboard />}>
						<Route index element={<Overview />} />

						<Route path="borrow_list" element={<BorrowList />} />
						<Route path="transaction" element={<Transaction />} />
						<Route path="borrower_profile" element={<BorrowerProfile />} />
						<Route path="underwriterQueries" element={<UnderwriterQueries />} />
						<Route path="queriesPoolDetail" element={<QueriesPoolDetails />} />

						<Route path="edit_profile" element={<EditBorrowerProfile />} />
					</Route>
				</Routes>
			</UserContext.Provider>
		</HashRouter>
	);
};

export default Paths;
