# angular-google-sheet-translation-generator
Generates Angular i18n translation files from a google sheet


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
