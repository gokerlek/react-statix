# React Statix

React components for statix localization management.

## Installation

```bash
npm install react-statix
```

## Usage

```jsx
import { StatixProvider } from 'react-statix';

import "./i18n.js";

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
                <StatixProvider
                    config={{
                        localePath: '/locales',
                        languagesKeys: { en: 'en', tr: 'tr' }
                    }}
                >
                    {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
                    <App />
                    <Toaster />
                </StatixProvider>
        </StrictMode>,
  );
```

## License

MIT
