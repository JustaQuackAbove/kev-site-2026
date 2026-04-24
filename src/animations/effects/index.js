import { growEffect } from './grow.js'
import { slideEffect } from './slide.js'
import { spinEffect } from './spin.js'

export const effects = [slideEffect, growEffect, spinEffect]

export function applyEffectProgress(element, progress) {
  effects.forEach((effect) => {
    if (element.classList.contains(effect.className)) {
      effect.applyProgress(element, progress)
    }
  })

  element.classList.toggle('is-active', progress > 0)
}
