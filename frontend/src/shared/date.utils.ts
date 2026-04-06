export const formatMessageTime = (dateInput?: string | Date) => {
  if (!dateInput) return '';

  let date: Date;

  if (dateInput instanceof Date) {
    // If it's already a Date object, use it directly
    date = dateInput;
  } else {
    // If it's a string, normalize the precision issue
    // (Fixes the "Invalid Date" for 5-digit fractional seconds)
    const normalized = dateInput.includes('.') ? dateInput.split('.')[0] : dateInput;
    date = new Date(normalized);
  }

  return isNaN(date.getTime()) 
    ? '' 
    : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseServerDate = (dateData: any): number | null => {
  if (Array.isArray(dateData)) {
    // Note: JS Months are 0-indexed (Jan = 0), but usually API arrays use 1-indexed (Jan = 1)
    const [year, month, day, hour, minute, second, nano] = dateData;
    return new Date(year, month - 1, day, hour, minute, second, nano / 1000000).getTime();
  }
  if (typeof dateData === 'string') {
    return new Date(dateData).getTime();
  }
  return null;
};