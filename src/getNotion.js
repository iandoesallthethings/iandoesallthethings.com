const fetch = require('node-fetch')

const getNotion = async () => {
  const response = await fetch('https://www.notion.so/api/v3/loadPageChunk', {
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'notion-client-version': '23.2.18',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-notion-active-user-header': '',
      cookie:
        '__cfduid=dd042f26abdcff3a19daab9537fb4e4081599663132; notion_browser_id=72c6074a-7529-4eb5-9d85-80a7b5f1a809; notion_locale=en-US%2Fautodetect; logglytrackingsession=e715f5c9-c35a-4842-b23e-996c29e0cd3a; ajs_anonymous_id=%22105acab5-a45a-44a0-ac36-132aee0fc1db%22; intercom-id-gpfdrxfd=f5fd340b-2788-4061-aa83-234bff9f1ec8; intercom-session-gpfdrxfd=',
    },
    referrer: 'https://www.notion.so/musician-7edfa058d7a34b2cad7481f9595827a5',
    referrerPolicy: 'same-origin',
    body:
      '{"pageId":"7edfa058-d7a3-4b2c-ad74-81f9595827a5","limit":50,"cursor":{"stack":[[{"table":"block","id":"7edfa058-d7a3-4b2c-ad74-81f9595827a5","index":0}]]},"chunkNumber":0,"verticalColumns":true}',
    method: 'POST',
    mode: 'cors',
  })

  const text = await response.text()
  const blocks = JSON.parse(text).recordMap.block
  // console.log(json.recordMap.block)

  for (const block in blocks) {
    console.log(blocks[block].value.properties.title)
  }
}

getNotion()
