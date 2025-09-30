import React from 'react';
import Navbar from '../components/Navbar';
import TransactionManager from '../components/TransactionManager';

export default function Transactions() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-4">
        <TransactionManager />
      </main>
    </>
  );
}
