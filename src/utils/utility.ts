export const formatted = (inputDate: Date): string => {
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(inputDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatTime = (timeInt : number): string => {
    if (typeof timeInt !== 'number' || isNaN(timeInt)) {
        return 'Invalid time';
    }
            
    const hours = Math.floor(timeInt / 100);
    const minutes = timeInt % 100;
            
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
            
    return `${paddedHours}:${paddedMinutes}`;
};