'use strict'
export default expand
import '../../polyfills_x.js'
import createDatetime from '../../lib/create-datetime.js'
import createDatetimeFloat from '../../lib/create-datetime-float.js'
import createDate from '../../lib/create-date.js'
import createTime from '../../lib/create-time.js'

function expand (obj) {
  const result = {}
  Object.keys(obj).forEach(key => {
    result[key] = expandValue(obj[key])
  })
  return result
}

function expandValue (val) {
  if (Array.isArray(val)) {
    return val.map(_ => expandValue(_))
  } else if (val.type === 'array') {
    return val.value.map(_ => expandValue(_))
  } else if (val.type === 'datetime') {
    return createDatetime(val.value)
  } else if (val.type === 'datetime-local') {
    return createDatetimeFloat(val.value)
  } else if (val.type === 'date') {
    return createDate(val.value)
  } else if (val.type === 'time') {
    return createTime(val.value)
  } else if (val.type === 'string') {
    return val.value
  } else if (val.type === 'float') {
    return Number(val.value)
  } else if (val.type === 'integer') {
    if (global.BigInt && !Number.isSafeInteger(Number(val.value))) {
      return global.BigInt(val.value)
    } else {
      return Number(val.value)
    }
  } else if (val.type === 'bool') {
    return val.value === 'true'
  } else if (!('type' in val)) {
    return expand(val)
  } else {
    throw new Error('Unknown type: ' + val.type)
  }
}
