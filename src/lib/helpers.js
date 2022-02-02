export const flash = (element) => {
  requestAnimationFrame(() => {
    element.style.transition = 'none'
    element.style.opacity = 1

    setTimeout(() => {
      element.style.transition = 'opacity 2s ease'
      element.style.opacity = 0
    })
  })
}
