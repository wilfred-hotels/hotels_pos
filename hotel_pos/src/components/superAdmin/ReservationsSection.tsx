import React from 'react';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';

const ReservationsSection: React.FC<SectionProps> = ({ userId }) => {
  return (
    <div>
      <AdminHeader title="Reservations" subtitle="Booking & reservation management" />
      <h2>Reservations</h2>
      {/* Reservations content */}
    </div>
  );
};

export default ReservationsSection;