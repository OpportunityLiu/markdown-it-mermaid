const mermaidChart = (code) => {
  if (typeof window === 'undefined' || !window.mermaid) {
    return `<div class="mermaid">${code}</div>`
  }
  let mermaidError = null
  window.mermaid.parseError = (error, hash) => {
    mermaidError = error
  }
  if (window.mermaid.parse(code)) {
    return `<div class="mermaid">${code}</div>`
  } else {
    return `<pre>${mermaidError}</pre>`
  }
}

const MermaidPlugin = (md) => {
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (token.info === 'mermaid') {
      return mermaidChart(code)
    }
    const firstLine = code.split(/\n/)[0].trim()
    if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
      return mermaidChart(code)
    }
    return temp(tokens, idx, options, env, slf)
  }
}

export default MermaidPlugin
