/*
// Must be in sync with emcc settings!
const TOTAL_STACK = 5 * 1024 * 1024
const TOTAL_MEMORY = 16 * 1024 * 1024
const WASM_PAGE_SIZE = 64 * 1024

let memory = null
let dynamicTop = TOTAL_STACK

// TODO(Kagami): Grow memory?
function sbrk (increment) {
  const oldDynamicTop = dynamicTop
  dynamicTop += increment
  return oldDynamicTop
}

// TODO(Kagami): LAME calls exit(-1) on internal error. Would be nice
// to provide custom DEBUGF/ERRORF for easier debugging. Currenty
// those functions do nothing.
function exit (status) {
  window.postMessage({ type: 'internal-error', data: status })
}

memory = new window.WebAssembly.Memory({
  initial: TOTAL_MEMORY / WASM_PAGE_SIZE,
  maximum: TOTAL_MEMORY / WASM_PAGE_SIZE
})

const env = {
  memory: memory,
  pow: Math.pow,
  exit: exit,
  powf: Math.pow,
  exp: Math.exp,
  sqrtf: Math.sqrt,
  cos: Math.cos,
  log: Math.log,
  sin: Math.sin,
  sbrk: sbrk
}

const req = window.fetch(wasmURL, { credentials: 'same-origin' })
window.WebAssembly.instantiateStreaming(req, { env })
  .then((result) => {
    console.log('success', result)
  })
  .catch((err) => {
    console.error(err)
  })
*/
