import React, { useState } from 'react';
import * as TablerIcons from '@tabler/icons-react';
import type { Title } from '@storybook/addon-docs/blocks';

export default {
  title: 'Design System/Icons',
  parameters: {
    layout: 'padded',
  },
};

export const IconGallery = () => {
  const [search, setSearch] = useState('');
  const [copiedIcon, setCopiedIcon] = useState('');

  // Filtrar apenas os componentes de ícone (excluir createReactComponent, etc)
  const icons = Object.keys(TablerIcons)
    .filter(key => key.startsWith('Icon'))
    .filter(key => 
      key.toLowerCase().includes(search.toLowerCase())
    )
    .sort();

  const handleCopy = (iconName) => {
    navigator.clipboard.writeText(`<${iconName} />`);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(''), 2000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>Tabler Icons</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {icons.length} ícones disponíveis
        </p>
        
        <input
          type="text"
          placeholder="Buscar ícones... (ex: home, user, search)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 16px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '16px',
        }}
      >
        {icons.map((iconName) => {
          const IconComponent = TablerIcons[iconName];
          
          return (
            <div
              key={iconName}
              onClick={() => handleCopy(iconName)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                border: '1px solid #eee',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: copiedIcon === iconName ? '#e8f5e9' : 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#999';
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                if (copiedIcon !== iconName) {
                  e.currentTarget.style.borderColor = '#eee';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <IconComponent size={32} stroke={1.5} />
              <span
                style={{
                  marginTop: '12px',
                  fontSize: '11px',
                  textAlign: 'center',
                  color: '#666',
                  wordBreak: 'break-word',
                }}
              >
                {iconName.replace('Icon', '')}
              </span>
              {copiedIcon === iconName && (
                <span
                  style={{
                    fontSize: '10px',
                    color: '#4caf50',
                    marginTop: '4px',
                  }}
                >
                  ✓ Copiado!
                </span>
              )}
            </div>
          );
        })}
      </div>

      {icons.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <p>Nenhum ícone encontrado para "{search}"</p>
        </div>
      )}
    </div>
  );
};