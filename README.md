# TimeTravel State Management

A lightweight and type-safe state management library with time-travel capabilities for TypeScript applications.

## Features

- 🕒 Time travel through state changes (undo/redo)
- 📦 Type-safe state management
- 🔄 State change subscriptions
- 📊 Built-in metrics
- 🏷️ State descriptions for debugging
- 💾 Memory-efficient state storage
- ⚡ Zero dependencies

## Installation

```bash
npm install timetravel-state
```

## Quick Start

```typescript
import { TimeTravel } from 'timetravel-state';

interface AppState {
  count: number;
  text: string;
}

// Initialize with initial state
const timeTravel = new TimeTravel<AppState>({
  count: 0,
  text: ''
});

// Subscribe to state changes
const unsubscribe = timeTravel.subscribe((state) => {
  console.log('State updated:', state);
});

// Update state
timeTravel.pushState({ count: 1, text: 'Hello' });

// Undo last change
timeTravel.undo();

// Redo the change
timeTravel.redo();

// Clean up subscription
unsubscribe();
```

## API Reference

### `TimeTravel<T>`

#### Constructor

```typescript
constructor(initialState: T, options?: TimeTravelOptions)
```

Options:
- `maxHistory`: Maximum number of states to keep (default: 50)
- `enableCompression`: Enable state compression (default: false)
- `onStateChange`: Callback for state changes

#### Methods

- `pushState(newState: T, description?: string): void`
- `undo(): T | undefined`
- `redo(): T | undefined`
- `subscribe(subscriber: (state: T) => void): () => void`
- `getCurrentState(): T | undefined`
- `getHistory(): StateSnapshot<T>[]`
- `getMetrics(): TimeTravelMetrics`
- `canUndo(): boolean`
- `canRedo(): boolean`

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.