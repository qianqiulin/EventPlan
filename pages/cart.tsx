import React, { useState, ChangeEvent } from 'react';
import Link from 'next/link';

import TopBar from "./TopBar";
import { Alert, Slide } from '@mui/material';

//import './Cart.css'; // optional: use .module.css if using CSS Modules

// Type for a cart item
interface CartItemType {
  id: string | number;
  title: string;
  price: number;
  qty: number;
}

// Props for CartItem component
interface CartItemProps {
  item: CartItemType;
  onRemove: (qty: number) => void;
  onDelete: () => void;
  setAlert: React.Dispatch<React.SetStateAction<{ severity: 'success' | 'error' | 'warning'; message: string } | null>>;
}

export default function Cart(props) {
  const Cart=props.Cart
  const [alert, setAlert] = useState<{ severity: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const total = Cart.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (Cart.cart.length === 0) {

    return <p className="empty-message">Your cart is empty.</p>;
  }

  return (
    <>
    {alert && (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            minWidth: '300px',
          }}
        >
        <Alert severity={alert.severity} variant="filled" onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
        </div>
      </Slide>
    )}

    <div className="cart-container">
    
      <h1 className="cart-header">Your Cart</h1>

      <ul className="cart-list">
        {Cart.cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={(qty) => Cart.remove(item.id, qty)}
            onDelete={() => Cart.remove(item.id, item.qty)}
            setAlert={setAlert}
          />
        ))}
      </ul>
      <div className="cart-total">Total: ${total.toFixed(2)}</div>
      <button className="clear-btn" onClick={Cart.clear}>
        Clear Cart
      </button>
    </div>
    </>
  );
}

function CartItem({ item, onRemove, onDelete,setAlert }: CartItemProps) {
  const [rmQty, setRmQty] = useState<string>('1');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setRmQty(val);
    }
  };

  const handleRemove = () => {
    const quantity = parseInt(rmQty, 10);
    if (isNaN(quantity) || quantity < 1) {
      setAlert({ severity: 'warning', message: '⚠️ Please enter a quantity of at least 1.' });
      return;
    }
    
    if (quantity > item.qty) {
      setAlert({ severity: 'warning', message: `⚠️ You only have ${item.qty} of "${item.title}" in your cart.` });
      return;
    }
    onRemove(quantity);
    setRmQty('1');
    setAlert({ severity: 'success', message: `✅ Removed ${quantity} × "${item.title}" from your cart.` });
  };

  return (
    <li className="cart-item">
      <div className="cart-info">
        <strong>{item.title}</strong>
        <span>
          ${item.price.toFixed(2)} × {item.qty} = $
          {(item.price * item.qty).toFixed(2)}
        </span>
      </div>
      <div className="cart-actions">
        <Link href={`/events/${item.id}`} className="view-btn">
          View Event
        </Link>
        <label className="action-label">
          Remove:
          <input
            className="action-input"
            type="text"
            value={rmQty}
            onChange={handleChange}
            style={{ width: '3rem' }}
          />
        </label>
        <button className="remove-btn" onClick={handleRemove}>
          Remove{rmQty}
        </button>
        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}
