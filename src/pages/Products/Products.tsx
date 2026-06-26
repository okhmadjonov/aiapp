import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import { productsApi } from '../../services/mockApi';
import type { Product } from '../../services/mockApi';
import Modal from '../../components/UI/Modal';
import { TableSkeleton } from '../../components/UI/Skeletons';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiShoppingBag, 
  FiDollarSign, 
  FiLayers, 
  FiBox, 
  FiArrowUp, 
  FiArrowDown 
} from 'react-icons/fi';
import './Products.scss';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // Filter, search & sort states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [sku, setSku] = useState('');
  const [formError, setFormError] = useState('');

  // 1. Fetch products using React Query (automatically caches and refetches on state change)
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', search, category, sortBy, sortOrder],
    queryFn: () => productsApi.getAll({ search, category, sortBy, sortOrder })
  });

  // 2. Add product Mutation
  const addMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      dispatch(addNotification({
        type: 'success',
        message: `Product "${newProduct.name}" created with SKU ${newProduct.sku}.`
      }));
      setIsAddOpen(false);
    },
    onError: (err) => {
      setFormError(err.message || 'Failed to create product.');
    }
  });

  // 3. Update product Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => productsApi.update(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      dispatch(addNotification({
        type: 'info',
        message: `Product "${updatedProduct.name}" stock/price info updated.`
      }));
      setIsEditOpen(false);
    },
    onError: (err) => {
      setFormError(err.message || 'Failed to update product.');
    }
  });

  // 4. Delete product Mutation
  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      dispatch(addNotification({
        type: 'warning',
        message: `Product with ID ${deletedId} deleted from catalogue.`
      }));
    }
  });

  // Form submit triggers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || price <= 0 || stock < 0) {
      setFormError('Please enter valid product specifications.');
      return;
    }
    setFormError('');
    addMutation.mutate({ name, category: prodCategory, price, stock, sku });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!name || !sku || price <= 0 || stock < 0) {
      setFormError('Please enter valid product specifications.');
      return;
    }
    setFormError('');
    updateMutation.mutate({
      id: selectedProduct.id,
      data: { name, category: prodCategory, price, stock, sku }
    });
  };

  const handleDelete = (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to delete product "${prodName}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    setName('');
    setProdCategory('Electronics');
    setPrice(0);
    setStock(0);
    setSku('');
    setFormError('');
    setIsAddOpen(true);
  };

  const openEditModal = (p: Product) => {
    setSelectedProduct(p);
    setName(p.name);
    setProdCategory(p.category);
    setPrice(p.price);
    setStock(p.stock);
    setSku(p.sku);
    setFormError('');
    setIsEditOpen(true);
  };

  // Sort controller helper
  const handleSort = (field: keyof Product) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="products-page animate-fade-in">
      <div className="page-header-row">
        <div>
          <h1>Inventory Catalogue (React Query)</h1>
          <p>Read, fetch, and update inventory utilizing server state caching mechanisms.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Create Product
        </button>
      </div>

      {/* Query Filter and Search Dashboard */}
      <div className="card filters-card">
        <div className="search-bar-inline">
          <FiSearch />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <label htmlFor="category-select">Category:</label>
          <div className="select-wrapper">
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content table panel */}
      <div className="table-container">
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-danger)' }}>
            Error fetching inventory catalog items: {(error as any).message || 'Server error'}
          </div>
        ) : !products || products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No catalogue products found matching search criteria.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Product Name {sortBy === 'name' && (sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
                </th>
                <th>Category</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>
                  Price {sortBy === 'price' && (sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('stock')}>
                  Stock {sortBy === 'stock' && (sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600 }}>{p.sku}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${p.price.toFixed(2)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.stock} units</td>
                  <td>
                    <span className={`badge badge-${
                      p.status === 'In Stock' ? 'success' : 
                      p.status === 'Low Stock' ? 'warning' : 'danger'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => openEditModal(p)}
                        aria-label="Edit product"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDelete(p.id, p.name)}
                        aria-label="Delete product"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Catalog Product"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)} disabled={addMutation.isPending}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddSubmit} disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Saving...' : 'Add Product'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {formError && <div className="auth-error-banner" style={{ margin: '0 0 16px' }}>{formError}</div>}

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="prod-sku">Stock Keeping Unit (SKU) *</label>
            <div className="input-wrapper">
              <FiBox />
              <input
                id="prod-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. MON-QL-34"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="prod-name">Product Label *</label>
            <div className="input-wrapper">
              <FiShoppingBag />
              <input
                id="prod-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Quantum Processor"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="prod-cat">Product Category</label>
            <div className="input-wrapper">
              <FiLayers />
              <select id="prod-cat" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: '0' }}>
              <label htmlFor="prod-price">Retail Price ($) *</label>
              <div className="input-wrapper">
                <FiDollarSign />
                <input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: '0' }}>
              <label htmlFor="prod-stock">Available Stock *</label>
              <div className="input-wrapper">
                <FiBox />
                <input
                  id="prod-stock"
                  type="number"
                  min="0"
                  value={stock || ''}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* --- EDIT PRODUCT MODAL --- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Product Specifications"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditOpen(false)} disabled={updateMutation.isPending}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleEditSubmit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {formError && <div className="auth-error-banner" style={{ margin: '0 0 16px' }}>{formError}</div>}

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="edit-sku">Stock Keeping Unit (SKU) *</label>
            <div className="input-wrapper">
              <FiBox />
              <input
                id="edit-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="edit-name">Product Label *</label>
            <div className="input-wrapper">
              <FiShoppingBag />
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="edit-cat">Product Category</label>
            <div className="input-wrapper">
              <FiLayers />
              <select id="edit-cat" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: '0' }}>
              <label htmlFor="edit-price">Retail Price ($) *</label>
              <div className="input-wrapper">
                <FiDollarSign />
                <input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: '0' }}>
              <label htmlFor="edit-stock">Available Stock *</label>
              <div className="input-wrapper">
                <FiBox />
                <input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={stock || ''}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
