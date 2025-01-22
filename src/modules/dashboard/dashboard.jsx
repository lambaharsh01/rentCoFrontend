import Header from "../../components/header";
import Footer from "../../components/footer";
import MonthlyRentTrends from "../../components/graphs/monthlyRentTrend";
import VisitComponent from "../../components/visitComponent";
import TransactionComponent from "../../components/transactionComponent";
import AllTenantsComponent from "../../components/allTenantsComponent";

export default function Dashboard() {
  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Header active="d" />
      <div className="flex-grow">
      <br />
      <MonthlyRentTrends /> 
          
      <TransactionComponent />
      <br/>
      <VisitComponent />
      <br/>
      <br/>
      <AllTenantsComponent />
      </div>
    </div>
    <Footer active="d"/>
    </>
  );
}
