export const isUndefined = (val: any): val is undefined => val === undefined;
export const isString = (val: any): val is string => typeof val === 'string';

export const ensureArray = (value: any) => (Array.isArray(value) ? (value || []) : [value]);
