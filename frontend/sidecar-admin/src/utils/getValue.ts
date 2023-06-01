import get from "lodash/get";
import isNil from "lodash/isNil";

export const getValueWithDefault = (obj: any, key: string, defaultValue: any) => {
  if(!defaultValue) defaultValue = '';
  const value = get(obj, key, defaultValue)
  if (isNil(value)) return defaultValue;
  return value;
}