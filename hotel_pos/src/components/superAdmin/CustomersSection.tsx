import React from 'react';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';

const CustomersSection: React.FC<SectionProps> = ({ userId }) => {
  return (
    <div>
      <AdminHeader title="Customers" subtitle="Customer profiles & history" />
      <h2>Customer Management</h2>
      {/* Customers content */}
    </div>
  );
};

export default CustomersSection;