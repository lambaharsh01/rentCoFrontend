import moment from "moment";


export const currentDate = ()=>{
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}


export const getCurrentYearBoundaries = () => {
  const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
  const endOfYear = moment().endOf("year").format("YYYY-MM-DD");

  return {
    fromDate: startOfYear,
    toDate: endOfYear,
  };
}

export const currentMinusNMonth = (n) => {
    // Calculate the first date of the month, 7 months before the current month
    const fromDate = moment().subtract(n, "months").startOf("month").format("YYYY-MM-DD");
  
    // Calculate the last date of the current month
    const toDate = moment().endOf("month").format("YYYY-MM-DD");
  
    return {
      fromDate,
      toDate,
    };
  }

