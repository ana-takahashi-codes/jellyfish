import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger, measureTime, readFileCached, writeFileSafe, extractTokensFromCSS, mapPropertyKey, handleError, TokenProcessingError } from './lib/shared-utils.mjs';
import { getConfig } from './lib/config.mjs';
import { generateAllUtilities } from './dynamic-utilities-generator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
const UTILITIES_DIR = __dirname;
const BUILD_CSS_THEMES = path.join(PACKAGE_ROOT, 'build', 'css', 'themes');
const THEME_NAME = 'core';

const config = getConfig();

/**
 * Detecta os arquivos CSS gerados pelo Style Dictionary (build/css/themes/{theme}/).
 * Um único tema (core); sem conceito de marcas.
 */
function detectGeneratedFiles () {
  const themeDir = path.join(BUILD_CSS_THEMES, THEME_NAME);
  const colorModesDir = path.join(themeDir, 'color-modes');
  const detectedFiles = {
    foundations: null,
    primitives: null,
    scheme: null,
    typography: null,
    responsive: null,
    themes: {}
  };

  if (!fs.existsSync(themeDir)) {
    throw new TokenProcessingError(`Diretório de tema não encontrado: ${themeDir}. Rode o build de tokens primeiro (pnpm run build).`, { themeDir });
  }

  const primitivesPath = path.join(themeDir, 'primitives.css');
  const foundationsPath = path.join(themeDir, 'foundations.css');
  const componentsPath = path.join(themeDir, 'components.css');
  const typographyPath = path.join(themeDir, 'typography.css');
  const responsivePath = path.join(themeDir, 'responsive.css');

  if (fs.existsSync(primitivesPath)) detectedFiles.primitives = primitivesPath;
  if (fs.existsSync(foundationsPath)) detectedFiles.foundations = foundationsPath;
  if (fs.existsSync(componentsPath)) detectedFiles.scheme = componentsPath;
  if (fs.existsSync(typographyPath)) detectedFiles.typography = typographyPath;
  if (fs.existsSync(responsivePath)) detectedFiles.responsive = responsivePath;

  if (fs.existsSync(colorModesDir)) {
    for (const name of ['light', 'dark']) {
      const p = path.join(colorModesDir, `${name}.css`);
      if (fs.existsSync(p)) detectedFiles.themes[name] = p;
    }
  }

  logger.info('Arquivos CSS (tokens):');
  logger.info(`  - primitives: ${detectedFiles.primitives ? '✅' : '❌'}`);
  logger.info(`  - foundations: ${detectedFiles.foundations ? '✅' : '❌'}`);
  logger.info(`  - themes: ${Object.keys(detectedFiles.themes).join(', ') || '—'}`);

  return detectedFiles;
}

const PATHS = {
  source: detectGeneratedFiles(),
  utilitiesMappingDynamic: path.join(UTILITIES_DIR, 'utilities-mapping-dynamic.json'),
  utilitiesMappingStatic: path.join(UTILITIES_DIR, 'utilities-mapping-static.json'),
  output: {
    utilities: path.join(PACKAGE_ROOT, 'build', 'css', 'utilities.css')
  }
};

// ============================================================================
// CSS GENERATION OPTIMIZED
// ============================================================================

/**
 * Gera classes utilitárias otimizada com parallel processing
 */
const generateUtilities = async (tokens, mapping) => {
  const utilities = [];
  const categoryPromises = [];


  // Processar categorias em paralelo se habilitado
  if (config.build.processing.parallel) {
    for (const [category, categoryConfig] of Object.entries(mapping)) {
      categoryPromises.push(
        measureTime(`Processing ${category} utilities`, async () => {
          return generateCategoryUtilities(category, categoryConfig, tokens);
        })
      );
    }

    const categoryResults = await Promise.all(categoryPromises);
    utilities.push(...categoryResults.flat());
  } else {
    // Processamento sequencial
    for (const [category, categoryConfig] of Object.entries(mapping)) {
      const categoryUtils = await measureTime(`Processing ${category} utilities`, async () => {
        return generateCategoryUtilities(category, categoryConfig, tokens);
      });
      utilities.push(...categoryUtils);
    }
  }

  return utilities.join('\n');
};

/**
 * Gera nome de classe CSS a partir de prefixo e chave
 */
