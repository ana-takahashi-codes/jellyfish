import React from 'react';
import coreTokens from '../../../../packages/tokens/src/tokens-studio/core.json';

function isColorLeaf (value) {
  if (value == null || typeof value !== 'object') {
    return false
  }

  return value.$type === 'color' && typeof value.$value === 'string'
}

function extractColorTokens (node, path = []) {
  if (isColorLeaf(node)) {
    return [
      {
        name: path.join('.'),
        value: node.$value,
      },
    ]
  }

  if (node == null || typeof node !== 'object') {
    return []
  }

  return Object.entries(node).flatMap(([key, child]) =>
    extractColorTokens(child, [...path, key]),
  )
}

const allColorTokens = extractColorTokens(coreTokens)

const gradientTokens = allColorTokens.filter((token) =>
  typeof token.value === 'string' &&
  token.value.toLowerCase().includes('gradient'),
)

const solidTokens = allColorTokens.filter(
  (token) => !gradientTokens.includes(token),
)

function ColorsSection ({ title, tokens }) {
  if (!tokens.length) {
    return null
  }

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ marginBottom: 12 }}>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Preview</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name}>
              <td>
                <code>{token.name}</code>
              </td>
              <td>
                <span
                  aria-label={token.value}
                  style={{
                    display: 'inline-block',
                    width:64,
                    height: 48,
                    borderRadius: 4,
                    border: '1px solid #e5e7eb',
                    background: token.value,
                  }}
                />
              </td>
              <td>
                <code>{token.value}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function ColorsTable () {
  if (!allColorTokens.length) {
    return <p>Não foram encontrados tokens de cor.</p>
  }

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Tokens de cor</h1>
      <p style={{ marginBottom: 24 }}>
        Tokens de cor do pacote <code>@jellyfish/tokens</code>, separados em
        cores sólidas e gradientes.
      </p>

      <ColorsSection title='Cores' tokens={solidTokens} />
      <ColorsSection title='Gradients' tokens={gradientTokens} />
    </div>
  )
}


