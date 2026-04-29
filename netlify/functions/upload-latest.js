const Busboy = require('busboy')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

function getHeader(headers, key) {
  const lower = key.toLowerCase()
  return headers?.[lower] || headers?.[key] || headers?.[key.toLowerCase()] || null
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Method not allowed' }),
      }
    }

    const bucket = process.env.AWS_S3_BUCKET
    const region = process.env.AWS_REGION
    const key = process.env.AWS_S3_KEY || 'academic/latest.pdf'

    if (!bucket || !region) {
      return {
        statusCode: 500,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Missing AWS_S3_BUCKET or AWS_REGION env vars' }),
      }
    }

    const contentType = getHeader(event.headers, 'content-type')
    if (!contentType) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Missing content-type header' }),
      }
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Missing request body' }),
      }
    }

    // Netlify can send body as base64 for non-text.
    const bodyBuffer = Buffer.from(
      event.isBase64Encoded ? event.body : event.body,
      event.isBase64Encoded ? 'base64' : 'utf8'
    )

    const s3 = new S3Client({
      region,
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
    })

    const fileUpload = await new Promise((resolve, reject) => {
      const bb = new Busboy({
        headers: { 'content-type': contentType },
        limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
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

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileUpload.fileBuffer,
        ContentType: 'application/pdf',
        // Ensures browser can embed in iframe consistently.
        ContentDisposition: `inline; filename="${encodeURIComponent('academic-latest.pdf')}"`,
        ACL: 'public-read',
      })
    )

    // AWS public URL format
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        url,
        key,
        filename: fileUpload.uploadedName,
      }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: err?.message || 'Upload failed' }),
    }
  }
}

