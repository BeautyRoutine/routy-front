import React from 'react';
import PropTypes from 'prop-types';
import './CartPage.css';

import { CartItem } from './CartItem';
import { CartEmpty } from './CartEmpty';

export function CartItemsList({ items, itemHandlers, onNavigate }) {
  if (items.length === 0) {
    return <CartEmpty onNavigate={onNavigate} />;
  }

  return (
    <div className="cart-items-stack">
      {items.map(item => (
        <CartItem
          key={item.cartItemId}
          item={item}
          onToggle={() => itemHandlers.onToggle(item.cartItemId, !item.selected)}
          onQuantityChange={delta => itemHandlers.onQuantityChange(item.cartItemId, item.quantity + delta)}

          onDelete={() => itemHandlers.onDelete([item.cartItemId])}
        />
      ))}
    </div>
  );
}

CartItemsList.propTypes = {
  items: PropTypes.array.isRequired,
  itemHandlers: PropTypes.object.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
