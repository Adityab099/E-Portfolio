// JSON-only upload endpoint (Netlify Functions compatible).
// Expected POST JSON body:
//   { file: "<base64>", contentType?: "application/pdf", filename?: string }
//
// It does not store anywhere. It returns a previewable data URL.
exports.handler = async (event) => {
  console.log('[upload-latest] hit', {
    httpMethod: event.httpMethod,
    isBase64Encoded: event.isBase64Encoded,
  })

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Method not allowed' }),
      }
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing request body' }),
      }
    }

    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body

    let parsed
    try {
      parsed = JSON.parse(rawBody)
    } catch {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Invalid JSON body' }),
      }
    }

    const fileB64 = parsed?.file
    const contentType = parsed?.contentType || 'application/pdf'
    const filename = parsed?.filename || 'handwritten-essay.pdf'

    if (!fileB64 || typeof fileB64 !== 'string') {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing "file" base64 string' }),
      }
    }

    // Support both "base64" and "data:<mime>;base64,<base64>"
    const clean = fileB64.includes(',') ? fileB64.split(',')[1] : fileB64

    let bytes
    try {
      bytes = Buffer.from(clean, 'base64')
    } catch {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Invalid base64 content' }),
      }
    }

    // Inline preview safety: reject huge files to prevent timeouts.
    if (bytes.byteLength > 10 * 1024 * 1024) {
      return {
        statusCode: 413,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'File too large for inline preview. Please use fewer pages or smaller images.',
        }),
      }
    }

    const dataUrl = `data:${contentType};base64,${clean}`

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'upload successful',
        url: dataUrl,
        filename,
      }),
    }
  } catch (err) {
    console.error('[upload-latest] fatal', err)
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ success: false, message: err?.message || 'Upload failed' }),
    }
  }
}

