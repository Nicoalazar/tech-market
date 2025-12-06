import { FiX } from 'react-icons/fi'

function ConfirmModal({ title, description, onConfirm, onCancel }) {
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__content">
        <button type="button" className="modal__close" onClick={onCancel} aria-label="Cerrar">
          <FiX aria-hidden="true" />
        </button>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="modal__actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="button" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
