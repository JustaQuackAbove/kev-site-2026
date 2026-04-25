function readNumber(value, fallback) {
  const number = Number(value)

  return Number.isFinite(number) ? number : fallback
}

function readLength(value, fallback = '0px') {
  if (value === undefined || value === null || value === '') {
    return fallback
  }

  return /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value
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
    if (element.dataset.x !== undefined || element.dataset.y !== undefined) {
      const x = progress > 0
        ? readLength(element.dataset.x)
        : readLength(element.dataset.fromX, readLength(element.dataset.x))
      const y = progress > 0
        ? readLength(element.dataset.y)
        : readLength(element.dataset.fromY, readLength(element.dataset.y))

      element.style.setProperty('--position-x', x)
      element.style.setProperty('--position-y', y)
      element.style.setProperty('--move-x', '0px')
      element.style.setProperty('--move-y', '0px')
      return
    }

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
