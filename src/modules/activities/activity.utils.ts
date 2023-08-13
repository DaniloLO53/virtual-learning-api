export function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('-');

  return new Date(`${year}-${month}-${day}T00:00:00`);
}
