export default function isFullscreen () {
  console.log('called')
  console.log(window.innerWidth === window.screen.width && window.innerHeight === window.screen.height)
  return window.innerWidth === window.screen.width && window.innerHeight === window.screen.height
}
