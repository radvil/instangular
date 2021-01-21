export const sortByDate = (dateOne: any, dateTwo: any, sortType = 'asc'): number => {
  if (sortType === 'asc') {
    return dateOne.toString().localeCompare(dateTwo.toString());
  }
  if (sortType === 'desc') {
    return dateTwo.toString().localeCompare(dateOne.toString());
  }
}