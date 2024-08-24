import React from 'react';

const ReviewTab = ({ formData, calculateTotalBalance }) => {
  return (
    <div>
      <h3>Review</h3>
      <p><strong>Selected Characters:</strong> {formData.characters?.join(', ')}</p>
      <p><strong>Selected Add-ons:</strong> {formData.addons?.join(', ')}</p>
      <p><strong>Selected Bounces:</strong> {formData.bounces?.join(', ')}</p>
      <p><strong>Total Balance:</strong> ${calculateTotalBalance()}</p>
    </div>
  );
};

export default ReviewTab;
