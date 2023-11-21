export { parse } from "std/flags/mod.ts"
export { crypto, type DigestAlgorithm } from 'std/crypto/mod.ts'
export { decode, encode } from 'std/encoding/base64.ts'
export { decodeHex, encodeHex, } from "std/encoding/hex.ts";

// String.prototype._Seed = _seedConfig.seed
Number.prototype.isOdd = function() { return this.valueOf() % 2 === 1 }