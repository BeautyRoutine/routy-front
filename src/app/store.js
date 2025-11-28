import { configureStore } from '@reduxjs/toolkit';

import userConfigReducer from 'features/config/userConfigSlice';
import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/user/userSlice';

import admConfigReducer from 'features/config/admConfigSlice';
import admOrdersReducer from 'features/orders/admOrdersSlice';
import admDeliveriesReducer from 'features/orders/admDeliveriesSlice';

export const store = configureStore({
  reducer: {
    userConfig: userConfigReducer,
    cart: cartReducer,
    user: userReducer,

    admConfig: admConfigReducer,
    admOrders: admOrdersReducer,
    admDeliveries: admDeliveriesReducer,
  },
});
