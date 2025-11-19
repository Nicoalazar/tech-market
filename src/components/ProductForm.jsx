import { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'

const EMPTY_VALUES = {
  title: '',
  price: '',
  description: '',
  category: '',
  image: '',
}

function ProductForm({ initialValues = EMPTY_VALUES, onSubmit, submitting = false, submitLabel = 'Guardar', onCancel }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const validationErrors = {}

    if (!values.title.trim()) {
      validationErrors.title = 'El nombre es obligatorio.'
    }

    const priceValue = Number(values.price)
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      validationErrors.price = 'El precio debe ser mayor a 0.'
    }

    if (values.description.trim().length < 10) {
      validationErrors.description = 'La descripción debe tener al menos 10 caracteres.'
    }

    if (!values.category.trim()) {
      validationErrors.category = 'Selecciona una categoría.'
    }

    if (!values.image.trim()) {
      validationErrors.image = 'Incluye una imagen o URL válida.'
    }

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      ...values,
      price: Number(values.price),
    })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="product-form__header">
        <h3>{submitLabel === 'Guardar' ? 'Nuevo producto' : 'Editar producto'}</h3>
        <FiPlus aria-hidden="true" />
      </div>
      <label>
        Nombre
        <input name="title" value={values.title} onChange={handleChange} required />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </label>
      <label>
        Precio
        <input name="price" type="number" min="0" step="0.01" value={values.price} onChange={handleChange} required />
        {errors.price && <span className="form-error">{errors.price}</span>}
      </label>
      <label>
        Descripción
        <textarea name="description" value={values.description} onChange={handleChange} rows={3} required />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </label>
      <label>
        Categoría
        <input name="category" value={values.category} onChange={handleChange} required />
        {errors.category && <span className="form-error">{errors.category}</span>}
      </label>
      <label>
        Imagen (URL)
        <input name="image" value={values.image} onChange={handleChange} required />
        {errors.image && <span className="form-error">{errors.image}</span>}
      </label>
      <div className="product-form__actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="button button--ghost">
            Cancelar
          </button>
        )}
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
