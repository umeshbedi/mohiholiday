"use client"
import React from 'react';
import { ConfigProvider } from 'antd';

export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Red Hat Display", sans-serif',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
