import fs from 'fs'

;(() => {
  const replaceVersion = (path) => {
    let content = fs.readFileSync(path, 'utf-8')
    const versionRegex = /"version":\s*"(\d+)\.(\d+)\.(\d+)"/

    const match = content.match(versionRegex)
    if (match) {
      let [fullMatch, major, minor, patch] = match
      let majorNum = parseInt(major)
      let minorNum = parseInt(minor)
      let patchNum = parseInt(patch)
      patchNum++
      if (patchNum >= 100) {
        patchNum = 0
        minorNum++
      }
      if (minorNum >= 100) {
        minorNum = 0
        majorNum++
      }
      const newVersion = `${majorNum}.${minorNum}.${patchNum}`
      const updatedContent = content.replace(fullMatch, `"version": "${newVersion}"`)
      fs.writeFileSync(path, updatedContent)
      console.log(`"${path}" version updated to ${newVersion}`)
    } else {
      console.log(`Version not found in "${path}"`)
    }
  }

  replaceVersion('./package.json')
})()
