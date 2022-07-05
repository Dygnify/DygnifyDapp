import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Borrow from "./borrow/Borrow";
import Home from "./home/Home";
import Token from "./home/Token";
import Mobile from "./customer/onboarding/Mobile";
import VerifyNumber from "./customer/onboarding/VerifyNumber";
import ChooseLanguage from "./customer/onboarding/ChooseLanguage";
import LoadingScreen from "./customer/onboarding/LoadingScreen";
import LocationPermission from "./customer/onboarding/LocationPermission";
import Overview from "./mock/components/overview/Overview";
import Test from "./mock/Test";
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
import PanUpload from './customer/onboarding/panProofComponents/PanUpload'
import BusinessProof from "./customer/onboarding/BusinessProof";
import BusinessOption from "./customer/onboarding/BusinessOption";
import Borrower from "./borrower/Borrower";
import Drawdown from "./borrower/Drawdown";
import LoadApp from "./home/LoadApp";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/pool" component={Home} />
        <Route exact path="/borrow" component={Borrow} />
        <Route exact path="/token" component={Token} />
        <Route exact path="/test" component={Test} />
        <Route exact path="/overview" component={Overview} />
        <Route exact path="/sign" component={DashboardMain} />
        <Route exact path="/landing" component={LandingPage} />
        <Route exact path="/info" component={CompanyInfo} />
        <Route exact path="/kyc" component={KYC} />
        <Route exact path="/wallet" component={Wallet} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/disbursement" component={Disbursement} />
        <Route exact path="/sale" component={PanProof} />
        <Route exact path="/pan" component={PanUpload} />
        <Route exact path="/mobile" component={Mobile} />
        <Route exact path="/VerifyNumber" component={VerifyNumber} />
        <Route exact path="/Borrower" component={Borrower} />
        <Route exact path="/Drawdown" component={Drawdown} />
        <Route exact path="/LoadApp" component={LoadApp} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
