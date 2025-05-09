export const formatted = (inputDate: Date) => {
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-based
  const day = String(inputDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};