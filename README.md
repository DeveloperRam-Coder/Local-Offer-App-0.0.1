# Local Offers App

A React Native app for discovering and managing local deals and offers.

## Project Structure

```
frontend/
  ├── src/                    # Source code
  │   ├── components/         # Reusable UI components
  │   ├── screens/           # Screen components
  │   ├── navigation/        # Navigation configuration
  │   ├── hooks/            # Custom React hooks
  │   ├── utils/            # Helper functions
  │   └── App.tsx           # Root app component
  ├── assets/               # Static assets
  └── package.json          # Dependencies and scripts
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on Android:
```bash
npm run android
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## Folder Structure Details

- `src/components/` - Reusable UI components like buttons, cards, etc.
- `src/screens/` - Full-screen components for each route
- `src/navigation/` - Navigation setup and types
- `src/hooks/` - Custom React hooks for shared logic
- `src/utils/` - Helper functions and constants