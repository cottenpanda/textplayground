// Simple HTTPS server that proxies to Bun's dev server
const CERT = await Bun.file('./cert.pem').text()
const KEY = await Bun.file('./key.pem').text()

const BUN_PORT = 3002 // internal bun dev server
const HTTPS_PORT = 3003

// Start bun dev server on internal port
const bunProc = Bun.spawn(
  ['bun', 'index.html', `--host=127.0.0.1:${BUN_PORT}`],
  { cwd: import.meta.dir, stdout: 'inherit', stderr: 'inherit' }
)

// Wait for bun to start
await new Promise(r => setTimeout(r, 2000))

// HTTPS server that forwards to bun
Bun.serve({
  port: HTTPS_PORT,
  hostname: '0.0.0.0',
  tls: {
    cert: CERT,
    key: KEY,
  },
  async fetch(req) {
    const url = new URL(req.url)
    const target = `http://127.0.0.1:${BUN_PORT}${url.pathname}${url.search}`
    const resp = await fetch(target, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })
    return new Response(resp.body, {
      status: resp.status,
      headers: resp.headers,
    })
  },
})

console.log(`\n  HTTPS server running at:`)
console.log(`  https://192.168.50.130:${HTTPS_PORT}`)
console.log(`\n  Open on your phone and accept the certificate warning.\n`)
