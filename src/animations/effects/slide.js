function readNumber(value, fallback) {
  const number = Number(value)

  return Number.isFinite(number) ? number : fallback
}

function mix(start, end, progress) {
  return start + (end - start) * progress
}

export const slideEffect = {
  className: 'effect-slide',
  apply(element, isActive) {
    this.applyProgress(element, isActive ? 1 : 0)
  },
  applyProgress(element, progress) {
    const fromX = readNumber(element.dataset.fromSlideX, 0)
    const toX = readNumber(element.dataset.slideX, 120)
    const fromY = readNumber(element.dataset.fromSlideY, 0)
    const toY = readNumber(element.dataset.slideY, 0)
    const x = mix(fromX, toX, progress)
    const y = mix(fromY, toY, progress)

    element.style.setProperty('--move-x', `${x}px`)
    element.style.setProperty('--move-y', `${y}px`)
  },
}
