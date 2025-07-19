# React Statix

React Statix is a powerful React library that enhances your i18next localization workflow with inline translation editing capabilities. It allows developers and content managers to edit translations directly in the UI during development or content management phases.

![React Statix Logo](https://raw.githubusercontent.com/gokerlek/react-statix/main/src/assets/statix.svg)

## Features

- 🔄 Seamless integration with i18next and react-i18next
- ✏️ Inline translation editing directly in your UI
- 💾 Automatic saving of translation changes to localStorage
- 📦 Export changes for backend integration
- 🌐 Support for multiple languages
- 🎨 Customizable configuration options

## Installation

Install React Statix along with its required dependencies:

```bash
# Using npm
npm install react-statix react-i18next i18next

# Using yarn
yarn add react-statix react-i18next i18next

# Using pnpm
pnpm add react-statix react-i18next i18next
```

> **Important Note**: While react-statix enhances i18next functionality, it does not include or configure i18next itself. You need to set up i18next separately according to your project requirements. React Statix simply provides tools to edit translations that are managed by i18next.

## Basic Setup

### 1. Set up i18next (Required Prerequisite)

Before using React Statix, you must first set up i18next in your application. This is a separate configuration step that would be required even if you weren't using React Statix:

```jsx
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to React Statix',
          description: 'Edit translations directly in your UI'
        }
      },
      fr: {
        translation: {
          welcome: 'Bienvenue à React Statix',
          description: 'Modifiez les traductions directement dans votre interface'
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### 2. Wrap your application with StatixProvider

```jsx
// index.jsx or App.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { StatixProvider } from 'react-statix';
import App from './App';

// Import your i18n configuration
import './i18n';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StatixProvider
      config={{
        localePath: '/locales',
        languagesKeys: { en: 'English', fr: 'French' },
        onSave: (changes) => {
          // Handle saving changes to your backend
          console.log('Translation changes:', changes);
        }
      }}
    >
      <App />
    </StatixProvider>
  </React.StrictMode>
);
```

### 3. Use the useEditableTranslation hook in your components

```jsx
// MyComponent.jsx
import React from 'react';
import { useEditableTranslation } from 'react-statix';

const MyComponent = () => {
  const { t } = useEditableTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};

export default MyComponent;
```

## Understanding i18next Independence

React Statix is designed to work **alongside** i18next, not replace it. Here's what you need to understand:

- **Separate Packages**: i18next and react-i18next are separate libraries that React Statix integrates with
- **Configuration Control**: You maintain full control over your i18next configuration
- **Translation Management**: i18next handles the core translation functionality; React Statix adds editing capabilities
- **No Forced Patterns**: React Statix doesn't force any specific i18next configuration pattern
- **Complementary Tools**: Think of React Statix as an optional enhancement layer for i18next

This means you can configure i18next according to your project's specific needs (including backends, language detection, etc.) and React Statix will work with your configuration without interference.

## Usage

### Editing Translations

When in editable mode (enabled by default), hovering over any translated text will display an editing interface. You can edit the translation for any language directly in the UI.

### Saving Changes

React Statix automatically saves changes to localStorage. To persist changes to your backend:

1. Use the built-in Save button that appears in the UI
2. Implement a custom save handler in the StatixProvider config

```jsx
<StatixProvider
  config={{
    // ...other config options
    onSave: (changes) => {
      // Send changes to your API
      fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
      });
    }
  }}
>
  {/* Your app */}
</StatixProvider>
```

### Adding the SaveStatix Component

For more control over saving and resetting changes, you can add the SaveStatix component anywhere in your application:

```jsx
import { SaveStatix } from 'react-statix';

const MyApp = () => {
  return (
    <div>
      {/* Your app content */}
      <SaveStatix />
    </div>
  );
};
```

## API Reference

### StatixProvider

The main provider component that enables the translation editing functionality.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| config | Object | Configuration options |
| config.localePath | string | Path to your localization files (default: "public/locales") |
| config.languagesKeys | Object | Map of language codes to display names |
| config.onSave | Function | Custom handler for saving changes |
| children | ReactNode | Your application components |

### useEditableTranslation

A hook that wraps react-i18next's useTranslation hook with editing capabilities. This hook is a drop-in replacement for react-i18next's useTranslation hook.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| t | Function | Translation function that supports inline editing (enhances i18next's t function) |
| i18n | Object | The i18next instance (passed through directly from i18next) |

### useStatix

A hook that provides access to the Statix context.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| editable | boolean | Whether editing mode is enabled |
| setEditable | Function | Function to toggle editing mode |
| locales | Object | Loaded localization data |
| updateLocalValue | Function | Update a translation value |
| pendingChanges | Object | Current unsaved changes |
| resetChanges | Function | Reset all pending changes |
| saveChanges | Function | Save all pending changes |

### Statix

A component that wraps translated text with editing capabilities.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| children | string | The translated text |
| keyPath | string | The translation key path (optional) |
| lang | string | The language code (optional) |

### SaveStatix

A component that provides UI buttons for saving and resetting changes.

## Examples

### Toggling Edit Mode

```jsx
import React from 'react';
import { useStatix, useEditableTranslation } from 'react-statix';

const AdminPanel = () => {
  const { editable, setEditable } = useStatix();
  const { t } = useEditableTranslation();
  
  return (
    <div>
      <h1>{t('admin.title')}</h1>
      <button onClick={() => setEditable(!editable)}>
        {editable ? 'Disable' : 'Enable'} Translation Editing
      </button>
    </div>
  );
};
```

### Working with Nested Translation Keys

```jsx
import React from 'react';
import { useEditableTranslation } from 'react-statix';

const UserProfile = ({ user }) => {
  const { t } = useEditableTranslation();
  
  return (
    <div>
      <h2>{t('profile.greeting', { name: user.name })}</h2>
      <p>{t('profile.info.bio')}</p>
      <p>{t('profile.info.contact')}</p>
    </div>
  );
};
```

## License

MIT
