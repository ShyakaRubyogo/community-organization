/**
 * Deep merge utility for CMS state.
 * Strictly adheres to Array Replacement Semantics:
 * When an incoming CMS object contains an array, that array REPLACES
 * the default seed array entirely rather than concatenating or merging items element-wise.
 */
export function deepMergeCms<T>(defaultSeed: T, incomingCms: any): T {
  if (incomingCms === null || incomingCms === undefined) {
    return defaultSeed;
  }

  // If the incoming value itself is an array, it replaces the seed array
  if (Array.isArray(incomingCms)) {
    return incomingCms as any;
  }

  // If incoming is not an object (primitive), return it
  if (typeof incomingCms !== 'object') {
    return incomingCms;
  }

  const result: any = Array.isArray(defaultSeed) ? [...defaultSeed] : { ...defaultSeed };

  for (const key of Object.keys(incomingCms)) {
    const incomingVal = incomingCms[key];
    const defaultVal = (defaultSeed as any)?.[key];

    if (incomingVal === undefined) {
      continue;
    }

    if (Array.isArray(incomingVal)) {
      // RULE: Arrays from CMS strictly replace arrays from seed
      result[key] = [...incomingVal];
    } else if (incomingVal !== null && typeof incomingVal === 'object') {
      result[key] = deepMergeCms(defaultVal || {}, incomingVal);
    } else {
      result[key] = incomingVal;
    }
  }

  return result;
}
