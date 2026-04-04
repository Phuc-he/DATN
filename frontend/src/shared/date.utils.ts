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