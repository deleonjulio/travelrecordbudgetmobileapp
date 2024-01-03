
export const getDaysLeft = (initialStartDate, initialEndDate) => {
  // Create Date objects for the two dates
  const startDate = new Date(initialStartDate);
  const endDate = new Date(initialEndDate);

  // Calculate the difference in milliseconds
  const timeDifference = endDate - startDate;

  // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const daysDifference = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
  return daysDifference;
};

export const moneyFormat = initialNumber => {
  const numberString = (initialNumber / 100).toString();

  const formattedNumber = parseFloat(numberString).toLocaleString('en', {
    useGrouping: true, // Use a thousand separator
    minimumFractionDigits: 2, // Ensure at least 2 decimal places
    maximumFractionDigits: 2, // Ensure at most 2 decimal places
  });

  return formattedNumber;
};
