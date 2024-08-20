export default function formatDate(dateString, format) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // months are 0-based
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  switch (format) {
    case "yyyy-mm-dd":
      return `${year}-${padZero(month)}-${padZero(day)}`;
    case "dd-mm-yyyy":
      return `${padZero(day)}-${padZero(month)}-${year}`;
    case "dd-mon":
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${padZero(day)}-${monthNames[month - 1]}`;
    case "hh24:mm:ss":
      return `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
    default:
      return "";
  }
}

function padZero(value) {
  return (value < 10 ? "0" : "") + value;
}
