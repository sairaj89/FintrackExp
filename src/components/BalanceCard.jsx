import React from 'react';
import './BalanceCard.css';

function BalanceCard({ balance = 0 }) {
  return (
    <div className="balance-card">
      <h2>Total Balance</h2>
      <p className="balance-amount">
        ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default BalanceCard;
