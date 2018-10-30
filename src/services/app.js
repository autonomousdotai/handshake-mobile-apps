import React from 'react';
import DynamicImport from '@/components/App/DynamicImport';

export const createDynamicImport = (load, loading, isNotFound = false) => {
  const dynamicImport = props => (
    <DynamicImport isNotFound={isNotFound} loading={loading} load={load}>
      {Component => <Component {...props} />}
    </DynamicImport>
  );
  return dynamicImport;
};

export default { createDynamicImport };
