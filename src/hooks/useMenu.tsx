import { useState, useEffect } from 'react';
import { menuAPI, MenuItem, Category, Deal } from '../lib/supabase';
import { preloadedData } from '../components/ui/LoadingScreen';

export const useMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have preloaded data
        if (preloadedData.isLoaded && preloadedData.categories && preloadedData.menuItems && preloadedData.deals) {
          // Use preloaded data
          setCategories(preloadedData.categories);
          setMenuItems(preloadedData.menuItems);
          setDeals(preloadedData.deals);
          setIsLoading(false);
          return;
        }

        // Fallback: fetch data if not preloaded
        const [categoriesData, menuItemsData, dealsData] = await Promise.all([
          menuAPI.getCategories(),
          menuAPI.getAllMenuItems(),
          menuAPI.getDeals()
        ]);

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
        setDeals(dealsData);
      } catch (err) {
        console.error('Error fetching menu data:', err);
        setError('Failed to load menu data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMenuData();
  }, []);

  const searchItems = async (query: string): Promise<MenuItem[]> => {
    try {
      return await menuAPI.searchMenuItems(query);
    } catch (err) {
      console.error('Error searching menu items:', err);
      return [];
    }
  };

  return {
    categories,
    menuItems,
    deals,
    isLoading,
    error,
    searchItems,
    refetch: () => {
      setIsLoading(true);
      // Re-trigger the effect
      setCategories([]);
      setMenuItems({});
      setDeals([]);
    }
  };
};