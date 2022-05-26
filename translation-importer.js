/* 
 1. Add this file in your angluar project

 2. `npm i --save-dev csvtojson`

 3. Replace googleSheetsLink with your google sheet url - just copy it from the browser

 4. Make sure the sheet is public

 5. Have these headers in the sheet
    GROUP	KEY en	nl	fr

   The GROUP value will be carried over until a new value is found.
   The script creates an entry for each non-empty row in the form of:
     GROUP.KEY: language-string

   It outputs a file for each lang found in the header. (en.json, nl.json, fr.json, etc)

   Run it with: 
    `node translation-importer.js`

   Or add these to package.json to generate translations whenever you build:
    "import-translations": "node translation-importer.js",
    "build": "npm rum import-translations && ng build",

*/
var googleSheetsLink = "https://docs.google.com/spreadsheets/d/000000000000000000-0000-00000000000000000000/edit#gid=0"
var outputPath = "src/assets/i18n/"

// removing "/edit# suffix",
// adding tqx=out:csv to get the csv version
var url = googleSheetsLink.split("/edit")[0] + "/gviz/tq?tqx=out:csv"

console.log("Importing translation from:")
console.log(url);

var request = require('request')
var csv = require('csvtojson')
var fs = require('fs')
var process = require('process')

// get path
var myArgs = process.argv.slice(2)
var exportpath = myArgs[0] || outputPath
if (exportpath.slice(-1) != "/") { 
    exportpath += "/"
} 

var currentGroup = ""

var langList = []
var langs = {}

csv()
.fromStream(request.get(url))
.on('header', (data) => {    
    data.forEach(d => {
        langs[d] = {}
        langList.push(d)
    })

    delete langs['GROUP']
    delete langs['KEY']

    langList.shift()
    langList.shift()
})
.on('data', (data) => {
    const row= JSON.parse(data.toString('utf8'))

    const group = row.GROUP
    currentGroup = group ? group : currentGroup
    row.GROUP = currentGroup

    langList.forEach(lang => {
        if (langs[lang][row.GROUP] == undefined) {
            langs[lang][row.GROUP] = {}
        }
        langs[lang][row.GROUP][row.KEY] = row[lang]
    })
})
.on('done', (data) => {
    console.log('done')
    langList.forEach(lang => {
        const fileName = lang + ".json"
        const fullPath = exportpath + fileName
        const content = JSON.stringify(langs[lang]) 
        fs.writeFileSync(fullPath, content)
    })
})
