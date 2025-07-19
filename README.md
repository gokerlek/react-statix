# React Statix

React components for statix localization management.

## Installation

```bash
npm install react-statix
```

## Usage

```jsx
import { StatixProvider } from 'react-statix';

function App() {
  return (
    <StatixProvider 
      config={{
        localePath: '/locales',
        languagesKeys: { en: 'en', tr: 'tr' }
      }}
    >
    </StatixProvider>
  );
}
```

## License

MIT
