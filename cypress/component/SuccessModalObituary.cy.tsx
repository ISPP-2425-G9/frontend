import React from 'react';
import SuccessModalObituary from './mocks/SuccessModalObituary';

describe('SuccessModalObituary', () => {
  const createProps = (overrides = {}) => ({
    visible: true,
    onClose: cy.stub().as('onClose'),
    ...overrides
  });

  describe('Visibility', () => {
    it('should show the modal when visible is true', () => {
      const props = createProps({ visible: true });
      cy.mount(<SuccessModalObituary {...props} />);
      cy.get('[data-cy="success-modal"]').should('be.visible');
    });

    it('should not render the modal when visible is false', () => {
      const props = createProps({ visible: false });
      cy.mount(<SuccessModalObituary {...props} />);
      cy.get('[data-cy="success-modal"]').should('not.exist');
    });
  });

  describe('Content', () => {
    beforeEach(() => {
      const props = createProps();
      cy.mount(<SuccessModalObituary {...props} />);
    });

    it('should display success message', () => {
      cy.get('[data-cy="success-header"]')
        .should('be.visible')
        .and('contain', '¡Pago realizado con éxito!');
      
      cy.get('[data-cy="success-content"]')
        .should('contain', 'Tu pago se ha procesado correctamente')
        .and('contain', 'Gracias por confiar en nosotros');
    });

    it('should have a close button', () => {
      cy.get('[data-cy="success-close-button"]')
        .should('exist')
        .and('be.visible')
        .and('contain', 'Cerrar');
    });
  });

  describe('Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      const props = createProps();
      cy.mount(<SuccessModalObituary {...props} />);
      cy.get('[data-cy="success-close-button"]').click();
      cy.get('@onClose').should('have.been.called');
    });
  });
}); 