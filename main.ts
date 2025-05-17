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

const languages = new Set()
const loadedLanguages = new Set()
const Data: {
  [lang: string]: {
    [id: string]: string
  }
} = {}

function checkAvailableLanguage() {
  const files = Deno.readDirSync(TMFolder)
  const checker =
    /TextMap(CHS|CHT|DE|EN|ES|FR|ID|IT|JP|KR|PT|RU|TH|TR|VI)\.json/
  for (const file of files) {
    const match = file.name.match(checker)
    if (match) {
      languages.add(match[1]) // 使用捕获组提取语言代码
    }
  }
}

function loadLanguage(lang: string) {
  if (loadedLanguages.has(lang)) return
  const filePath = `${TMFolder}TextMap${lang}.json`
  const file = Deno.readTextFileSync(filePath)
  const data = JSON.parse(file)
  Data[lang] = data
  loadedLanguages.add(lang)
  console.log(`加载语言: ${lang}`)
}

function findText(text: string, lang: string) {
  const data: any = Data[lang]
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
  const data: any = Data[lang]
  return data?.[key] || undefined
}

checkAvailableLanguage()

app.use('/', express.static(FEFolder))

app.get('/api/languages', (req: any, res: any) => {
  res.json(Array.from(languages))
})

app.post('/api/query', bodyParser.json(), async (req: any, res: any) => {
  const text = req.body.text || ''
  const lang = req.body.lang
  const translate = req.body.translate
  const start = Date.now()
  if (!languages.has(lang)) {
    res.status(400).send('Invalid language')
    return
  }
  loadLanguage(lang)
  const data = findText(text, lang)
  if (translate != 'none') {
    if (!languages.has(translate)) {
      res.status(400).send('Invalid language')
      return
    }
    loadLanguage(translate)
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

识别到的语言：${Array.from(languages).join(', ')}
若没有你需要的语言，请从 https://github.com/Kuriyota/GTQRT/releases 下载对应语言的 TextMap 文件，并放入 TextMap 文件夹中，然后重启 GTQRT。

GitHub: https://github.com/Kuriyota/GTQRT/
Bilibili: https://space.bilibili.com/650631530
`)
})
