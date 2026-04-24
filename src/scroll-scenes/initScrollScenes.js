import { applyEffectProgress } from '../animations/effects/index.js'

let hasAttachedListeners = false
const scenes = []

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function readNumber(value, fallback) {
  const number = Number(value)

  return Number.isFinite(number) ? number : fallback
}

function readProgressValue(value, fallback) {
  const number = readNumber(value, fallback)
  const normalized = number > 1 ? number / 100 : number

  return clamp(normalized)
}

function mapSceneProgress(rawProgress, start, end) {
  if (end <= start) {
    return rawProgress >= end ? 1 : 0
  }

  return clamp((rawProgress - start) / (end - start))
}

function updateScenes() {
  scenes.forEach(({ scene, items, start, end }) => {
    const rect = scene.getBoundingClientRect()
    const distance = rect.height - window.innerHeight
    const rawProgress = distance <= 0 ? (rect.top < 0 ? 1 : 0) : clamp(-rect.top / distance)
    const progress = mapSceneProgress(rawProgress, start, end)

    items.forEach((item) => applyEffectProgress(item, progress))
    scene.style.setProperty('--scene-progress', progress.toFixed(3))
  })
}

export function initScrollScenes() {
  const sceneElements = [...document.querySelectorAll('[data-scroll-scene]')]

  if (sceneElements.length === 0) {
    return
  }

  scenes.length = 0
  sceneElements.forEach((scene) => {
    const sceneLength = readNumber(scene.dataset.sceneLength, 260)
    const sceneStart = scene.dataset.sceneStartHold === undefined
      ? readProgressValue(scene.dataset.sceneStart, 0)
      : readProgressValue(scene.dataset.sceneStartHold, 0)
    const sceneEnd = scene.dataset.sceneEndHold === undefined
      ? readProgressValue(scene.dataset.sceneEnd, 1)
      : 1 - readProgressValue(scene.dataset.sceneEndHold, 0)

    scene.style.setProperty('--scene-length', `${sceneLength}vh`)
    scenes.push({
      scene,
      items: [...scene.querySelectorAll('[data-scene-item]')],
      start: sceneStart,
      end: sceneEnd,
    })
  })

  updateScenes()

  if (hasAttachedListeners) {
    return
  }

  window.addEventListener('scroll', updateScenes, { passive: true })
  window.addEventListener('resize', updateScenes)
  hasAttachedListeners = true
}
