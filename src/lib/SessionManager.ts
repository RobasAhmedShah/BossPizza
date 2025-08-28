import { ActiveOrder } from '../contexts/OrderTrackingContext';
import { CartItem } from '../contexts/CartContext';

// Session data structure
export interface SessionData {
  version: string;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  user: {
    id?: string;
    phone?: string;
    email?: string;
    name?: string;
    selectedBranch?: string;
    deliveryAddress?: string;
  } | null;
  cart: {
    items: CartItem[];
    lastModified: number;
  };
  activeOrders: {
    orders: ActiveOrder[];
    lastUpdated: number;
  };
  menuData: {
    categories: any[];
    menuItems: Record<string, any[]>;
    deals: any[];
    lastFetched: number;
    version: string;
  } | null;
  navigation: {
    currentPath: string;
    scrollPositions: Record<string, number>;
    lastRoute: string;
    searchParams: Record<string, string>;
  };
  preferences: {
    theme?: string;
    language?: string;
    notifications?: boolean;
    lastPizzaSelection?: string;
  };
}

export class SessionManager {
  private static instance: SessionManager;
  private readonly storageKey = 'bigBossSession';
  private readonly version = '1.0.0';
  private readonly defaultTTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly menuCacheTTL = 60 * 60 * 1000; // 1 hour for menu data
  private readonly cartTTL = 7 * 24 * 60 * 60 * 1000; // 7 days for cart
  private readonly navigationTTL = 30 * 60 * 1000; // 30 minutes for navigation state

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Initialize session on app start
  public initializeSession(): SessionData {
    try {
      const existingSession = this.loadSession();
      if (existingSession && this.isSessionValid(existingSession)) {
        console.log('🔄 Restoring valid session from cache');
        return this.cleanExpiredData(existingSession);
      } else {
        console.log('🆕 Creating new session');
        return this.createNewSession();
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      this.clearSession();
      return this.createNewSession();
    }
  }

  // Save session data
  public saveSession(data: Partial<SessionData>): void {
    try {
      const currentSession = this.loadSession() || this.createNewSession();
      const updatedSession: SessionData = {
        ...currentSession,
        ...data,
        timestamp: Date.now(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(updatedSession));
      console.log('💾 Session saved successfully');
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  // Load session data
  public loadSession(): SessionData | null {
    try {
      const sessionData = localStorage.getItem(this.storageKey);
      if (!sessionData) return null;

      const parsed = JSON.parse(sessionData);
      
      // Convert date strings back to Date objects for active orders
      if (parsed.activeOrders?.orders) {
        parsed.activeOrders.orders = parsed.activeOrders.orders.map((order: any) => ({
          ...order,
          estimatedDeliveryTime: new Date(order.estimatedDeliveryTime),
          createdAt: new Date(order.createdAt),
        }));
      }

      return parsed;
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  }

  // Check if session is valid
  private isSessionValid(session: SessionData): boolean {
    const now = Date.now();
    const isExpired = now - session.timestamp > session.ttl;
    const isVersionValid = session.version === this.version;
    
    console.log('🔍 Session validation:', {
      expired: isExpired,
      versionValid: isVersionValid,
      age: Math.round((now - session.timestamp) / 1000 / 60) + ' minutes'
    });

    return !isExpired && isVersionValid;
  }

  // Clean expired data components
  private cleanExpiredData(session: SessionData): SessionData {
    const now = Date.now();
    
    // Clean expired menu data
    if (session.menuData && now - session.menuData.lastFetched > this.menuCacheTTL) {
      console.log('🗑️ Menu cache expired, will refetch');
      session.menuData = null;
    }

    // Clean expired cart data (but be more conservative)
    if (session.cart && now - session.cart.lastModified > this.cartTTL) {
      console.log('⚠️ Cart cache expired but keeping items for user convenience');
      // Don't actually clear the cart, just update the timestamp
      // Users can manually clear if they want
      session.cart.lastModified = now;
    }

    // Clean expired navigation data
    if (session.navigation && now - session.timestamp > this.navigationTTL) {
      console.log('🗑️ Navigation cache expired, resetting to home');
      session.navigation = {
        currentPath: '/',
        scrollPositions: {},
        lastRoute: '/',
        searchParams: {}
      };
    }

    // Clean expired active orders
    if (session.activeOrders?.orders) {
      const validOrders = session.activeOrders.orders.filter(order => 
        new Date(order.estimatedDeliveryTime) > new Date()
      );
      if (validOrders.length !== session.activeOrders.orders.length) {
        console.log(`🗑️ Removed ${session.activeOrders.orders.length - validOrders.length} expired orders`);
        session.activeOrders.orders = validOrders;
      }
    }

    return session;
  }

  // Create new session
  private createNewSession(): SessionData {
    return {
      version: this.version,
      timestamp: Date.now(),
      ttl: this.defaultTTL,
      user: null,
      cart: {
        items: [],
        lastModified: Date.now()
      },
      activeOrders: {
        orders: [],
        lastUpdated: Date.now()
      },
      menuData: null,
      navigation: {
        currentPath: '/',
        scrollPositions: {},
        lastRoute: '/',
        searchParams: {}
      },
      preferences: {
        notifications: true
      }
    };
  }

  // Update specific session components
  public updateUser(user: any): void {
    this.saveSession({ user });
  }

  public updateCart(items: CartItem[]): void {
    console.log(`🛒 SessionManager: Updating cart with ${items.length} items`);
    this.saveSession({
      cart: {
        items,
        lastModified: Date.now()
      }
    });
  }

  public updateActiveOrders(orders: ActiveOrder[]): void {
    this.saveSession({
      activeOrders: {
        orders,
        lastUpdated: Date.now()
      }
    });
  }

  public updateMenuData(categories: any[], menuItems: Record<string, any[]>, deals: any[]): void {
    this.saveSession({
      menuData: {
        categories,
        menuItems,
        deals,
        lastFetched: Date.now(),
        version: this.version
      }
    });
  }

  public updateNavigation(path: string, searchParams: Record<string, string> = {}): void {
    const session = this.loadSession();
    if (session) {
      this.saveSession({
        navigation: {
          ...session.navigation,
          currentPath: path,
          lastRoute: session.navigation.currentPath,
          searchParams
        }
      });
    }
  }

  public updateScrollPosition(path: string, position: number): void {
    const session = this.loadSession();
    if (session) {
      this.saveSession({
        navigation: {
          ...session.navigation,
          scrollPositions: {
            ...session.navigation.scrollPositions,
            [path]: position
          }
        }
      });
    }
  }

  public updatePreferences(preferences: Partial<SessionData['preferences']>): void {
    const session = this.loadSession();
    if (session) {
      this.saveSession({
        preferences: {
          ...session.preferences,
          ...preferences
        }
      });
    }
  }

  // Check if data needs refresh
  public shouldRefreshMenuData(): boolean {
    const session = this.loadSession();
    if (!session?.menuData) return true;
    
    const age = Date.now() - session.menuData.lastFetched;
    return age > this.menuCacheTTL;
  }

  // Debug cart data
  public debugCart(): { hasCart: boolean; itemCount: number; lastModified: string; age: string } {
    const session = this.loadSession();
    if (!session?.cart) {
      return { hasCart: false, itemCount: 0, lastModified: 'Never', age: 'N/A' };
    }

    const age = Date.now() - session.cart.lastModified;
    return {
      hasCart: true,
      itemCount: session.cart.items.length,
      lastModified: new Date(session.cart.lastModified).toLocaleString(),
      age: this.formatDuration(age)
    };
  }

  public getMenuData(): { categories: any[], menuItems: Record<string, any[]>, deals: any[] } | null {
    const session = this.loadSession();
    if (!session?.menuData || this.shouldRefreshMenuData()) {
      return null;
    }
    
    return {
      categories: session.menuData.categories,
      menuItems: session.menuData.menuItems,
      deals: session.menuData.deals
    };
  }

  // Clear session
  public clearSession(): void {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ Session cleared');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // Force refresh session (for debugging or manual refresh)
  public forceRefresh(): void {
    console.log('🔄 Forcing session refresh');
    this.clearSession();
    window.location.reload();
  }

  // Export session for debugging
  public exportSession(): string {
    const session = this.loadSession();
    return JSON.stringify(session, null, 2);
  }

  // Get session stats
  public getSessionStats(): {
    age: string;
    size: string;
    valid: boolean;
    components: Record<string, { size: number; age: string; valid: boolean }>;
  } {
    const session = this.loadSession();
    if (!session) {
      return {
        age: 'No session',
        size: '0 KB',
        valid: false,
        components: {}
      };
    }

    const now = Date.now();
    const sessionSize = new Blob([JSON.stringify(session)]).size;
    
    return {
      age: this.formatDuration(now - session.timestamp),
      size: `${Math.round(sessionSize / 1024)} KB`,
      valid: this.isSessionValid(session),
      components: {
        user: {
          size: new Blob([JSON.stringify(session.user || {})]).size,
          age: this.formatDuration(now - session.timestamp),
          valid: !!session.user
        },
        cart: {
          size: new Blob([JSON.stringify(session.cart)]).size,
          age: this.formatDuration(now - session.cart.lastModified),
          valid: now - session.cart.lastModified < this.cartTTL
        },
        menuData: {
          size: new Blob([JSON.stringify(session.menuData || {})]).size,
          age: session.menuData ? this.formatDuration(now - session.menuData.lastFetched) : 'Never',
          valid: !!session.menuData && now - session.menuData.lastFetched < this.menuCacheTTL
        },
        activeOrders: {
          size: new Blob([JSON.stringify(session.activeOrders)]).size,
          age: this.formatDuration(now - session.activeOrders.lastUpdated),
          valid: session.activeOrders.orders.length > 0
        }
      }
    };
  }

  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();
