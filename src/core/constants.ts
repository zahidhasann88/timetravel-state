// src/core/constants.ts
export const DEFAULT_OPTIONS = {
    maxHistory: 50,
    enableCompression: false,
    onStateChange: null,
  } as const;
  
  export const ERRORS = {
    INVALID_STATE: 'Invalid state provided',
    INVALID_INDEX: 'Invalid index for time travel',
    HISTORY_LIMIT: 'History limit reached',
  } as const;