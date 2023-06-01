import moment from "moment";

export const dateFormatter = (dt: string) => {
  if (!dt) return dt;
  return moment(dt).format('MMM DD, YYYY')
}

export const standardizeDate = (dt: string) => {
  if (!dt) return dt;
  return moment.parseZone(dt).format('MM/DD/YYYY')
}

export const standardizeDateForApi = (dt: string) => {
  if (!dt) return dt;
  return moment.parseZone(dt).format('YYYY-MM-DD')
}

export const formatDateTime = (dt: string) => {
  if (!dt) return dt;
  return moment(dt).format('MMM DD, HH:mm')
}

export const getMonthYear = (dt: string) => {
  if (!dt) return dt;
  return moment(dt).format('MMM DD')
}