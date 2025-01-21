import { TimeTravel } from '../src/TimeTravel';

// Define your state type
interface TodoState {
  todos: Array<{
    id: number;
    text: string;
    completed: boolean;
  }>;
  filter: 'all' | 'active' | 'completed';
}

// Create initial state
const initialState: TodoState = {
  todos: [],
  filter: 'all'
};

// Initialize TimeTravel
const timeTravel = new TimeTravel<TodoState>(initialState);

// Subscribe to state changes
const unsubscribe = timeTravel.subscribe((state) => {
  console.log('State updated:', state);
});

// Add a todo
timeTravel.pushState({
  ...timeTravel.getCurrentState()!,
  todos: [
    ...timeTravel.getCurrentState()!.todos,
    { id: 1, text: 'Learn TimeTravel', completed: false }
  ]
}, 'Add todo');

// Toggle todo completion
const currentState = timeTravel.getCurrentState()!;
timeTravel.pushState({
  ...currentState,
  todos: currentState.todos.map(todo =>
    todo.id === 1 ? { ...todo, completed: true } : todo
  )
}, 'Complete todo');

// Undo the last action
console.log('Undoing...');
timeTravel.undo();

// Redo the action
console.log('Redoing...');
timeTravel.redo();

// Get metrics
console.log('Metrics:', timeTravel.getMetrics());

// Cleanup
unsubscribe();