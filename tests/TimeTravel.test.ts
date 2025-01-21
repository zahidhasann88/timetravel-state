import { TimeTravel } from '../src/TimeTravel';

interface TestState {
  count: number;
  text: string;
}

describe('TimeTravel', () => {
  let timeTravel: TimeTravel<TestState>;
  const initialState: TestState = { count: 0, text: '' };

  beforeEach(() => {
    timeTravel = new TimeTravel<TestState>(initialState);
  });

  describe('State Management', () => {
    it('should initialize with the initial state', () => {
      expect(timeTravel.getCurrentState()).toEqual(initialState);
    });

    it('should push new states correctly', () => {
      const newState = { count: 1, text: 'test' };
      timeTravel.pushState(newState);
      expect(timeTravel.getCurrentState()).toEqual(newState);
    });

    it('should handle undo/redo operations', () => {
      const state1 = { count: 1, text: 'one' };
      const state2 = { count: 2, text: 'two' };

      timeTravel.pushState(state1);
      timeTravel.pushState(state2);

      expect(timeTravel.getCurrentState()).toEqual(state2);
      expect(timeTravel.undo()).toEqual(state1);
      expect(timeTravel.redo()).toEqual(state2);
    });

    it('should handle subscribers correctly', () => {
      const subscriber = jest.fn();
      const unsubscribe = timeTravel.subscribe(subscriber);

      timeTravel.pushState({ count: 1, text: 'test' });
      expect(subscriber).toHaveBeenCalled();

      unsubscribe();
      timeTravel.pushState({ count: 2, text: 'test2' });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should respect maxHistory limit', () => {
      const limitedTimeTravel = new TimeTravel<TestState>(initialState, { maxHistory: 2 });
      
      limitedTimeTravel.pushState({ count: 1, text: 'one' });
      limitedTimeTravel.pushState({ count: 2, text: 'two' });
      limitedTimeTravel.pushState({ count: 3, text: 'three' });

      expect(limitedTimeTravel.getHistory().length).toBe(2);
      expect(limitedTimeTravel.getCurrentState()).toEqual({ count: 3, text: 'three' });
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid states', () => {
      expect(() => timeTravel.pushState(undefined as any)).toThrow();
    });

    it('should handle edge cases for undo/redo', () => {
      expect(timeTravel.undo()).toBeUndefined();
      expect(timeTravel.redo()).toBeUndefined();
    });
  });

  describe('Metrics', () => {
    it('should provide accurate metrics', () => {
      const metrics = timeTravel.getMetrics();
      
      expect(metrics).toHaveProperty('totalStates');
      expect(metrics).toHaveProperty('currentIndex');
      expect(metrics).toHaveProperty('memoryUsage');
    });
  });
});