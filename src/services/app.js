import React from 'react';
import uuidv1 from 'uuid/v1';
import DynamicImport from '@/components/App/DynamicImport';

export const createDynamicImport = (load, loading, isNotFound = false) => {
  const dynamicImport = props => (
    <DynamicImport isNotFound={isNotFound} loading={loading} load={load}>
      {Component => <Component {...props} />}
    </DynamicImport>
  );
  return dynamicImport;
};

export const uuid = () => uuidv1();

export default { createDynamicImport, uuid };
