import { applyEffectProgress } from './effects/index.js'

function readTime(value, fallback = '450ms') {
  if (!value) {
    return fallback
  }

  return /^\d+(\.\d+)?$/.test(value) ? `${value}ms` : value
}

function readThreshold(value, fallback = 0.35) {
  const threshold = Number(value)

  if (!Number.isFinite(threshold)) {
    return fallback
  }

  return Math.min(1, Math.max(0, threshold))
}

function setAnimationOptions(element) {
  element.style.setProperty('--animation-duration', readTime(element.dataset.duration))
  element.style.setProperty('--animation-easing', element.dataset.easing ?? 'ease')
}

function setupClickTrigger(element) {
  setAnimationOptions(element)
  applyEffectProgress(element, 0)

  if (!element.hasAttribute('tabindex')) {
    element.tabIndex = 0
  }

  if (!element.hasAttribute('role')) {
    element.setAttribute('role', 'button')
  }

  const toggle = () => {
    applyEffectProgress(element, element.classList.contains('is-active') ? 0 : 1)
  }

  element.addEventListener('click', toggle)
  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    toggle()
  })
}

function setupScrollTrigger(element) {
  setAnimationOptions(element)
  applyEffectProgress(element, 0)

  const threshold = readThreshold(element.dataset.scrollThreshold, 0.35)
  const scrollOnce = element.dataset.scrollOnce === 'true'

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        if (!scrollOnce) {
          applyEffectProgress(element, 0)
        }

        return
      }

      applyEffectProgress(element, 1)

      if (scrollOnce) {
        observer.unobserve(element)
      }
    },
    { threshold },
  )

  observer.observe(element)
}

export function initAnimations() {
  document.querySelectorAll('.animate-on-click').forEach(setupClickTrigger)
  document.querySelectorAll('.animate-on-scroll').forEach(setupScrollTrigger)
}
