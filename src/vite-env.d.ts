/// <reference types="vite/client" />

// Global declarations for Tawk.to
declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      [key: string]: any;
    };
    Tawk_LoadStart?: Date;
  }
}

export {};