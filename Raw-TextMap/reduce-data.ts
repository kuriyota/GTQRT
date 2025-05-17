import path from 'node:path'
const dirname = import.meta.dirname as string
const filename = import.meta.filename as string

const raw = Deno.readDirSync(dirname)
const files = raw.filter((file) => file.isFile && file.name.endsWith('.json'))
const files_th = files.filter((file) => file.name.indexOf('TH_') != -1)

for (const file of files) {
  if (file.name.indexOf('TH_') == -1) {
    Deno.copyFileSync(
      path.join(dirname, file.name),
      path.join(dirname, '../TextMap/', file.name)
    )
  }
}

let data_th: any = {}
for (const file of files_th) {
  console.log(file.name)
  const json = await Deno.readTextFile(path.join(dirname, file.name))
  const data = JSON.parse(json)
  data_th = { ...data_th, ...data }
}
Deno.writeTextFileSync(
  path.join(dirname, '../TextMap/TextMapTH.json'),
  JSON.stringify(data_th, null, 2)
)
