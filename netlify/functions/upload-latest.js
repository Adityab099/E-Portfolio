const Busboy = require('busboy')
const { connectLambda, getStore } = require('@netlify/blobs')

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

    const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type']
    if (!contentType) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing content-type header' }),
      }
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing request body' }),
      }
    }

    // Netlify Blobs in Lambda-compat mode needs manual initialization.
    connectLambda(event)
    const store = getStore('academic-submissions')

    // Netlify can send body as base64 for non-text.
    const bodyBuffer = Buffer.from(
      event.isBase64Encoded ? event.body : event.body,
      event.isBase64Encoded ? 'base64' : 'utf8'
    )

    const fileUpload = await new Promise((resolve, reject) => {
      const bb = new Busboy({
        headers: { 'content-type': contentType },
        limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
      })

      let fileBuffer = Buffer.alloc(0)
      let mimeType = 'application/pdf'
      let uploadedName = 'handwritten-essay.pdf'

      bb.on('file', (_name, file, info) => {
        uploadedName = info?.filename || uploadedName
        mimeType = info?.mimeType || mimeType

        file.on('data', (chunk) => {
          fileBuffer = Buffer.concat([fileBuffer, chunk])
        })
      })

      bb.on('error', reject)
      bb.on('finish', () => resolve({ fileBuffer, mimeType, uploadedName }))
      bb.end(bodyBuffer)
    })

    const blobKey = 'academic/latest.pdf'
    await store.set(blobKey, fileUpload.fileBuffer, {
      metadata: {
        contentType: fileUpload.mimeType || 'application/pdf',
        uploadedName: fileUpload.uploadedName,
      },
    })

    const proto = event.headers?.['x-forwarded-proto'] || 'https'
    const host = event.headers?.host || 'localhost'
    const base = `${proto}://${host}`
    const url = `${base}/.netlify/functions/serve-essay?key=${encodeURIComponent(blobKey)}`

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'function working',
        url,
        key: blobKey,
        filename: fileUpload.uploadedName,
      }),
    }
  } catch (err) {
    console.error('[upload-latest] error', err)
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ success: false, message: err?.message || 'Upload failed' }),
    }
  }
}

