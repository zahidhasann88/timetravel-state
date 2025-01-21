# API Documentation

## TimeTravel<T>

The main class for managing state history with time-travel capabilities.

### Type Parameters

- `T`: The type of state being managed

### Constructor

```typescript
constructor(initialState: T, options?: TimeTravelOptions)
```

#### Options

```typescript
interface TimeTravelOptions {
  maxHistory?: number;        // Maximum number of states to keep
  enableCompression?: boolean; // Enable state compression
  onStateChange?: (state: T) => void; // Callback for state changes
}
```

### Methods

#### pushState

```typescript
pushState(newState: T, description?: string): void
```

Adds a new state to the history.

#### undo

```typescript
undo(): T | undefined
```

Reverts to the previous state in history.

#### redo

```typescript
redo(): T | undefined
```

Advances to the next state in history.

#### subscribe

```typescript
subscribe(subscriber: (state: T) => void): () => void
```

Subscribes to state changes and returns an unsubscribe function.

#### getMetrics

```typescript
getMetrics(): TimeTravelMetrics
```

Returns current metrics about the state history.

### Types

#### StateSnapshot

```typescript
interface StateSnapshot<T> {
  state: T;
  timestamp: number;
  description?: string;
  hash?: string;
}
```

#### TimeTravelMetrics

```typescript
interface TimeTravelMetrics {
  totalStates: number;
  currentIndex: number;
  memoryUsage: number;
}
```

## Examples

### Basic Usage

```typescript
const timeTravel = new TimeTravel<number>(0);
timeTravel.pushState(1);
timeTravel.pushState(2);
timeTravel.undo(); // Returns to 1
timeTravel.redo(); // Returns to 2
```

### With Subscribers

```typescript
const timeTravel = new TimeTravel<number>(0);
const unsubscribe = timeTravel.subscribe(state => {
  console.log('State changed:', state);
});

// Later: cleanup
unsubscribe();
```