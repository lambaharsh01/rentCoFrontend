import Header from "../../components/header";
import VisitComponent from "../../components/visitComponent";
import TransactionComponent from "../../components/transactionComponent";
import AllTenantsComponent from "../../components/allTenantsComponent";

export default function Dashboard() {
  return (
    <div>
      <Header active="d" />
      <br/>
      <TransactionComponent />
      <br/>
      <VisitComponent />
      <br/>
      <br/>
      <AllTenantsComponent />
    </div>
  );
}
