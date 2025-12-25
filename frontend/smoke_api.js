const fs = require('fs')

async function main(){
  try{
    const apiBase = process.env.API_BASE || 'http://localhost:5000'
    const loginResp = await fetch(`${apiBase}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@realestate.test', password: 'admin123' })
    })
    const loginJson = await loginResp.json()
    console.log('login response:', loginJson)
    const token = loginJson.token || loginJson?.data?.token || loginJson?.accessToken
    if(!token){
      console.error('No token returned; aborting')
      process.exit(1)
    }

    // list properties with token to verify GET works
    const listResp = await fetch(`${apiBase}/api/properties`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    console.log('list status', listResp.status)
    console.log('list body', await listResp.json())

    const filePath = 'test-image.jpg'
    const fileBuf = fs.readFileSync(filePath)
    const boundary = '----NodeMultipart' + Math.random().toString(16).slice(2)
    const CRLF = '\r\n'
    const parts = []

    function fieldPart(name, value){
      return Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}${value}${CRLF}`)
    }

    parts.push(fieldPart('title','Smoke Test Property'))
    parts.push(fieldPart('description','Created by smoke test'))
    parts.push(fieldPart('price','1000'))
    parts.push(fieldPart('location','Test City'))
    parts.push(fieldPart('area','100'))
    parts.push(fieldPart('propertyType','Flat'))

    parts.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="images"; filename="${filePath}"${CRLF}Content-Type: image/jpeg${CRLF}${CRLF}`))
    parts.push(fileBuf)
    parts.push(Buffer.from(CRLF))
    parts.push(Buffer.from(`--${boundary}--${CRLF}`))

    const body = Buffer.concat(parts)

    const createResp = await fetch(`${apiBase}/api/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${token}`
      },
      body
    })

    const createJson = await createResp.json()
    console.log('create response:', createJson)
    if(createResp.status >= 500){
      console.log('Multipart upload returned server error; trying JSON fallback (no images)')
      const fallback = await fetch('http://localhost:5001/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: 'Smoke JSON Property', description: 'Fallback no images', price: 500, location: 'Test', area: 50, propertyType: 'Flat' })
      })
      console.log('fallback status', fallback.status)
      console.log('fallback body', await fallback.json())
    }
  }catch(err){
    console.error('smoke test error:', err)
    process.exit(1)
  }
}

main()
