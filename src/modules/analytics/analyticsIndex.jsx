import Header from "../../components/header";
import Footer from "../../components/footer";


import ConsolidatedTransactions from "../../components/consolidatedTransactions";

export default function AnalyticsIndex() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header active="a" />

      <div className="flex-grow">
      <ConsolidatedTransactions/>
      </div>      
      <Footer active="a" />
    </div>
  );
}
