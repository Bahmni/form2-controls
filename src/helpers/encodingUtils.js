import { decode } from "html-entities";

export function unescapeHtml(str) {
  if (typeof str !== "string") return str;
  return decode(str);
}

export function deepUnescapeStrings(obj) {
  if (typeof obj === "string") {
    return unescapeHtml(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deepUnescapeStrings);
  }
  if (typeof obj === "object" && obj !== null) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = deepUnescapeStrings(obj[key]);
    }
    return result;
  }
  return obj;
}

export function utf8ToBase64(str) {
  if (str === undefined || str === null || str === "") {
    return "";
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  const binaryString = String.fromCharCode.apply(null, data);
  return btoa(binaryString);
}

// Decides from the string's shape whether it is base64. Plain JS source contains
// characters outside the base64 alphabet (spaces, parentheses, braces, ...).
export function isBase64(str) {
  if (typeof str !== "string") return false;
  const compact = str.replace(/\s/g, "");
  return compact.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(compact);
}

export function base64ToUtf8(b64) {
  if (b64 === undefined || b64 === null || b64 === "") {
    return "";
  }
  try {
    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (e) {
    console.error("Error decoding base64 string:", e);
    return "";
  }
}
