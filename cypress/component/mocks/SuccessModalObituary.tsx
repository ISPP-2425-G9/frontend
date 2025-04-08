import React from 'react';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const SuccessModalObituary: React.FC<SuccessModalProps> = ({
  visible,
  onClose
}) => {
  if (!visible) return null;

  return (
    <div data-cy="success-modal">
      <div data-cy="success-header">
        <h2>¡Pago realizado con éxito!</h2>
      </div>
      <div data-cy="success-content">
        <p>Tu pago se ha procesado correctamente.</p>
        <p>Gracias por confiar en nosotros.</p>
        <div data-cy="success-button-container">
          <button
            data-cy="success-close-button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModalObituary; 