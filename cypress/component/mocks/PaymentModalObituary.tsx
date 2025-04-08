import React from 'react';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onSuccess?: (paymentMethod: { id: string }) => void;
}

const PaymentModalObituary: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  amount,
  description,
  onSuccess
}) => {
  if (!visible) return null;

  return (
    <div data-cy="payment-modal">
      <div data-cy="modal-header">
        <h2>Pago seguro con Stripe</h2>
      </div>
      <div data-cy="modal-content">
        <p>{description}</p>
        <p data-cy="amount">{amount.toFixed(2)}€</p>
        <div data-cy="button-container">
          <button data-cy="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            data-cy="pay-button"
            onClick={() => onSuccess && onSuccess({ id: 'pm_test_123' })}
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModalObituary; 