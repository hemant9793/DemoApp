export function generateSimpleIdFromName(name: string): string | null {
  if (!name || typeof name !== 'string') {
    return null; // Handle invalid input
  }

  // 1. Append a fixed string.
  let id = name + '1234';

  // 2.  Basic character code manipulation (for very slight obfuscation).
  let modifiedId = '';
  for (let i = 0; i < id.length; i++) {
    const charCode = id.charCodeAt(i);
    // Simple Caesar cipher-like shift (add 3 to each character code)
    const shiftedCode = charCode + 3;
    modifiedId += String.fromCharCode(shiftedCode);
  }
  id = modifiedId;

  // 3.  Add a length component
  id = id + '-' + id.length;

  return id;
}

export function extractNameFromSimpleId(id?: string): string | null {
  if (!id || typeof id !== 'string') {
    return null;
  }

  // 1. Remove the length suffix
  const lastDashIndex = id.lastIndexOf('-');
  if (lastDashIndex === -1) {
    return null;
  }

  let obfuscated = id.substring(0, lastDashIndex);

  // 2. Reverse Caesar cipher (subtract 3)
  let decoded = '';
  for (let i = 0; i < obfuscated.length; i++) {
    const charCode = obfuscated.charCodeAt(i);
    const originalCode = charCode - 3;
    decoded += String.fromCharCode(originalCode);
  }

  // 3. Remove the appended '1234'
  if (!decoded.endsWith('1234')) {
    return null;
  }

  const originalName = decoded.slice(0, -4); // Remove last 4 characters ('1234')

  return originalName;
}

export function formatDate(dateObj: Date) {
  const day = dateObj.getDate();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
}
