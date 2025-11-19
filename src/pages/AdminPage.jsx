import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import ProductForm from '../components/ProductForm.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { useProducts } from '../context/ProductContext.jsx'

function AdminPage() {
  const { products, createProduct, updateProduct, deleteProduct, loading, error } = useProducts()
  const [editingProduct, setEditingProduct] = useState(null)
  const [modalProduct, setModalProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (values) => {
    try {
      setSubmitting(true)
      await createProduct(values)
      toast.success('Producto creado correctamente')
    } catch (requestError) {
      toast.error(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (values) => {
    try {
      setSubmitting(true)
      await updateProduct(editingProduct.id, values)
      toast.success('Producto actualizado')
      setEditingProduct(null)
    } catch (requestError) {
      toast.error(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!modalProduct) {
      return
    }

    try {
      setSubmitting(true)
      await deleteProduct(modalProduct.id)
      toast.info('Producto eliminado')
    } catch (requestError) {
      toast.error(requestError.message)
    } finally {
      setModalProduct(null)
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <Helmet>
        <title>Administración | Tech Market</title>
        <meta name="description" content="Gestiona el catálogo completo de productos." />
      </Helmet>
      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">Panel privado</p>
            <h2>Administración del catálogo</h2>
            <p>Agrega, edita o elimina productos conectados a MockAPI.</p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <ProductForm
              onSubmit={editingProduct ? handleUpdate : handleCreate}
              submitting={submitting}
              submitLabel={editingProduct ? 'Actualizar' : 'Guardar'}
              onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
              initialValues={editingProduct || undefined}
            />
          </div>
          <div className="col-12 col-lg-8">
            {loading ? (
              <div className="state state--loading" role="status">
                <div className="spinner" aria-hidden="true" />
                <p>Recuperando productos…</p>
              </div>
            ) : error ? (
              <div className="state state--error" role="alert">
                <p>Ocurrió un inconveniente al cargar los productos.</p>
                <p className="state__details">{error}</p>
              </div>
            ) : (
              <div className="admin-list">
                {products.map((product) => (
                  <article key={product.id} className="admin-list__item">
                    <img src={product.image} alt={product.title} loading="lazy" />
                    <div>
                      <h4>{product.title}</h4>
                      <p className="admin-list__meta">{product.category}</p>
                      <p className="admin-list__description">{product.description}</p>
                    </div>
                    <div className="admin-list__actions">
                      <button type="button" onClick={() => setEditingProduct(product)}>
                        <FiEdit aria-hidden="true" />
                        Editar
                      </button>
                      <button type="button" className="button button--ghost" onClick={() => setModalProduct(product)}>
                        <FiTrash2 aria-hidden="true" />
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
                {products.length === 0 && <p>No hay productos cargados todavía.</p>}
              </div>
            )}
          </div>
        </div>
      </section>
      {modalProduct && (
        <ConfirmModal
          title="¿Deseas eliminar este producto?"
          description={`El producto "${modalProduct.title}" se eliminará de MockAPI.`}
          onConfirm={handleDelete}
          onCancel={() => setModalProduct(null)}
        />
      )}
    </div>
  )
}

export default AdminPage