const generateClassName = (prefix, key) => {
  // Suporte para estados no formato Tailwind (ex: hover:bg-action-accent)
  if (prefix.includes(':')) {
    const [state, basePrefix] = prefix.split(':');
    return `.${state}:${basePrefix}-${key}`;
  }
  
  // Para typography utilities (prefix vazio), não adicionar hífen
  if (prefix === '') {
    return `.${key}`;
  }
  
  return `.${prefix}-${key}`;
};

/**
 * Gera utilities para uma categoria específica
 */
const generateCategoryUtilities = (category, config, tokens) => {
  const makeClassName = (localPrefix, key, escapeColons) => {
    const c = generateClassName(localPrefix, key);
    return escapeColons ? c.replace(':', '\\:') : c;
  };

  // Suporte a categorias compostas com múltiplos prefixos (ex: spacing: p, m, gap)
  if (config && typeof config.prefixes === 'object' && config.prefixes !== null) {
    const combined = [];
    combined.push(`/* ${category.toUpperCase()} UTILITIES */`);
    for (const [subPrefix, subConfig] of Object.entries(config.prefixes)) {
      const mergedConfig = {
        prefix: subPrefix,
        properties: (subConfig && subConfig.properties) || config.properties || [],
        states: (subConfig && subConfig.states) || config.states || {},
        suffixes: (subConfig && subConfig.suffixes) || config.suffixes || {},
        customMappings: (subConfig && subConfig.customMappings) || config.customMappings || {},
        dynamic: (subConfig && subConfig.dynamic) || config.dynamic,
        responsive: config.responsive === true
      };
      // Reutiliza a própria função para gerar utilities para cada subprefixo
      const subUtilities = generateCategoryUtilities(`${category}-${subPrefix}`, mergedConfig, tokens);
      combined.push(subUtilities.join('\n'));
    }
    combined.push('');
    return combined;
  }

  const { prefix, properties, states = {}, suffixes = {}, customMappings = {}, dynamic, responsive = false } = config || {};
  const utilities = [];

  utilities.push(`/* ${category.toUpperCase()} UTILITIES */`);

  // Dynamic palette (or similar) expansion
  if (dynamic && Array.isArray(dynamic.variants) && Array.isArray(dynamic.scales)) {
    const keyFmt = dynamic.keyFormat || '{variant}-{scale}';
    const tokenFmt = dynamic.tokenFormat || 'jf-{variant}-{scale}';

    for (const variant of dynamic.variants) {
      for (const scale of dynamic.scales) {
        const key = keyFmt.replace('{variant}', variant).replace('{scale}', scale);
        const tokenName = tokenFmt.replace('{variant}', variant).replace('{scale}', scale);
        const tokenValue = tokens[tokenName];

        if (!tokenValue) continue;

        const className = makeClassName(prefix, key, false);
        const cssProperties = properties.map(prop => `  ${prop}: var(--${tokenName});`).join('\n');
        utilities.push(`${className} {\n${cssProperties}\n}`);
      }
    }
  }

  for (const [key, mappingValue] of Object.entries(customMappings)) {
    if (typeof mappingValue === 'object' && mappingValue !== null) {
      const className = makeClassName(prefix, key, false);
      let utility = `${className} {\n`;
      
      // Propriedades base (excluindo states)
      const baseProperties = Object.entries(mappingValue)
        .filter(([propKey, propValue]) => propKey !== 'states' && typeof propValue === 'string')
        .map(([propKey, propValue]) => {
          const tokenValue = tokens[propValue];
          return tokenValue ? `  ${mapPropertyKey(propKey)}: var(--${propValue});` : null;
        })
        .filter(Boolean)
        .join('\n');
      
      utility += baseProperties + '\n';
      
      // Estados dinâmicos - Formato Tailwind
      if (mappingValue.states) {
        for (const [stateKey, stateConfig] of Object.entries(mappingValue.states)) {
          if (typeof stateConfig === 'object' && stateConfig !== null) {
            // Gerar classes no formato Tailwind (ex: hover:bg-action-accent)
            const stateClassName = generateClassName(`${stateKey}:${prefix}`, key);
            
            const stateProperties = Object.entries(stateConfig)
              .filter(([propKey, propValue]) => propKey !== 'selector' && typeof propValue === 'string')
              .map(([propKey, propValue]) => {
                const tokenValue = tokens[propValue];
                return tokenValue ? `  ${mapPropertyKey(propKey)}: var(--${propValue});` : null;
              })
              .filter(Boolean)
              .join('\n');
            
            if (stateProperties) {
              // Gerar classe no formato Tailwind com escape correto
              const escapedClassName = stateClassName.replace(':', '\\:');
              // Usar o estado correto baseado no prefixo (hover, focus, active, focus-visible)
              const tailwindUtility = `${escapedClassName}:${stateKey} {\n${stateProperties}\n}`;
              utilities.push(tailwindUtility);
            }
          }
        }
      }
      
      utility += '}';
      utilities.push(utility);
    } else {
      // Mapeamento simples - verificar se é valor direto ou token
      const className = makeClassName(prefix, key, false);
      
      // Verificar se é um valor CSS direto (não começa com 'jf-')
      if (typeof mappingValue === 'string' && !mappingValue.startsWith('jf-')) {
        // Valor CSS direto (ex: 'block', 'flex', 'center')
        const cssProperties = properties.map(prop => `  ${prop}: ${mappingValue};`).join('\n');
        utilities.push(`${className} {\n${cssProperties}\n}`);
      } else {
        // Token CSS (ex: 'jf-bg-surface')
        const tokenName = mappingValue;
        const tokenValue = tokens[tokenName];

        if (tokenValue) {
          if (category === 'background' && key.startsWith('action-') && Object.keys(suffixes).length > 0) {
            // Action tokens com pseudo-classes
            const cssProperties = properties.map(prop => `  ${prop}: var(--${tokenName});`).join('\n');
            let utility = `${className} {\n${cssProperties}\n`;

            // Adicionar pseudo-classes
            for (const [suffix, suffixProps] of Object.entries(suffixes)) {
              if (suffix === 'hover' || suffix === 'selected') {
                const baseTokenName = tokenName.replace('-enabled', '');
                const stateTokenName = `${baseTokenName}-${suffix}`;
                const stateTokenValue = tokens[stateTokenName];

                if (stateTokenValue) {
                  const pseudoClass = suffix === 'hover' ? '&:hover' : '&.selected';
                  const cssProperties = suffixProps.map(prop => `    ${prop}: var(--${stateTokenName});`).join('\n');
                  utility += `  ${pseudoClass} {\n${cssProperties}\n  }\n`;
                }
              }
            }

            utility += '}';
            utilities.push(utility);
          } else {
            // Comportamento padrão
            const cssProperties = properties.map(prop => `  ${prop}: var(--${tokenName});`).join('\n');
            utilities.push(`${className} {\n${cssProperties}\n}`);

            // Adicionar sufixos
            for (const [suffix, suffixProps] of Object.entries(suffixes)) {
              const suffixKey = `${suffix}-${key}`;
              const suffixClassName = makeClassName(prefix, suffixKey, false);
              const suffixCssProperties = suffixProps.map(prop => `  ${prop}: var(--${tokenName});`).join('\n');
              utilities.push(`${suffixClassName} {\n${suffixCssProperties}\n}`);
            }
          }
        }
      }
    }
  }

  // Responsive variants
  if (responsive === true) {
    const breakpoints = [
      { bp: 'screen-xs', token: 'jf-screen-xs' },
      { bp: 'screen-sm', token: 'jf-screen-sm' },
      { bp: 'screen-md', token: 'jf-screen-md' },
      { bp: 'screen-lg', token: 'jf-screen-lg' },
      { bp: 'screen-xl', token: 'jf-screen-xl' }
    ];

    for (const { bp, token } of breakpoints) {
      const responsiveUtilities = [];

      // Dynamic
      if (dynamic && Array.isArray(dynamic.variants) && Array.isArray(dynamic.scales)) {
        const keyFmt = dynamic.keyFormat || '{variant}-{scale}';
        const tokenFmt = dynamic.tokenFormat || 'jf-{variant}-{scale}';

        for (const variant of dynamic.variants) {
          for (const scale of dynamic.scales) {
            const key = keyFmt.replace('{variant}', variant).replace('{scale}', scale);
            const tokenName = tokenFmt.replace('{variant}', variant).replace('{scale}', scale);
            const tokenValue = tokens[tokenName];
            if (!tokenValue) continue;
            const className = makeClassName(`${bp}:${prefix}`, key, true);
            const cssProperties = properties.map(prop => `  ${prop}: var(--${tokenName});`).join('\n');
            responsiveUtilities.push(`${className} {\n${cssProperties}\n}`);
          }
        }
      }

      // Custom mappings
      for (const [key, mappingValue] of Object.entries(customMappings)) {
        if (typeof mappingValue === 'object' && mappingValue !== null) {
          const className = makeClassName(`${bp}:${prefix}`, key, true);
          let utility = `${className} {\n`;
          const baseProperties = Object.entries(mappingValue)
            .filter(([propKey, propValue]) => propKey !== 'states' && typeof propValue === 'string')
            .map(([propKey, propValue]) => {
              const tokenValue = tokens[propValue];
              return tokenValue ? `  ${mapPropertyKey(propKey)}: var(--${propValue});` : null;
            })
            .filter(Boolean)
            .join('\n');
          utility += baseProperties + '\n';
          utility += '}';
          responsiveUtilities.push(utility);

          // Suffix variants
          for (const [suffix, suffixProps] of Object.entries(suffixes)) {
            const suffixKey = `${suffix}-${key}`;
            const suffixClassName = makeClassName(`${bp}:${prefix}`, suffixKey, true);
            const suffixCssProperties = suffixProps.map(prop => `  ${prop}: var(--${mappingValue});`).join('\n');
            // Note: mappingValue here is object; suffix on object is not typical; we skip to avoid incorrect mapping
          }
        } else {
          const className = makeClassName(`${bp}:${prefix}`, key, true);
          if (typeof mappingValue === 'string' && !mappingValue.startsWith('jf-')) {
            const cssProperties = properties.map(prop => `  ${prop}: ${mappingValue};`).join('\n');
            responsiveUtilities.push(`${className} {\n${cssProperties}\n}`);
          } else {
            const tokenName = mappingValue;
            const tokenValue = tokens[tokenName];
            if (tokenValue) {
              const cssProperties = properties.map(prop => `  ${prop}: var(--${tokenName});`).join('\n');
              responsiveUtilities.push(`${className} {\n${cssProperties}\n}`);
              for (const [suffix, suffixProps] of Object.entries(suffixes)) {
                const suffixKey = `${suffix}-${key}`;
                const suffixClassName = makeClassName(`${bp}:${prefix}`, suffixKey, true);
                const suffixCssProperties = suffixProps.map(prop => `  ${prop}: var(--${tokenName});`).join('\n');
                responsiveUtilities.push(`${suffixClassName} {\n${suffixCssProperties}\n}`);
              }
            }
          }
        }
      }

      if (responsiveUtilities.length > 0) {
        utilities.push(`@media (min-width: var(--${token})) {`);
        utilities.push(responsiveUtilities.map(line => line.replace(/^/gm, '  ')).join('\n'));
        utilities.push('}');
      }
    }
  }

  utilities.push(''); // Linha em branco
  return utilities;
};

