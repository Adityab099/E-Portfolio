const { connectLambda, getStore } = require('@netlify/blobs')

function getQuery(event, key) {
  const params = event.queryStringParameters || {}
  return params[key] || params[key.toString()]
}

exports.handler = async (event) => {
  try {
    console.log('[serve-essay] hit', {
      key: getQuery(event, 'key'),
      httpMethod: event.httpMethod,
    })

    // Only GET is expected
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Method not allowed' }),
      }
    }

    connectLambda(event)
    const store = getStore('academic-submissions')

    const key = getQuery(event, 'key')
    if (!key) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing query param: key' }),
      }
    }

    const found = await store.getWithMetadata(key, { type: 'arrayBuffer' })
    if (!found?.data) {
      return {
        statusCode: 404,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'File not found' }),
      }
    }

    const bytes = Buffer.from(found.data)
    const contentType = found.metadata?.contentType || 'application/pdf'
    const filename = found.metadata?.uploadedName || 'academic-latest.pdf'

    return {
      statusCode: 200,
      headers: {
        'content-type': contentType,
        'content-disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        'cache-control': 'no-cache',
      },
      isBase64Encoded: true,
      body: bytes.toString('base64'),
    }
  } catch (err) {
    console.error('[serve-essay] error', err)
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ success: false, message: err?.message || 'Failed to serve file' }),
    }
  }
}

