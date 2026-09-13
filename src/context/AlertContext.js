import { createContext } from 'react';

export const AlertContext = createContext(() => {
  window.location.href = '/careers';
});

export default AlertContext;
