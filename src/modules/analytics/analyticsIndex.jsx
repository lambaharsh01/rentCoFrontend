import Header from "../../components/header";
import Footer from "../../components/footer";

import ConsolidatedTransactions from "../../components/consolidatedTransactions";
import AnalyticsGraph from "../../components/graphs/analyticsGraph";
import ElectricityConsumptionGraph from "../../components/graphs/electricityConsumptionGraph";

export default function AnalyticsIndex() {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header active="a" />

      <div className="flex-grow">
        <AnalyticsGraph/>
        <ElectricityConsumptionGraph/>
        <ConsolidatedTransactions/>
      </div>   

      <Footer active="a" />
    </div>
  );
}
