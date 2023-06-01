import moment from "moment";

export const dateFormatter = (dt: string) => {
  if (!dt) return dt;
  return moment(dt).format('DD MMM YYYY')
}

export const standardizeDate = (dt: string) => {
  if (!dt) return dt;
  return moment(dt).format('MM/DD/YYYY')
}


export const monthFirstDateFormat = (dt: string) => {
  if (!dt) return dt;
  return moment(dt).format('MMMM DD, YYYY')
}

export const getDateFromString = (dt: string) => {
  if (!dt) return null;
  try {
    return moment(dt).toDate()
  } catch (e) {
    return null
  }
}

export const parseNativeDate = (dt: Date) => {
  return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`
}