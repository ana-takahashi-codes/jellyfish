/**
 * Dynamic Utilities Generator
 * Sistema unificado e escalável para geração de utility classes CSS
 *
 * Principais características:
 * - Mapeamento dinâmico baseado em schema JSON
 * - Suporte a múltiplas dimensões (orientação, variantes, cores, etc)
 * - Geração de estados interativos (hover, focus, active, etc)
 * - Suporte a variantes responsivas
 * - Sistema de combinação automática entre prefixos e propriedades
 * - Otimizado para performance e escalabilidade
 */

import { logger } from './lib/shared-utils.mjs';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const DEFAULT_BREAKPOINTS = [
  { name: 'xs', token: 'jf-screen-xs' },
  { name: 'sm', token: 'jf-screen-sm' },
  { name: 'md', token: 'jf-screen-md' },
  { name: 'lg', token: 'jf-screen-lg' },
  { name: 'xl', token: 'jf-screen-xl' }
];

const STATE_SELECTORS = {
  hover: ':hover',
  focus: ':focus',
  active: ':active',
  'focus-visible': ':focus-visible',
  'focus-within': ':focus-within',
  disabled: ':disabled',
  checked: ':checked',
  selected: '.selected',
  visited: ':visited',
  'first-child': ':first-child',
  'last-child': ':last-child'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normaliza prefixos e propriedades para arrays
 */
const normalizeConfig = (config) => {
  return {
    ...config,
    prefix: Array.isArray(config.prefix) ? config.prefix : [config.prefix],
    properties: Array.isArray(config.properties) ? config.properties : [config.properties],
    tokenPattern: config.tokenPattern
      ? (Array.isArray(config.tokenPattern) ? config.tokenPattern : [config.tokenPattern])
      : []
  };
};

/**
 * Gera nome de classe CSS com escape de caracteres especiais
 */
const generateClassName = (parts, escape = false) => {
  const className = '.' + parts.filter(Boolean).join('-');
  return escape ? className.replace(/:/g, '\\:') : className;
};

/**
 * Valida se um token existe no conjunto de tokens CSS
 */
const validateToken = (tokenName, tokens) => {
  if (!tokens[tokenName]) {
    logger.debug(`Token não encontrado: ${tokenName}`);
    return false;
  }
  return true;
};

/**
 * Gera propriedades CSS a partir de um mapeamento
 */
const generateCSSProperties = (properties, tokenName, tokens, indent = '  ') => {
  if (!validateToken(tokenName, tokens)) {
    return null;
  }

  const normalizedProps = Array.isArray(properties) ? properties : [properties];

  return normalizedProps
    .map(prop => `${indent}${prop}: var(--${tokenName});`)
    .join('\n');
};

/**
 * Substitui placeholders no classPattern
 */
const applyClassPattern = (pattern, values) => {
  let result = pattern;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '');
  }
  // Remove hífens duplicados ou no início/fim
  return result.replace(/-+/g, '-').replace(/^-|-$/g, '');
};

// ============================================================================
// CORE GENERATORS
// ============================================================================

/**
 * Gera uma utility class simples
 */
const generateSimpleUtility = (className, properties, tokenName, tokens) => {
  const cssProps = generateCSSProperties(properties, tokenName, tokens);
  if (!cssProps) return null;

  return `${className} {\n${cssProps}\n}`;
};

/**
 * Gera utility class com estados
 */
const generateStateUtilities = (classPattern, states, tokens, basePlaceholders) => {
  const utilities = [];

  for (const [stateName, stateConfig] of Object.entries(states)) {
    const stateSelector = stateConfig.selector || STATE_SELECTORS[stateName] || `:${stateName}`;

    // Gerar a classe base a partir do classPattern e placeholders (sem estado)
    const baseClass = applyClassPattern(classPattern || '{prefix}-{variant}', basePlaceholders);
    // Prefixar o estado no formato Tailwind: .hover\:bg-neutral
    const stateClassName = `.${stateName}\\:${baseClass}`;

    const stateProperties = [];

    for (const [prop, tokenName] of Object.entries(stateConfig)) {
      if (prop === 'selector') continue;

      if (validateToken(tokenName, tokens)) {
        stateProperties.push(`  ${prop}: var(--${tokenName});`);
      }
    }

    if (stateProperties.length > 0) {
      utilities.push(
        `${stateClassName}${stateSelector} {\n${stateProperties.join('\n')}\n}`
      );
    }
  }

  return utilities;
};

/**
 * Processa mapeamento dinâmico com múltiplas dimensões
 */
