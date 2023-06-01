/* eslint-disable import/prefer-default-export */
const deepCopy = (obj: object) => JSON.parse(JSON.stringify(obj))
const isNumStr = (strNum: string) => /^\d+.?\d*$/.test(strNum)

export { deepCopy, isNumStr }
