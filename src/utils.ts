function hierarchyFields(fields: string[] | undefined) {
  if (!fields) return undefined;
  const extractedFields = [];
  for (const field of fields) {
    extractedFields.push(field.substring(field.indexOf('.') + 1));
  }
  return extractedFields;
}

export function isObj(obj: any) {
  return !!obj && typeof obj === 'object' && !Array.isArray(obj);
}

export function isArray(obj: any) {
  return !!obj && Array.isArray(obj);
}

export function isString(obj: any) {
  return typeof obj === 'string' || obj instanceof String;
}

export function traverseObj(obj: any, fields: string[] | undefined, fn: (obj: Object) => any) {
  if (!isObj(obj)) {
    return fn(obj);
  }
  let returnObject = structuredClone(obj);
  for (const key in obj) {
    // check if the fields was defined AND no matched fields in data
    if (!!fields && fields.every((field) => !field.startsWith(key))) {
      continue;
    }
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    const value = obj[key];
    if (isObj(value)) {
      returnObject[key] = traverseObj(value, hierarchyFields(fields), fn);
    } else if (isString(value)) {
      const decryptedValue = fn(value);
      returnObject[key] = decryptedValue;
    } else if (isArray(value)) {
      let decryptedArray: any[] = [];
      for (const item of value) {
        decryptedArray.push(traverseObj(item, hierarchyFields(fields), fn));
      }
      returnObject[key] = decryptedArray;
    }
  }
  return returnObject;
}
