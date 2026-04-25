import { growEffect } from './grow.js'
import { slideEffect } from './slide.js'
import { spinEffect } from './spin.js'

export const effects = [slideEffect, growEffect, spinEffect]

function clampProgress(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return 0
  }

  return Math.min(1, Math.max(0, number))
}

function readTime(value, fallback = '450ms') {
  if (!value) {
    return fallback
  }

  return /^\d+(\.\d+)?$/.test(value) ? `${value}ms` : value
}

function applyAnimationOptions(element) {
  element.style.setProperty('--animation-duration', readTime(element.dataset.duration))
  element.style.setProperty('--animation-easing', element.dataset.easing ?? 'ease')
}

export function applyEffectProgress(element, progress) {
  const normalizedProgress = clampProgress(progress)

  applyAnimationOptions(element)

  effects.forEach((effect) => {
    if (element.classList.contains(effect.className)) {
      effect.applyProgress(element, normalizedProgress)
    }
  })

  element.classList.toggle('is-active', normalizedProgress > 0)
}
