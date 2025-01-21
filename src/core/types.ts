// src/core/types.ts
export interface TimeTravelOptions {
    maxHistory?: number;
    enableCompression?: boolean;
    onStateChange?: (state: unknown) => void;
  }
  
  export type RequiredOptions = {
    maxHistory: number;
    enableCompression: boolean;
    onStateChange: ((state: unknown) => void) | null;
  }
  
  export interface StateSnapshot<T> {
    state: T;
    timestamp: number;
    description?: string;
    hash?: string;
  }
  
  export interface TimeTravelMetrics {
    totalStates: number;
    currentIndex: number;
    memoryUsage: number;
  }
  
  export type TimeTravelSubscriber<T> = (state: T) => void;