import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '../components/Alert.jsx';
import { Loader } from '../components/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import {
  clearProductMessage,
  createProduct,
  fetchProducts
} from '../store/productsSlice.js';

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { createStatus, error, items, status, successMessage } = useSelector(
    (state) => state.products
  );
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => () => dispatch(clearProductMessage()), [dispatch]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(createProduct(form));

    if (!result.error) {
      setForm({ name: '', description: '', price: '' });
    }
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <span className="eyebrow">Products service</span>
        <h1>Products</h1>
        <p>
          Public reads use `/api/products`; authenticated writes use the same
          route with a JWT so the product service can attach an owner reference.
        </p>
      </div>

      <div className="products-layout">
        <div className="panel">
          <div className="panel-heading">
            <h2>Catalog</h2>
            {status === 'loading' && <Loader label="Refreshing" />}
          </div>

          <Alert tone="danger">{error}</Alert>
          <Alert tone="success">{successMessage}</Alert>

          {items.length === 0 && status !== 'loading' ? (
            <div className="empty-state">
              <strong>No products yet</strong>
              <span>Create the first product after logging in.</span>
            </div>
          ) : (
            <div className="product-list">
              {items.map((product) => (
                <article className="product-card" key={product._id}>
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                  <div className="product-meta">
                    <strong>${Number(product.price).toFixed(2)}</strong>
                    <span>{product.ownerEmail || 'Unknown owner'}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <form className="panel product-form" onSubmit={handleSubmit}>
          <div>
            <h2>Create product</h2>
            <p className="muted">
              Protected by the gateway. Sign in to enable writes.
            </p>
          </div>

          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isAuthenticated}
              placeholder="Starter API Kit"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={!isAuthenticated}
              rows="4"
              placeholder="Describe the product"
              required
            />
          </label>

          <label>
            Price
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              disabled={!isAuthenticated}
              placeholder="49.00"
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={!isAuthenticated || createStatus === 'loading'}
          >
            {createStatus === 'loading' ? <Loader label="Creating" /> : 'Create product'}
          </button>
        </form>
      </div>
    </section>
  );
};
