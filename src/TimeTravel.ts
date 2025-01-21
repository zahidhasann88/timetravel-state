import {
  TimeTravelOptions,
  StateSnapshot,
  TimeTravelMetrics,
  TimeTravelSubscriber,
  RequiredOptions,
} from './core/types';
import { DEFAULT_OPTIONS, ERRORS } from './core/constants';
import { createHash } from 'crypto';

export class TimeTravel<T> {
  private history: StateSnapshot<T>[] = [];
  private currentIndex: number = -1;
  private options: RequiredOptions;
  private subscribers: Set<TimeTravelSubscriber<T>> = new Set();

  constructor(initialState: T, options: TimeTravelOptions = {}) {
    this.options = {
      maxHistory: options.maxHistory ?? DEFAULT_OPTIONS.maxHistory,
      enableCompression:
        options.enableCompression ?? DEFAULT_OPTIONS.enableCompression,
      onStateChange: options.onStateChange ?? DEFAULT_OPTIONS.onStateChange,
    };
    this.pushState(initialState);
  }

  public pushState(newState: T, description?: string): void {
    if (newState === undefined) {
      throw new Error(ERRORS.INVALID_STATE);
    }

    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    const snapshot: StateSnapshot<T> = {
      state: this.cloneState(newState),
      timestamp: Date.now(),
      description,
      hash: this.generateStateHash(newState),
    };

    this.history.push(snapshot);

    if (this.history.length > this.options.maxHistory) {
      this.history.shift();
    }

    this.currentIndex = this.history.length - 1;
    this.notifySubscribers();
  }

  public undo(): T | undefined {
    if (this.canUndo()) {
      this.currentIndex--;
      const state = this.getCurrentState();
      this.notifySubscribers();
      return state;
    }
    return undefined;
  }

  public redo(): T | undefined {
    if (this.canRedo()) {
      this.currentIndex++;
      const state = this.getCurrentState();
      this.notifySubscribers();
      return state;
    }
    return undefined;
  }

  public subscribe(subscriber: TimeTravelSubscriber<T>): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  public getMetrics(): TimeTravelMetrics {
    return {
      totalStates: this.history.length,
      currentIndex: this.currentIndex,
      memoryUsage: this.calculateMemoryUsage(),
    };
  }

  private cloneState(state: T): T {
    return structuredClone(state);
  }

  private generateStateHash(state: T): string {
    const stateString = JSON.stringify(state);
    return createHash('sha256').update(stateString).digest('hex');
  }

  private calculateMemoryUsage(): number {
    return new TextEncoder().encode(JSON.stringify(this.history)).length;
  }

  private notifySubscribers(): void {
    const currentState = this.getCurrentState();
    if (currentState) {
      this.subscribers.forEach(subscriber => subscriber(currentState));
      if (this.options.onStateChange) {
        this.options.onStateChange(currentState);
      }
    }
  }

  public canUndo(): boolean {
    return this.currentIndex > 0;
  }

  public canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  public getCurrentState(): T | undefined {
    return this.history[this.currentIndex]?.state;
  }

  public getHistory(): StateSnapshot<T>[] {
    return [...this.history];
  }
}
