export function shuffle(arr) {
  return [...arr].sort((a, b) => Math.random() - 0.5)
}
