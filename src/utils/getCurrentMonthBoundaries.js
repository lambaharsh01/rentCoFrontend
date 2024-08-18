import moment from "moment";

export default function getCurrentMonthBoundaries() {
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

  return {
    fromDate: startOfMonth,
    toDate: endOfMonth,
  };
}
