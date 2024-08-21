'use strict'
const config = require('conventional-changelog-conventionalcommits')

function whatBump(commits) {
  let releaseType = 2

  for (let commit of commits) {
    if (commit == null || !commit.header) continue
    if (commit.header.startsWith('chore(bump-mc)') || commit.header.startsWith('chore!')) {
      releaseType = 0
      break
    }
    if ((commit.header.startsWith('feat!') || commit.header.startsWith('fix!')) && releaseType > 1) {
      releaseType = 1
    }
  }

  let releaseTypes = ['major', 'minor', 'patch']

  let reason = 'No special commits found. Defaulting to a patch.'

  switch (releaseTypes[releaseType]) {
    case 'major':
      reason = 'Found a commit with a chore(bump-mc) header..'
      break
    case 'minor':
      reason = 'Found a commit with a feat! or fix! header.'
      break
  }

  return {
    releaseType: releaseTypes[releaseType],
    reason: reason,
  }
}

async function getOptions() {
  let options = await config({
    types: [
      // Unhide all types except "ci" so that they show up on generated changelog
      // Default values:
      // https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-conventionalcommits/writer-opts.js
      { type: 'feat', section: 'Novas Features' },
      { type: 'feature', section: 'Novas Features' },
      { type: 'fix', section: 'Correção de Bugs' },
      { type: 'perf', section: 'Melhorias de Desempenho' },
      { type: 'revert', section: 'Reversões' },
      { type: 'docs', section: 'Documentação' },
      { type: 'style', section: 'Estilos' },
      { type: 'chore', section: 'Atualizações' },
      { type: 'refactor', section: 'Refatoração no Código' },
      { type: 'test', section: 'Testes' },
      { type: 'build', section: 'Build' },
      { type: 'ci', section: 'Integração Contínua', hidden: true },
    ],
  })

  // Both of these are used in different places...
  options.recommendedBumpOpts.whatBump = whatBump
  options.whatBump = whatBump

  return options
}

module.exports = getOptions()