const processDynamicMapping = (category, config, tokens) => {
  const normalized = normalizeConfig(config);
  const { prefix, properties, dynamicMapping, classPattern, responsive, tokenPattern } = normalized;

  if (!dynamicMapping) {
    return [];
  }

  const utilities = [];
  const dimensions = Object.keys(dynamicMapping);

  // Se há apenas uma dimensão, processar diretamente
  if (dimensions.length === 1) {
    const [dimensionName] = dimensions;
    const dimensionValues = dynamicMapping[dimensionName];

    return processSingleDimension(
      dimensionName,
      dimensionValues,
      prefix,
      properties,
      classPattern,
      tokens,
      tokenPattern
    );
  }

  // Se há múltiplas dimensões, gerar combinações
  return processMultipleDimensions(
    dynamicMapping,
    prefix,
    properties,
    classPattern,
    tokens,
    tokenPattern
  );
};

/**
 * Processa uma única dimensão
 */
const processSingleDimension = (dimensionName, dimensionValues, prefixes, properties, classPattern, tokens, tokenPatterns = []) => {
  const utilities = [];
  const pattern = classPattern || `{prefix}-{${dimensionName}}`;

  for (const [key, value] of Object.entries(dimensionValues)) {
    // Se o valor é um objeto com 'enabled' e 'states'
    if (value && typeof value === 'object' && value.enabled) {
      const baseTokenName = value.enabled;
      // tokenPattern filtering
      if (Array.isArray(tokenPatterns) && tokenPatterns.length > 0) {
        const matches = tokenPatterns.some(p => typeof baseTokenName === 'string' && baseTokenName.startsWith(p));
        if (!matches) continue;
      }

      for (let i = 0; i < prefixes.length; i++) {
        const prefix = prefixes[i];
        const props = Array.isArray(properties[i]) ? properties[i] : properties;

        const placeholders = { prefix, [dimensionName]: key };
        const className = '.' + applyClassPattern(pattern, placeholders);

        // Gerar classe base
        const baseUtility = generateSimpleUtility(className, props, baseTokenName, tokens);
        if (baseUtility) utilities.push(baseUtility);

        // Gerar estados
        if (value.states) {
          const stateUtils = generateStateUtilities(pattern, value.states, tokens, placeholders);
          utilities.push(...stateUtils);
        }
      }
    }
    // Se o valor é um string (token CSS)
    else if (typeof value === 'string') {
      // tokenPattern filtering
      if (Array.isArray(tokenPatterns) && tokenPatterns.length > 0) {
        const matches = tokenPatterns.some(p => value.startsWith(p));
        if (!matches) continue;
      }
      for (let i = 0; i < prefixes.length; i++) {
        const prefix = prefixes[i];
        const props = Array.isArray(properties[i]) ? properties[i] : properties;

        const placeholders = { prefix, [dimensionName]: key };
        const className = '.' + applyClassPattern(pattern, placeholders);

        const utility = generateSimpleUtility(className, props, value, tokens);
        if (utility) utilities.push(utility);
      }
    }
  }

  return utilities;
};

/**
 * Processa múltiplas dimensões gerando combinações
 */
const processMultipleDimensions = (dynamicMapping, prefixes, propertiesConfig, classPattern, tokens, tokenPatterns = []) => {
  const utilities = [];
  const dimensions = Object.keys(dynamicMapping);

  // Gerar todas as combinações possíveis
  const combinations = generateCombinations(dynamicMapping);

  for (const combination of combinations) {
    for (let prefixIndex = 0; prefixIndex < prefixes.length; prefixIndex++) {
      const prefix = prefixes[prefixIndex];

      // Determinar propriedades CSS para este prefixo
      let properties;

      // Se houver mapeamento de propriedades por dimensão (ex: props)
      if (dimensions.includes('props')) {
        const propsKey = combination.props || '';
        const propsMapping = dynamicMapping.props[propsKey];

        if (Array.isArray(propsMapping) && Array.isArray(propsMapping[prefixIndex])) {
          properties = propsMapping[prefixIndex];
        } else if (propsKey === '') {
          // Orientação vazia = propriedade base
          properties = Array.isArray(propertiesConfig[prefixIndex])
            ? propertiesConfig[prefixIndex]
            : [propertiesConfig[prefixIndex] || propertiesConfig[0]];
        }
      } else {
        properties = Array.isArray(propertiesConfig[prefixIndex])
          ? propertiesConfig[prefixIndex]
          : [propertiesConfig[prefixIndex] || propertiesConfig[0]];
      }

      if (!properties || properties.length === 0) continue;

      // Obter token CSS
      const tokenName = getTokenFromCombination(combination, dynamicMapping);
      if (!tokenName) continue;
      if (Array.isArray(tokenPatterns) && tokenPatterns.length > 0) {
        const matches = tokenPatterns.some(p => tokenName.startsWith(p));
        if (!matches) continue;
      }

      // Gerar nome da classe
      const placeholders = { prefix, ...combination };
      const pattern = classPattern || generateDefaultPattern(dimensions);
      const className = '.' + applyClassPattern(pattern, placeholders);

      // Gerar utility
      const utility = generateSimpleUtility(className, properties, tokenName, tokens);
      if (utility) utilities.push(utility);
    }
  }

  return utilities;
};

