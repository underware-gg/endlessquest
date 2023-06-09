export class CONST {
  static PI = Math.PI;
  static TWO_PI = Math.PI * 2;
  static HALF_PI = Math.PI * 0.5;
  static QUATER_PI = Math.PI * 0.25;
  static DEGREES_PER_RADIANS = (180 / Math.PI);
}

export const deepCopy = (/** @type {any} */ data) => JSON.parse(JSON.stringify(data))
export const deepCompare = (/** @type {any} */ a, /** @type {any} */ b) => JSON.stringify(a) === JSON.stringify(b)
export const roundToNearest = (/** @type {number} */ value, /** @type {number} */ nearest) => Math.round(value / nearest) * nearest
export const lerp = (/** @type {number} */ v, /** @type {number} */ min, /** @type {number} */ max) => (min + (max - min) * v)
export const map = (/** @type {number} */ v, /** @type {number} */ inMin, /** @type {number} */ inMax, /** @type {number} */ outMin, /** @type {number} */ outMax) => (outMin + (outMax - outMin) * ((v - inMin) / (inMax - inMin)))
export const clamp = (/** @type {number} */ value, /** @type {number} */ min, /** @type {number} */ max) => Math.min(Math.max(value, min), max)
export const clampRadians = (/** @type {any} */ angle) => {
  let result = angle
  while (result < 0) result += CONST.TWO_PI
  while (result > CONST.TWO_PI) result -= CONST.TWO_PI
  return result
}
export const toDegrees = (/** @type {number} */ r) => (Math.floor(r * CONST.DEGREES_PER_RADIANS))
export const toRadians = (/** @type {number} */ d) => (d / CONST.DEGREES_PER_RADIANS)

export const getFilenameFromUrl = (/** @type {string} */ url) => {
  return url?.split('/')?.slice(-1)?.[0] ?? null
}

export const getFilenameExtensionFromUrl = (/** @type {any} */ url) => {
  const filename = getFilenameFromUrl(url)
  if(!filename) return null
  const parts = filename.split('.')
  return parts.length >= 2 ? parts.slice(-1)[0].toLowerCase() : null
}


export const throttle = (/** @type {(arg0: any) => void} */ cb, delay = 1000) => {
  let shouldWait = false
  /**
   * @type {any[] | null}
   */
  let waitingArgs
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false
    } else {
      // @ts-ignore
      cb(...waitingArgs)
      waitingArgs = null
      setTimeout(timeoutFunc, delay)
    }
  }

  return (/** @type {any} */ ...args) => {
    if (shouldWait) {
      waitingArgs = args
      return
    }

    // @ts-ignore
    cb(...args)
    shouldWait = true
    setTimeout(timeoutFunc, delay)
  }
}

const isObject = (/** @type {any} */ item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
// @ts-ignore
export const deepMerge = (/** @type {{ [x: string]: any; }} */ target, /** @type {any[]} */ ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }
  return deepMerge(target, ...sources);
}

export const hashCode = function (/** @type {string} */ s) {
  return s.split('').reduce(function (/** @type {number} */ a, /** @type {string} */ b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}

export const validateRoomSlug = (/** @type {string} */ slug) => {
  if (!slug) return false
  return /^[a-zA-Z0-9-+_]+$/.test(slug)
}