// ============================================================================
// MAIN BUILD PROCESS
// ============================================================================

/**
 * Gera utilities.css (otimizado) - processa utilities estáticos e dinâmicos
 */
const generateUtilitiesCSS = async () => {
  logger.step('Gerando utilities.css...');

  // Verificar se pelo menos um arquivo de mapping existe
  const staticMappingPath = PATHS.utilitiesMappingStatic;
  const dynamicMappingPath = PATHS.utilitiesMappingDynamic;

  const staticExists = fs.existsSync(staticMappingPath);
  const dynamicExists = fs.existsSync(dynamicMappingPath);

  if (!staticExists && !dynamicExists) {
    logger.warn('Nenhum arquivo de utilities mapping encontrado. Pulando geração de utilities.');
    return;
  }

  try {
    // Carregar mappings e CSS files em paralelo
    const [staticMapping, dynamicMapping, cssFiles] = await Promise.all([
      measureTime('Loading static utilities mapping', async () => {
        if (staticExists) {
          logger.info('Carregando utilities-mapping-static.json (valores CSS diretos)');
          return JSON.parse(readFileCached(staticMappingPath));
        }
        return {};
      }),
      measureTime('Loading dynamic utilities mapping', async () => {
        if (dynamicExists) {
          logger.info('Carregando utilities-mapping-dynamic.json (novo sistema dinâmico)');
          return JSON.parse(readFileCached(dynamicMappingPath));
        }
        return {};
      }),
      measureTime('Loading CSS files', async () => {
        const cssContent = {};
        const filesToLoad = [
          { key: 'primitives', path: PATHS.source.primitives },
          { key: 'foundations', path: PATHS.source.foundations },
          { key: 'scheme', path: PATHS.source.scheme },
          { key: 'typography', path: PATHS.source.typography },
          { key: 'responsive', path: PATHS.source.responsive },
          { key: 'light', path: PATHS.source.themes.light },
          { key: 'dark', path: PATHS.source.themes.dark }
        ].filter((f) => f.path);

        if (config.build.processing.parallel) {
          const loadPromises = filesToLoad
            .filter(file => fs.existsSync(file.path))
            .map(async (file) => {
              const content = readFileCached(file.path);
              return { key: file.key, content };
            });

          const results = await Promise.all(loadPromises);
          results.forEach(({ key, content }) => {
            cssContent[key] = content;
          });
        } else {
          for (const file of filesToLoad) {
            if (fs.existsSync(file.path)) {
              cssContent[file.key] = readFileCached(file.path);
            }
          }
        }

        return Object.values(cssContent).join('\n');
      })
    ]);

    if (!cssFiles) {
      logger.warn('Nenhum CSS encontrado em build/css/themes/core/. Rode o build de tokens antes (pnpm run build).');
      return;
    }

    // Extrair tokens CSS
    const tokens = await measureTime('Token extraction', () => extractTokensFromCSS(cssFiles));
    logger.info(`Total de tokens extraídos: ${Object.keys(tokens).length}`);

    // Gerar utilities usando os diferentes sistemas
    const utilitiesParts = [];

    // 1. Utilities estáticos (valores CSS diretos)
    if (Object.keys(staticMapping).length > 0) {
      const staticUtils = await measureTime('Static utilities generation', () =>
        generateUtilities(tokens, staticMapping)
      );
      utilitiesParts.push('/* ========================================\n   STATIC UTILITIES (CSS Direct Values)\n   ======================================== */\n');
      utilitiesParts.push(staticUtils);
    }

    // 2. Utilities dinâmicos (novo sistema)
    if (Object.keys(dynamicMapping).length > 0) {
      const dynamicUtils = await measureTime('Dynamic utilities generation', () =>
        generateAllUtilities(dynamicMapping, tokens)
      );
      utilitiesParts.push('\n/* ========================================\n   DYNAMIC UTILITIES (New System)\n   ======================================== */\n');
      utilitiesParts.push(dynamicUtils);
    }

    const utilitiesCSS = utilitiesParts.join('\n');

    let responsiveBlock = '';
    if (PATHS.source.responsive && fs.existsSync(PATHS.source.responsive)) {
      responsiveBlock = `\n/* ========================================
   RESPONSIVE TOKENS (:root overrides por breakpoint)
   Origem: Style Dictionary responsive.css
   ======================================== */\n\n${readFileCached(PATHS.source.responsive)}\n`;
    }

    const finalUtilitiesCSS = `/**
 * Jellyfish - Utilities CSS
 * Gerado automaticamente a partir dos design tokens
 * Inclui: utilities estáticos, dinâmicos, tipografia e tokens responsivos
 * Generated at: ${new Date().toISOString()}
 *
 * Arquivos de mapping processados:
 * ${staticExists ? '- utilities-mapping-static.json (valores CSS diretos + tipografia)' : ''}
 * ${dynamicExists ? '- utilities-mapping-dynamic.json (novo sistema dinâmico)' : ''}
 * - responsive.css (redefinições de tokens por breakpoint)
 */

${utilitiesCSS}${responsiveBlock}`;

    const success = writeFileSafe(PATHS.output.utilities, finalUtilitiesCSS);

    if (success) {
      logger.success('utilities.css gerado com sucesso!');
      logger.info(`Arquivo salvo em: ${PATHS.output.utilities}`);
      logger.info(`Total de tokens processados: ${Object.keys(tokens).length}`);
      if (staticExists) logger.info(`Utilities estáticos: ${Object.keys(staticMapping).length} categorias`);
      if (dynamicExists) logger.info(`Utilities dinâmicos: ${Object.keys(dynamicMapping).length} categorias`);
      logger.info(`Total de categorias: ${Object.keys(staticMapping).length + Object.keys(dynamicMapping).length}`);
    } else {
      throw new TokenProcessingError('Falha ao salvar utilities.css');
    }

  } catch (error) {
    handleError(error, 'Erro durante a geração de utilities');
    throw error;
  }
};

// ============================================================================
// MAIN EXECUTION
// ============================================================================

const main = async () => {
  try {
    logger.info('Iniciando build unificado...\n');

    const results = await measureTime('Build completo de utilities', async () => {
      await generateUtilitiesCSS();
      return { success: true };
    });

    if (results.success) {
      logger.success('Build unificado concluído com sucesso!');
      logger.info('Arquivos gerados:');
      logger.info(`   - ${PATHS.output.utilities}`);
    }

  } catch (error) {
    handleError(error, 'Build process failed');
    process.exit(1);
  }
};

// Executar build
await main();