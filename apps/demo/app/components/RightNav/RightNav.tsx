import React from 'react';
import { PROP_DEFINITIONS, PropDefinition } from '../../../data/propDefinitions';
import PropControl from '../PropControl/PropControl';
import styles from './RightNav.module.css';

interface RightNavProps {
  isOpen: boolean;
  onClose: () => void;
  pickerProps: Record<string, any>;
  updateProp: (name: string, value: any) => void;
}

function CollapsibleCategory({ category, props, pickerProps, updateProp }: any) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={styles.category}>
      <button 
        className={styles.categoryHeader} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className={styles.categoryTitle}>{category}</h3>
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <div className={styles.propsList}>
          {props.map((prop: PropDefinition) => (
            <PropControl
              key={prop.name}
              definition={prop}
              value={pickerProps[prop.name]}
              onChange={(val) => updateProp(prop.name, val)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RightNav({ isOpen, onClose, pickerProps, updateProp }: RightNavProps) {
  // Group properties by category
  const groupedProps = PROP_DEFINITIONS.reduce((acc, prop) => {
    if (!acc[prop.category]) {
      acc[prop.category] = [];
    }
    acc[prop.category].push(prop);
    return acc;
  }, {} as Record<string, PropDefinition[]>);

  return (
    <nav className={`${styles.nav} glass ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <h2>Properties</h2>
      </div>
      <div className={styles.content}>
        {Object.entries(groupedProps).map(([category, props]) => (
          <CollapsibleCategory 
            key={category}
            category={category}
            props={props}
            pickerProps={pickerProps}
            updateProp={updateProp}
          />
        ))}
      </div>
    </nav>
  );
}
