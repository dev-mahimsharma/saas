import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};
