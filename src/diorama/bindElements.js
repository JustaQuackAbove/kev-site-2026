import { applyEffectProgress } from '../animations/effects/index.js'
import { getState, subscribe } from './sceneState.js'

const PAGE_STATE_ATTRIBUTE_PATTERN = /^data-page-(\d+)-(.+)$/

function parsePageRange(value) {
  if (!value) {
    return null
  }

  const trimmedValue = value.trim()

  if (/^\d+$/.test(trimmedValue)) {
    const page = Number(trimmedValue)

    return { from: page, to: page }
  }

  const rangeMatch = trimmedValue.match(/^(\d+)\s*-\s*(\d+)$/)

  if (!rangeMatch) {
    return null
  }

  const from = Number(rangeMatch[1])
  const to = Number(rangeMatch[2])

  return {
    from: Math.min(from, to),
    to: Math.max(from, to),
  }
}

function hasEffectClass(element) {
  return (
    element.classList.contains('effect-slide')
    || element.classList.contains('effect-grow')
    || element.classList.contains('effect-spin')
  )
}

function readStateBinding(element) {
  const pageRange = parsePageRange(element.dataset.page)
  const pageAttributes = new Map()
  const pageText = new Map()
  const dynamicAttributeNames = new Set()

  element.getAttributeNames().forEach((attributeName) => {
    const pageMatch = attributeName.match(PAGE_STATE_ATTRIBUTE_PATTERN)

    if (!pageMatch) {
      return
    }

    const page = Number(pageMatch[1])
    const pageAttribute = pageMatch[2]
    const attributeValue = element.getAttribute(attributeName) ?? ''

    if (!Number.isInteger(page) || page < 1) {
      return
    }

    if (pageAttribute === 'text') {
      pageText.set(page, attributeValue)
      return
    }

    dynamicAttributeNames.add(pageAttribute)

    if (!pageAttributes.has(page)) {
      pageAttributes.set(page, new Map())
    }

    pageAttributes.get(page).set(pageAttribute, attributeValue)
  })

  const hasPageStates = dynamicAttributeNames.size > 0
  const hasTextStates = pageText.size > 0

  if (!pageRange && !hasPageStates && !hasTextStates) {
    return null
  }

  const baseAttributes = new Map()

  dynamicAttributeNames.forEach((attributeName) => {
    const baseAttributeName = `data-${attributeName}`

    if (element.hasAttribute(baseAttributeName)) {
      baseAttributes.set(attributeName, element.getAttribute(baseAttributeName) ?? '')
    }
  })

  return {
    element,
    pageRange,
    pageAttributes: [...pageAttributes.entries()]
      .sort((left, right) => left[0] - right[0])
      .map(([page, attributes]) => ({
        page,
        attributes: [...attributes.entries()],
      })),
    pageText: [...pageText.entries()].sort((left, right) => left[0] - right[0]),
    dynamicAttributeNames: [...dynamicAttributeNames],
    baseAttributes,
    baseText: hasTextStates ? element.textContent.trim() : '',
    usesPageStates: hasPageStates || hasTextStates,
    hasEffectClass: hasEffectClass(element),
  }
}

function isPageActive(currentPage, binding) {
  return currentPage >= binding.from && currentPage <= binding.to
}

function resolveAttributes(binding, currentPage) {
  const resolvedAttributes = new Map(binding.baseAttributes)

  binding.pageAttributes.forEach(({ page, attributes }) => {
    if (page > currentPage) {
      return
    }

    attributes.forEach(([attributeName, attributeValue]) => {
      resolvedAttributes.set(attributeName, attributeValue)
    })
  })

  return resolvedAttributes
}

function applyResolvedAttributes(binding, currentPage) {
  const resolvedAttributes = resolveAttributes(binding, currentPage)

  binding.dynamicAttributeNames.forEach((attributeName) => {
    const targetAttribute = `data-${attributeName}`

    if (resolvedAttributes.has(attributeName)) {
      binding.element.setAttribute(targetAttribute, resolvedAttributes.get(attributeName))
      return
    }

    binding.element.removeAttribute(targetAttribute)
  })
}

function resolveText(binding, currentPage) {
  let textValue = binding.baseText

  binding.pageText.forEach(([page, value]) => {
    if (page <= currentPage) {
      textValue = value
    }
  })

  return textValue
}

function updateStateBinding(binding, currentPage) {
  applyResolvedAttributes(binding, currentPage)

  if (binding.pageText.length > 0) {
    binding.element.textContent = resolveText(binding, currentPage)
  }

  if (binding.hasEffectClass) {
    applyEffectProgress(binding.element, 1)
  }
}

function updateBindings(bindings, state) {
  bindings.forEach((binding) => {
    if (binding.usesPageStates) {
      updateStateBinding(binding, state.currentPage)
      return
    }

    if (binding.pageRange) {
      applyEffectProgress(binding.element, isPageActive(state.currentPage, binding.pageRange) ? 1 : 0)
    }
  })
}

export function bindDioramaElements(root = document) {
  const elements = [root, ...root.querySelectorAll('*')]
  const bindings = elements
    .map((element) => readStateBinding(element))
    .filter(Boolean)

  const syncBindings = (state) => {
    updateBindings(bindings, state)
  }

  const unsubscribe = subscribe(syncBindings)

  syncBindings(getState())

  return () => {
    unsubscribe()
  }
}
