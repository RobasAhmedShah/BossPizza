import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string;
  rating: number;
  is_popular: boolean;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  sizes: MenuItemSize[];
  category: Category;
}

export interface MenuItemSize {
  id: string;
  menu_item_id: string;
  size_name: string;
  price: number;
  is_available: boolean;
}

export interface Deal {
  id: string;
  name: string;
  description: string;
  price: number;
  items_included: Record<string, any>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// Order types
export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company?: string;
  delivery_address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  order_notes?: string;
  payment_method: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  total_amount: number;
  order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  estimated_delivery_time?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: 'menu_item' | 'deal' | 'custom_pizza';
  item_id: string;
  item_name: string;
  item_description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations: Record<string, any>;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company?: string;
  delivery_address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  order_notes?: string;
  payment_method: string;
  cart_items: Array<{
    item_type: 'menu_item' | 'deal' | 'custom_pizza';
    item_id: string;
    item_name: string;
    item_description?: string;
    quantity: number;
    unit_price: number;
    customizations?: Record<string, any>;
  }>;
}

// API functions
export const menuAPI = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  },

  // Get menu items by category
  async getMenuItemsByCategory(categorySlug: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        sizes:menu_item_sizes(*),
        category:categories(*)
      `)
      .eq('category.slug', categorySlug)
      .eq('is_available', true)
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  },

  // Get all menu items with categories and sizes
  async getAllMenuItems(): Promise<Record<string, MenuItem[]>> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        sizes:menu_item_sizes(*),
        category:categories(*)
      `)
      .eq('is_available', true)
      .order('sort_order');
    
    if (error) throw error;
    
    // Group by category slug
    const groupedItems: Record<string, MenuItem[]> = {};
    data?.forEach(item => {
      const categorySlug = item.category.slug;
      if (!groupedItems[categorySlug]) {
        groupedItems[categorySlug] = [];
      }
      groupedItems[categorySlug].push(item);
    });
    
    return groupedItems;
  },

  // Get all deals
  async getDeals(): Promise<Deal[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  },

  // Search menu items
  async searchMenuItems(query: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        sizes:menu_item_sizes(*),
        category:categories(*)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_available', true)
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  }
};

// Orders API
export const ordersAPI = {
  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      // Calculate totals
      const subtotal = orderData.cart_items.reduce((sum, item) => 
        sum + (item.unit_price * item.quantity), 0
      );
      const tax_amount = subtotal * 0.08; // 8% tax
      const delivery_fee = subtotal >= 50 ? 0 : 4.99;
      const total_amount = subtotal + tax_amount + delivery_fee;

      // Generate order number
      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number');
      
      if (orderNumberError) throw orderNumberError;
      const order_number = orderNumberData;

      // Calculate estimated delivery time
      const { data: deliveryTimeData, error: deliveryTimeError } = await supabase
        .rpc('calculate_delivery_time');
      
      if (deliveryTimeError) throw deliveryTimeError;
      const estimated_delivery_time = deliveryTimeData;

      // Create the order
      const { data: orderData_result, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          company: orderData.company,
          delivery_address: orderData.delivery_address,
          order_notes: orderData.order_notes,
          payment_method: orderData.payment_method,
          subtotal,
          tax_amount,
          delivery_fee,
          total_amount,
          estimated_delivery_time,
          order_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.cart_items.map(item => ({
        order_id: orderData_result.id,
        item_type: item.item_type,
        item_id: item.item_id,
        item_name: item.item_name,
        item_description: item.item_description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
        customizations: item.customizations || {}
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsError) throw itemsError;

      // Create initial status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderData_result.id,
          status: 'pending',
          notes: 'Order placed successfully',
          created_by: 'customer'
        });

      // Return complete order with items
      return {
        ...orderData_result,
        items: itemsData
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get orders by customer email
  async getOrdersByCustomer(customerEmail: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('customer_email', customerEmail)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get all active orders (not delivered)
  async getActiveOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .neq('order_status', 'delivered')
      .neq('order_status', 'cancelled')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get active orders by customer email
  async getActiveOrdersByCustomer(customerEmail: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('customer_email', customerEmail)
      .neq('order_status', 'delivered')
      .neq('order_status', 'cancelled')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update order status
  async updateOrderStatus(
    orderId: string, 
    status: string, 
    notes?: string, 
    createdBy: string = 'system'
  ): Promise<void> {
    const { error } = await supabase
      .rpc('update_order_status', {
        order_id_param: orderId,
        new_status: status,
        notes_param: notes,
        created_by_param: createdBy
      });

    if (error) throw error;
  },

  // Get order status history
  async getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    const { data, error } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};