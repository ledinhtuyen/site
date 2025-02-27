'use client';

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

// Suppress specific component lifecycle warning in development
const originalError = console.error;
if (process.env.NODE_ENV === 'development') {
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('UNSAFE_componentWillReceiveProps')) {
      return;
    }
    originalError.call(console, ...args);
  };
}

function ReactSwagger({ spec }: any) {
  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.error = originalError;
      }
    };
  }, []);

  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;
