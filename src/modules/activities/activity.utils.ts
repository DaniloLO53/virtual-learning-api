export function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('-');

  return new Date(`${year}-${month}-${day}T00:00:00`);
}

export function convertDate(inputDate: string) {
  const months = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };

  const dateParts = inputDate.split(' ');
  const day = dateParts[2];
  const month = months[dateParts[1]];
  const year = dateParts[3];
  const time = dateParts[4];

  const [hour, min, sec] = time.split(':');

  const formattedDate = `${day}-${month}-${year}-${hour}-${min}-${sec}`;
  return formattedDate;
}
