import { bindDioramaElements } from './bindElements.js'
import { getState, goToPage, initSceneState, next, prev, subscribe } from './sceneState.js'

let cleanupActiveDiorama = null

function readPageCount(root) {
  const pageCount = Number(root.dataset.pageCount)

  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error('Diorama scenes require data-page-count on the root element.')
  }

  return pageCount
}

function setupAdvanceControls(root) {
  const handleClick = (event) => {
    const control = event.target.closest('[data-advance], [data-goto]')

    if (!control || !root.contains(control)) {
      return
    }

    if (control.dataset.advance === 'next') {
      next()
      return
    }

    if (control.dataset.advance === 'prev') {
      prev()
      return
    }

    if (control.dataset.goto) {
      goToPage(control.dataset.goto)
    }
  }

  document.addEventListener('click', handleClick)

  return () => {
    document.removeEventListener('click', handleClick)
  }
}

function setupStateReadout(root) {
  const readout = root.querySelector('[data-diorama-state]')

  if (!readout) {
    return () => {}
  }

  const render = ({ currentPage, pageCount }) => {
    readout.textContent = `Page ${currentPage} of ${pageCount}`
  }

  const unsubscribe = subscribe(render)

  render(getState())

  return () => {
    unsubscribe()
  }
}

function setupPageButtonState(root) {
  const pageButtons = [...root.querySelectorAll('[data-goto]')]

  const render = ({ currentPage }) => {
    pageButtons.forEach((button) => {
      const isCurrent = Number(button.dataset.goto) === currentPage

      button.classList.toggle('is-current', isCurrent)

      if (isCurrent) {
        button.setAttribute('aria-current', 'page')
        return
      }

      button.removeAttribute('aria-current')
    })
  }

  const unsubscribe = subscribe(render)

  render(getState())

  return () => {
    unsubscribe()
  }
}

export function initDiorama() {
  cleanupActiveDiorama?.()
  cleanupActiveDiorama = null

  const root = document.querySelector('[data-diorama]')

  if (!root) {
    return () => {}
  }

  initSceneState({ pageCount: readPageCount(root) })

  const cleanupBindings = bindDioramaElements(root)
  const cleanupControls = setupAdvanceControls(root)
  const cleanupReadout = setupStateReadout(root)
  const cleanupPageButtonState = setupPageButtonState(root)

  cleanupActiveDiorama = () => {
    cleanupPageButtonState()
    cleanupReadout()
    cleanupControls()
    cleanupBindings()
  }

  return cleanupActiveDiorama
}