/**
 * Gera todas as combinações possíveis de dimensões
 */
const generateCombinations = (dynamicMapping) => {
  const dimensions = Object.keys(dynamicMapping);
  const results = [{}];

  for (const dimension of dimensions) {
    const values = dynamicMapping[dimension];
    const newResults = [];

    for (const result of results) {
      for (const [key, value] of Object.entries(values)) {
        // Se o valor é um objeto com 'enabled', usar apenas a chave
        if (value && typeof value === 'object' && !Array.isArray(value) && value.enabled) {
          newResults.push({ ...result, [dimension]: key });
        }
        // Se é um valor direto (string ou array)
        else if (typeof value === 'string' || Array.isArray(value)) {
          newResults.push({ ...result, [dimension]: key });
        }
      }
    }

    results.length = 0;
    results.push(...newResults);
  }

  return results;
};

/**
 * Obtém o token CSS a partir de uma combinação
 */
const getTokenFromCombination = (combination, dynamicMapping) => {
  // Procurar pelo token na última dimensão (geralmente 'variant')
  const dimensions = Object.keys(dynamicMapping);
  const lastDimension = dimensions[dimensions.length - 1];
  const lastKey = combination[lastDimension];

  if (!lastKey) return null;

  const value = dynamicMapping[lastDimension][lastKey];

  if (typeof value === 'string') {
    return value;
  } else if (value && typeof value === 'object' && value.enabled) {
    return value.enabled;
  }

  return null;
};

/**
 * Gera pattern padrão baseado nas dimensões
 */
const generateDefaultPattern = (dimensions) => {
  return '{prefix}' + dimensions.map(d => `-{${d}}`).join('');
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Gera variantes responsivas de utilities
 */
const generateResponsiveUtilities = (baseUtilities, config, tokens) => {
  const breakpoints = config.breakpoints || DEFAULT_BREAKPOINTS;
  const responsiveUtils = [];

  for (const breakpoint of breakpoints) {
    const bpUtilities = [];

    for (const utility of baseUtilities) {
      // Adicionar prefixo de breakpoint ao seletor
      const responsiveUtility = utility.replace(
        /^(\.[^\s{]+)/,
        (match) => `.screen-${breakpoint.name}\\:${match.slice(1)}`
      );

      bpUtilities.push('  ' + responsiveUtility.replace(/\n/g, '\n  '));
    }

    if (bpUtilities.length > 0) {
      responsiveUtils.push(
        `@media (min-width: var(--${breakpoint.token})) {\n${bpUtilities.join('\n')}\n}`
      );
    }
  }

  return responsiveUtils;
};

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Gera utilities para uma categoria completa
 */
export const generateCategoryUtilities = (categoryName, config, tokens) => {
  const utilities = [];

  utilities.push(`/* ${categoryName.toUpperCase()} UTILITIES */`);

  try {
    // Processar mapeamento dinâmico
    if (config.dynamicMapping) {
      const dynamicUtils = processDynamicMapping(categoryName, config, tokens);
      utilities.push(...dynamicUtils);
    }

    // Gerar variantes responsivas se habilitado
    if (config.responsive && utilities.length > 1) {
      const baseUtilities = utilities.slice(1); // Remove o comentário
      const responsiveUtils = generateResponsiveUtilities(baseUtilities, config, tokens);
      utilities.push(...responsiveUtils);
    }

    utilities.push(''); // Linha em branco

  } catch (error) {
    logger.error(`Erro ao processar categoria ${categoryName}: ${error.message}`);
    console.error(error.stack);
  }

  return utilities;
};

/**
 * Gera todas as utilities a partir de um mapping completo
 */
export const generateAllUtilities = (mapping, tokens) => {
  const allUtilities = [];

  for (const [categoryName, categoryConfig] of Object.entries(mapping)) {
    const categoryUtils = generateCategoryUtilities(categoryName, categoryConfig, tokens);
    allUtilities.push(...categoryUtils);
  }

  return allUtilities.join('\n');
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generateCategoryUtilities,
  generateAllUtilities,
  generateResponsiveUtilities,
  processDynamicMapping
};
