# React Statix

React components for statix localization management.

## Installation

```bash
npm install react-statix
```

## Usage

```jsx
import { StatixProvider, Statix } from 'react-statix';

function App() {
  return (
    <StatixProvider 
      config={{
        localePath: '/locales',
        languagesKeys: { en: 'English', tr: 'Turkish' }
      }}
    >
      <Statix />
    </StatixProvider>
  );
}
```

## Components

- `StatixProvider`: Context provider for statix configuration
- `Statix`: Main statix component
- `StatixDrawer`: Drawer component for statix interface
- `StatixButton`: Button component for statix actions
- `StatixContent`: Content component for statix display

## License

MIT