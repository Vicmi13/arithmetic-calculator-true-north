export const sanitizeDate = (originalDate) => {
  if (typeof originalDate === "string") {
    const [date, time] = originalDate.split(" ");
    const formatDate = date.split("-").reverse().join("-");
    const [hours, minutes] = time.split(":");
    return `${formatDate} ${hours}:${minutes}`;
  } else return "--";
};
