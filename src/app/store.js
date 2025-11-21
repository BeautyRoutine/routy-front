import { configureStore } from '@reduxjs/toolkit';

import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/user/userSlice';

import admConfigReducer from 'features/config/admConfigSlice';
import admOrdersReducer from 'features/orders/admOrdersSlice';
import admDeliveriesReducer from 'features/orders/admDeliveriesSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,

    admConfig: admConfigReducer,
    admOrders: admOrdersReducer,
    admDeliveries: admDeliveriesReducer,
  },
});
