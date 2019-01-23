export default function now(): number {
  if (Date.now) {
    return Date.now();
  }
  return new Date().getTime();
}
