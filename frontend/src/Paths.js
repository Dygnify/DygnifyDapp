import React from "react";
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import Borrow from "./borrow/Borrow";
import Home from "./home/Home";
import Token from "./home/Token";
import Mobile from "./customer/onboarding/Mobile";
import VerifyNumber from "./customer/onboarding/VerifyNumber";
import ChooseLanguage from "./customer/onboarding/ChooseLanguage";
import LoadingScreen from "./customer/onboarding/LoadingScreen";
import LocationPermission from "./customer/onboarding/LocationPermission";
// import Overview from "./mock/components/overview/Overview";
import SignIn from "./user/SignIn";
import DashboardMain from "./user/DashboardMain";
import Logout from "./user/Logout";
import DashboardRepayment from "./user/DashboardRepayment";
import LoanStatement from "./user/LoanStatement";
import DashboardReview from "./user/DashboardReview";
import LandingPage from "./investor/LandingPage";
import CompanyInfo from "./investor/CompanyInfo";
import KYC from "./investor/KYC";
import Wallet from "./investor/Wallet";
import Dashboard from "./investor/Dashboard";
import Disbursement from "./investor/Disbursement";
import Welcome from "./customer/onboarding/Welcome";
import Docs from "./customer/onboarding/Docs";
import PanOption from "./customer/onboarding/PanOption";
import PanProof from "./customer/onboarding/PanProof";
import PanUpload from "./customer/onboarding/panProofComponents/PanUpload";
import BusinessProof from "./customer/onboarding/BusinessProof";
import BusinessOption from "./customer/onboarding/BusinessOption";
import Borrower from "./borrower/Borrower";
import Drawdown from "./borrower/Drawdown";
import LoadApp from "./home/LoadApp";
import AuditorDashboard from "./auditor/AuditorDashboard";
import LoanForm from "./pages/LoanForm/LoanForm";
import OpportunityDetails from "./pages/OpportunityDetails/OpportunityDetails";
import OpportunityPage from "./pages/OpportunityDetails/OpportunityPage";
import Test from "./pages/LoanForm/Test";
import InvestorDashboard from "./pages/Investor/InvestorDashboard";
import ApprovedOpportunities from "./pages/Investor/ApprovedOpportunities";
import Repayment from "./borrower/Repayment";
import Withdrawal from "./pages/Investor/Withdrawal";
import Transaction from "./components/transaction/Transaction";
import TransactionHistory from "./components/transactionHistory/TransactionHistory";
import ToolTest from "./tools/ToolTest";
import BorrowerDashboard from "./pages/Borrower/BorrowerDashboard";
import Overview from "./pages/Borrower/Overview";
import BorrowList from "./pages/Borrower/BorrowList";

const Paths = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pool" element={<Home />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/token" element={<Token />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/sign" element={<DashboardMain />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/info" element={<CompanyInfo />} />
        <Route path="/info/:id" element={<CompanyInfo />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/disbursement" element={<Disbursement />} />
        <Route path="/sale" element={<PanProof />} />
        <Route path="/pan" element={<PanUpload />} />
        <Route path="/mobile" element={<Mobile />} />
        <Route path="/VerifyNumber" element={<VerifyNumber />} />
        <Route path="/Borrower" element={<Borrower />} />
        <Route path="/drawdown/:id" element={<Drawdown />} />
        <Route path="/repayment/:id" element={<Repayment />} />
        <Route path="/withdrawal/:id" element={<Withdrawal />} />
        <Route path="/LoadApp" element={<LoadApp />} />
        <Route path="/auditor" element={<AuditorDashboard />} />
        <Route path="/loan-form" element={<LoanForm />} />
        <Route path="/test" element={<Test />} />
        <Route path="/opportunities" element={<OpportunityPage />} />
        <Route
          path="/opportunity-details/:id"
          element={<OpportunityDetails />}
        />
        <Route path="/loan-details/:id" element={<ApprovedOpportunities />} />
        <Route path="/investor-dashboard" element={<InvestorDashboard />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/toolTest" element={<ToolTest />} />
        <Route path="/borrower_dashboard" element={<BorrowerDashboard />}>
          <Route index element={<Overview></Overview>}></Route>
          <Route path="borrow_list" element={<BorrowList></BorrowList>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Paths;
