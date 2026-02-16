/**
 * Configuração mínima para o build de utilities.
 * Os tokens são gerados pelo Style Dictionary (build/css); as utilities usam esse output.
 */

export function getConfig () {
  return {
    build: {
      processing: {
        parallel: false
      }
    }
  }
}

export function getOutputPaths () {
  return {}
}
