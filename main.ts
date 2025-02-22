import fs from 'node:fs'
import path from 'node:path'
import express from 'npm:express'
import getPort from 'npm:get-port'
import cors from 'npm:cors'

const app = express()
app.use(cors())
import bodyParser from 'npm:body-parser'

let TMFolder = ''
let FEFolder = ''
TMFolder = './TextMap/'
FEFolder = './dist/'

const languages = ['CHS', 'EN', 'JP', 'KR']
const _Data: any = {}
console.log('a')
languages.forEach(async lang => {
  const json = await Deno.readTextFile(
    TMFolder + 'TextMap' + lang + '.json'
  )
  _Data[lang] = JSON.parse(json)
})

function findText(text: string, lang: string) {
  const data: any = _Data[lang]
  const result = []
  for (const key in data) {
    if (data[key].includes(text)) {
      result.push({
        id: key,
        text: data[key]
      })
    }
  }
  return result
}

function findTextByID(key: string, lang: string) {
  const data: any = _Data[lang]
  return data?.[key] || undefined
}

app.use('/', express.static(FEFolder))

app.post('/api/query', bodyParser.json(), async (req : any, res : any) => {
  const text = req.body.text || ''
  const lang = req.body.lang
  const translate = req.body.translate
  const start = Date.now()
  if (!languages.includes(lang)) {
    res.status(400).send('Invalid language')
    return
  }
  const data = findText(text, lang)
  if (translate) {
    data.forEach((item: any) => {
      item.translate = findTextByID(item.id, translate)
    })
  }
  res.json({ data, time: Date.now() - start })
})

const port = await getPort({ port: 3000 })
app.listen(port, () => {
  console.log(`

GTQRT 服务已启动于 http://localhost:${port}

GitHub: https://github.com/Kuriyota/GTQRT/
Bilibili: https://space.bilibili.com/650631530
  
`)
})
