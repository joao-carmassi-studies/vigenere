const ALPHABET_SIZE = 26;
const UPPER_A = 65;
const LOWER_A = 97;

function isUpperCase(char: string): boolean {
  return char >= 'A' && char <= 'Z';
}

function isLowerCase(char: string): boolean {
  return char >= 'a' && char <= 'z';
}

function normalizeKey(key: string): string {
  return key.replace(/[^a-zA-Z]/g, '').toLowerCase();
}

export function encrypt(plaintext: string, key: string): string {
  const normalizedKey = normalizeKey(key);
  if (normalizedKey.length === 0) return plaintext;

  let keyIndex = 0;
  let result = '';

  for (const char of plaintext) {
    if (isUpperCase(char)) {
      const shift =
        normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - LOWER_A;
      const shifted =
        (((char.charCodeAt(0) - UPPER_A + shift) % ALPHABET_SIZE) +
          ALPHABET_SIZE) %
        ALPHABET_SIZE;
      result += String.fromCharCode(shifted + UPPER_A);
      keyIndex++;
    } else if (isLowerCase(char)) {
      const shift =
        normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - LOWER_A;
      const shifted =
        (((char.charCodeAt(0) - LOWER_A + shift) % ALPHABET_SIZE) +
          ALPHABET_SIZE) %
        ALPHABET_SIZE;
      result += String.fromCharCode(shifted + LOWER_A);
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
}

export function decrypt(ciphertext: string, key: string): string {
  const normalizedKey = normalizeKey(key);
  if (normalizedKey.length === 0) return ciphertext;

  let keyIndex = 0;
  let result = '';

  for (const char of ciphertext) {
    if (isUpperCase(char)) {
      const shift =
        normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - LOWER_A;
      const shifted =
        (((char.charCodeAt(0) - UPPER_A - shift) % ALPHABET_SIZE) +
          ALPHABET_SIZE) %
        ALPHABET_SIZE;
      result += String.fromCharCode(shifted + UPPER_A);
      keyIndex++;
    } else if (isLowerCase(char)) {
      const shift =
        normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - LOWER_A;
      const shifted =
        (((char.charCodeAt(0) - LOWER_A - shift) % ALPHABET_SIZE) +
          ALPHABET_SIZE) %
        ALPHABET_SIZE;
      result += String.fromCharCode(shifted + LOWER_A);
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
}
