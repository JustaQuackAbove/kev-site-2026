const navLinks = [
  { href: './index.html', label: 'Home' },
  { href: './click.html', label: 'Click' },
  { href: './scroll.html', label: 'Scroll' },
  { href: './combo.html', label: 'Combo' },
  { href: './scene.html', label: 'Scene' },
]

function getCurrentPage() {
  const pathname = window.location.pathname.split('/').pop()

  return pathname || 'index.html'
}

export function renderNavbar() {
  if (document.querySelector('.site-nav')) {
    return
  }

  const currentPage = getCurrentPage()
  const nav = document.createElement('header')

  nav.className = 'site-nav'
  nav.innerHTML = `
    <div class="nav-shell">
      <a class="nav-brand" href="./index.html">Square Motion Lab</a>
      <nav class="nav-links" aria-label="Main navigation">
        ${navLinks
          .map(({ href, label }) => {
            const pageName = href.replace('./', '')
            const isActive = currentPage === pageName
            const activeClass = isActive ? 'is-active' : ''
            const ariaCurrent = isActive ? 'aria-current="page"' : ''

            return `<a class="nav-link ${activeClass}" href="${href}" ${ariaCurrent}>${label}</a>`
          })
          .join('')}
      </nav>
    </div>
  `

  document.body.prepend(nav)
  document.documentElement.style.setProperty('--nav-offset', `${nav.offsetHeight + 16}px`)

  window.addEventListener('resize', () => {
    document.documentElement.style.setProperty('--nav-offset', `${nav.offsetHeight + 16}px`)
  })
}
