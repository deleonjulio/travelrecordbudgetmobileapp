
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


function getRelativeLuminance(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;

  // Calculate relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
}

export function determineTextColor(backgroundHexColor) {
  // Set a threshold for deciding whether to use white or black text
  const threshold = 0.65;

  // Get relative luminance of the background color
  const backgroundLuminance = getRelativeLuminance(backgroundHexColor);

  // Determine text color based on background luminance
  const textColor = backgroundLuminance > threshold ? '#000000' : '#ffffff';

  return textColor;
}