export function titleCase(str?: string): string {
  if (!str) {
    return '';
  }
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}
