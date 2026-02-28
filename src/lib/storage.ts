import { Product, Service, Settings } from './types';

const STORAGE_KEYS = {
  PRODUCTS: 'oil_workshop_products',
  SERVICES: 'oil_workshop_services',
  SETTINGS: 'oil_workshop_settings',
} as const;

// Generic storage functions
export const getStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export const setStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

export const removeStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
};

// Product functions
export const getProducts = (): Product[] => {
  return getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []);
};

export const setProducts = (products: Product[]): void => {
  setStorage(STORAGE_KEYS.PRODUCTS, products);
};

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find(p => p.id === id);
};

// Service functions
export const getServices = (): Service[] => {
  return getStorage<Service[]>(STORAGE_KEYS.SERVICES, []);
};

export const setServices = (services: Service[]): void => {
  setStorage(STORAGE_KEYS.SERVICES, services);
};

// Settings functions
export const getSettings = (): Settings => {
  const defaultSettings: Settings = {
    companyName: 'ورشة تغيير الزيت',
    companyAddress: '',
    companyPhone: '',
    taxRate: 15,
  };
  return getStorage<Settings>(STORAGE_KEYS.SETTINGS, defaultSettings);
};

export const setSettings = (settings: Settings): void => {
  setStorage(STORAGE_KEYS.SETTINGS, settings);
};

// Seed initial data
export const seedInitialData = (): void => {
  if (typeof window === 'undefined') return;

  // Only seed if no products exist
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const initialProducts: Product[] = [
      {
        id: '1',
        name: 'زيت محرك موبيل 1',
        type: 'oil',
        purchasePrice: 45,
        sellingPrice: 65,
        currentStock: 50,
        minStockAlert: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'زيت محرك كاسترول',
        type: 'oil',
        purchasePrice: 40,
        sellingPrice: 58,
        currentStock: 40,
        minStockAlert: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'زيت محرك شل',
        type: 'oil',
        purchasePrice: 35,
        sellingPrice: 50,
        currentStock: 35,
        minStockAlert: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'فلتر زيت',
        type: 'filter',
        purchasePrice: 15,
        sellingPrice: 25,
        currentStock: 30,
        minStockAlert: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'فلتر هواء',
        type: 'filter',
        purchasePrice: 12,
        sellingPrice: 20,
        currentStock: 25,
        minStockAlert: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'فلتر بنزين',
        type: 'filter',
        purchasePrice: 18,
        sellingPrice: 28,
        currentStock: 20,
        minStockAlert: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: '7',
        name: 'إضافات محسن الأداء',
        type: 'additive',
        purchasePrice: 25,
        sellingPrice: 40,
        currentStock: 15,
        minStockAlert: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: '8',
        name: 'مادة مانعة للتسرب',
        type: 'additive',
        purchasePrice: 20,
        sellingPrice: 35,
        currentStock: 15,
        minStockAlert: 5,
        createdAt: new Date().toISOString(),
      },
    ];
    setProducts(initialProducts);
  }

  // Seed settings if not exist
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    const initialSettings: Settings = {
      companyName: 'ورشة تغيير الزيت',
      companyAddress: '',
      companyPhone: '',
      taxRate: 15,
    };
    setSettings(initialSettings);
  }
};
