import {
  createServer,
} from 'http'

export default createServer(handler)

async function handler(rq, rs) {
  rs.statusCode = 200
  rq.setEncoding('utf8')
  rs.setHeader('content-type', 'application/json')

  if (rq.url === '/json-fail')
    return rs.end('<sdfsdfsdfsfsd>')

  let body = ''
  for await (const chunk of rq)
    body += chunk.toString()

  if (body.length) {
    try {
      body = JSON.parse(body)
    }
    catch (e) {
      // console.error('Test Server', e.message)
    }
  }

  rs.end(JSON.stringify({
    body,
    url: rq.url,
    method: rq.method,
    headers: rq.headers,
  }, null, 2))
}

export function random(a, b, r = +random) {
  return a == null
    ? r
    : Math.round(b == null
      ? r * a
      : r * (b - a) + a)
}
random.valueOf = Math.random

export function claim(x, ms) {
  return new Promise(ok =>
    setTimeout(ok, ms, x))
}
