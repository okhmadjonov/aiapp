export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  sku: string;
  rating: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Suspended';
  avatar: string;
  joinedDate: string;
}

// Helper to simulate network latency
export const delay = (ms: number = 600) => new Promise((resolve) => setTimeout(resolve, ms));

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Quantum Leap Monitor', category: 'Electronics', price: 599.99, stock: 12, status: 'In Stock', sku: 'MON-QLEAP-27', rating: 4.8, createdAt: '2026-01-15' },
  { id: '2', name: 'Cybernetic Keyboard Lite', category: 'Electronics', price: 129.99, stock: 45, status: 'In Stock', sku: 'KBD-CYBER-LT', rating: 4.5, createdAt: '2026-02-10' },
  { id: '3', name: 'Ergonomic Aero Chair', category: 'Furniture', price: 349.99, stock: 3, status: 'Low Stock', sku: 'CHR-AERO-ERG', rating: 4.9, createdAt: '2026-03-01' },
  { id: '4', name: 'Holographic Desk Lamp', category: 'Furniture', price: 89.99, stock: 0, status: 'Out of Stock', sku: 'LMP-HOLO-DSK', rating: 4.2, createdAt: '2026-03-12' },
  { id: '5', name: 'Titanium Travel Mug', category: 'Accessories', price: 45.00, stock: 120, status: 'In Stock', sku: 'MUG-TITAN-TRV', rating: 4.7, createdAt: '2026-03-24' },
  { id: '6', name: 'Active Noise Canceling Pods', category: 'Electronics', price: 199.99, stock: 24, status: 'In Stock', sku: 'POD-ANC-ACTV', rating: 4.6, createdAt: '2026-04-02' },
  { id: '7', name: 'Leather Tech Portfolio', category: 'Accessories', price: 79.99, stock: 8, status: 'Low Stock', sku: 'PRT-LTECH-BL', rating: 4.4, createdAt: '2026-04-18' },
  { id: '8', name: 'Fleece Commuter Jacket', category: 'Clothing', price: 110.00, stock: 30, status: 'In Stock', sku: 'JKT-FLC-COMM', rating: 4.3, createdAt: '2026-05-05' }
];

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Lazizbek Khasanov', email: 'laziz@admin.com', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', joinedDate: '2025-09-12' },
  { id: '2', name: 'Dilnoza Salimova', email: 'dilnoza@editor.com', role: 'Editor', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', joinedDate: '2025-11-04' },
  { id: '3', name: 'Sherzod Alimov', email: 'sherzod@viewer.com', role: 'Viewer', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', joinedDate: '2026-01-20' },
  { id: '4', name: 'Madina Tursunova', email: 'madina@editor.com', role: 'Editor', status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', joinedDate: '2026-02-15' },
  { id: '5', name: 'Otabek Rasulov', email: 'otabek@viewer.com', role: 'Viewer', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', joinedDate: '2026-03-29' }
];

// Initialize DB if not present
const getStoredData = <T>(key: string, initial: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const setStoredData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- PRODUCTS API (React Query CRUD) ---
export const productsApi = {
  getAll: async (params?: { search?: string; category?: string; sortBy?: keyof Product; sortOrder?: 'asc' | 'desc' }): Promise<Product[]> => {
    await delay(700);
    let products = getStoredData<Product>('admin_products', INITIAL_PRODUCTS);

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(searchLower) || p.sku.toLowerCase().includes(searchLower));
    }

    if (params?.category && params.category !== 'All') {
      products = products.filter(p => p.category === params.category);
    }

    if (params?.sortBy) {
      const key = params.sortBy;
      const order = params.sortOrder === 'desc' ? -1 : 1;
      products = [...products].sort((a, b) => {
        if (a[key] < b[key]) return -1 * order;
        if (a[key] > b[key]) return 1 * order;
        return 0;
      });
    }

    return products;
  },

  getById: async (id: string): Promise<Product | undefined> => {
    await delay(300);
    const products = getStoredData<Product>('admin_products', INITIAL_PRODUCTS);
    return products.find(p => p.id === id);
  },

  create: async (productData: Omit<Product, 'id' | 'createdAt' | 'status' | 'rating'>): Promise<Product> => {
    await delay(800);
    const products = getStoredData<Product>('admin_products', INITIAL_PRODUCTS);
    
    let status: Product['status'] = 'In Stock';
    if (productData.stock === 0) status = 'Out of Stock';
    else if (productData.stock <= 5) status = 'Low Stock';

    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(2, 9),
      status,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    products.unshift(newProduct);
    setStoredData('admin_products', products);
    return newProduct;
  },

  update: async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> => {
    await delay(800);
    const products = getStoredData<Product>('admin_products', INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) throw new Error('Product not found');

    let updatedProduct = { ...products[index], ...updates };
    
    // Auto status compute if stock updated
    if (updates.stock !== undefined) {
      if (updates.stock === 0) updatedProduct.status = 'Out of Stock';
      else if (updates.stock <= 5) updatedProduct.status = 'Low Stock';
      else updatedProduct.status = 'In Stock';
    }

    products[index] = updatedProduct;
    setStoredData('admin_products', products);
    return updatedProduct;
  },

  delete: async (id: string): Promise<string> => {
    await delay(700);
    const products = getStoredData<Product>('admin_products', INITIAL_PRODUCTS);
    const filtered = products.filter(p => p.id !== id);
    setStoredData('admin_products', filtered);
    return id;
  }
};

// --- USERS API (Used as base data or simulated Redux fetch) ---
export const usersApi = {
  getInitialUsers: (): User[] => {
    return getStoredData<User>('admin_users', INITIAL_USERS);
  },
  
  saveUsers: (users: User[]): void => {
    setStoredData('admin_users', users);
  }
};
