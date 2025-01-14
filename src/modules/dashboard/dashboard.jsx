import Header from "../../components/header";
import Footer from "../../components/footer";
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
