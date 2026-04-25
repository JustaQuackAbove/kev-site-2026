const subscribers = new Set()

let state = {
  currentPage: 1,
  pageCount: 1,
}

function clampPage(page) {
  const number = Number(page)

  if (!Number.isFinite(number)) {
    return state.currentPage
  }

  return Math.min(state.pageCount, Math.max(1, Math.round(number)))
}

function notify() {
  const snapshot = getState()

  subscribers.forEach((subscriber) => subscriber(snapshot))
}

export function initSceneState({ pageCount, initialPage = 1 }) {
  const nextPageCount = Number(pageCount)

  if (!Number.isInteger(nextPageCount) || nextPageCount < 1) {
    throw new Error('Diorama scenes require a valid data-page-count value.')
  }

  state = {
    currentPage: Math.min(nextPageCount, Math.max(1, Math.round(Number(initialPage) || 1))),
    pageCount: nextPageCount,
  }

  notify()

  return getState()
}

export function getState() {
  return { ...state }
}

export function goToPage(page) {
  const nextPage = clampPage(page)

  if (nextPage === state.currentPage) {
    return getState()
  }

  state = {
    ...state,
    currentPage: nextPage,
  }

  notify()

  return getState()
}

export function next() {
  return goToPage(state.currentPage + 1)
}

export function prev() {
  return goToPage(state.currentPage - 1)
}

export function subscribe(subscriber) {
  subscribers.add(subscriber)

  return () => {
    subscribers.delete(subscriber)
  }
}
