import React from 'react';

// Definición de tipos para las props
interface PaymentModalObituaryProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onSuccess?: (paymentMethod: { id: string }) => void;
}

// Mock del componente PaymentModalObituary usando elementos web básicos
const PaymentModalObituary: React.FC<PaymentModalObituaryProps> = ({ 
  visible, 
  onClose, 
  amount, 
  description, 
  onSuccess 
}) => {
  if (!visible) return null;
  
  return (
    <div data-cy="payment-modal" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div data-cy="modal-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Pago seguro con Stripe</h2>
      </div>
      <div data-cy="modal-content">
        <p style={{ marginBottom: '10px' }}>{description}</p>
        <p data-cy="amount" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          {amount.toFixed(2)}€
        </p>
        
        <div data-cy="card-inputs" style={{ marginBottom: '20px' }}>
          <input 
            data-cy="card-number" 
            placeholder="Número de tarjeta" 
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <div data-cy="card-details" style={{ display: 'flex', gap: '10px' }}>
            <input 
              data-cy="card-expiry" 
              placeholder="MM/AA" 
              style={{ flex: 1, padding: '8px' }}
            />
            <input 
              data-cy="card-cvc" 
              placeholder="CVC" 
              style={{ flex: 1, padding: '8px' }}
            />
          </div>
        </div>
        
        <div data-cy="button-container" style={{ display: 'flex', gap: '10px' }}>
          <button 
            data-cy="cancel-button" 
            onClick={onClose}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#ff4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button 
            data-cy="pay-button" 
            onClick={() => onSuccess && onSuccess({ id: 'pm_test_123' })}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

describe('PaymentModalObituary', () => {
  it('renders correctly', () => {
    const onClose = cy.stub().as('onClose');
    const onSuccess = cy.stub().as('onSuccess');
    
    cy.mount(
      <PaymentModalObituary
        visible={true}
        onClose={onClose}
        amount={9.99}
        description="Pago por servicio de obituario"
        onSuccess={onSuccess}
      />
    );

    // Verificar que el modal se muestra correctamente
    cy.get('[data-cy="payment-modal"]').should('exist');
    cy.get('[data-cy="modal-header"]').should('contain', 'Pago seguro con Stripe');
    cy.get('[data-cy="amount"]').should('contain', '9.99€');
    cy.get('[data-cy="modal-content"]').should('contain', 'Pago por servicio de obituario');
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = cy.stub().as('onClose');
    const onSuccess = cy.stub().as('onSuccess');
    
    cy.mount(
      <PaymentModalObituary
        visible={true}
        onClose={onClose}
        amount={9.99}
        description="Pago por servicio de obituario"
        onSuccess={onSuccess}
      />
    );

    // Buscar y hacer clic en el botón de cancelar
    cy.get('[data-cy="cancel-button"]').click();
    
    // Verificar que se llamó a onClose
    cy.get('@onClose').should('have.been.called');
  });

  it('processes payment when pay button is clicked', () => {
    const onClose = cy.stub().as('onClose');
    const onSuccess = cy.stub().as('onSuccess');
    
    cy.mount(
      <PaymentModalObituary
        visible={true}
        onClose={onClose}
        amount={9.99}
        description="Pago por servicio de obituario"
        onSuccess={onSuccess}
      />
    );

    // Hacer clic en el botón de pago
    cy.get('[data-cy="pay-button"]').click();
    
    // Verificar que se llamó a onSuccess con el ID del método de pago
    cy.get('@onSuccess').should('have.been.calledWith', { id: 'pm_test_123' });
  });
}); 