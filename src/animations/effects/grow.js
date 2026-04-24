function readNumber(value, fallback) {
  const number = Number(value)

  return Number.isFinite(number) ? number : fallback
}

function mix(start, end, progress) {
  return start + (end - start) * progress
}

export const growEffect = {
  className: 'effect-grow',
  apply(element, isActive) {
    this.applyProgress(element, isActive ? 1 : 0)
  },
  applyProgress(element, progress) {
    const fromScale = readNumber(element.dataset.fromScale, 1)
    const toScale = readNumber(element.dataset.scale, 1.25)
    const scale = mix(fromScale, toScale, progress)

    element.style.setProperty('--scale', String(scale))
  },
}
