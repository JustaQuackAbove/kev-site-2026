function readNumber(value, fallback) {
  const number = Number(value)

  return Number.isFinite(number) ? number : fallback
}

function mix(start, end, progress) {
  return start + (end - start) * progress
}

export const spinEffect = {
  className: 'effect-spin',
  apply(element, isActive) {
    this.applyProgress(element, isActive ? 1 : 0)
  },
  applyProgress(element, progress) {
    const fromRotation = readNumber(element.dataset.fromRotation, 0)
    const toRotation = readNumber(element.dataset.rotation, 180)
    const rotation = mix(fromRotation, toRotation, progress)

    element.style.setProperty('--rotation', `${rotation}deg`)
  },
}
