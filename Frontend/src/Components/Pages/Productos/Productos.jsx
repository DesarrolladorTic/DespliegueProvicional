import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
import {
  agregarProducto,
  editarProducto,
  eliminarProducto,
  toggleEstadoProducto,
  filtrarProductosPorCategoria,
  filtrarProductosPorEstado,
  filtrarGlobal,
  agregarCategoria,
  editarCategoriaYActualizarProductos,
  eliminarCategoria,
} from "./PdtsLogica";

// Datos dummy para simular productos y categorías
const initialDummyProductos = [
  {
    id: "1",
    sku: "A001",
    imagen: "/default-product.png",
    nombre: "Producto 1",
    descripcion: "Descripción producto 1",
    stock: 10,
    precio: 100,
    activo: true,
    codigo_barras: "12345",
    categoria_id: "cat1",
    categoria: "Category A",
  },
  {
    id: "2",
    sku: "A002",
    imagen: "/default-product.png",
    nombre: "Producto 2",
    descripcion: "Descripción producto 2",
    stock: 5,
    precio: 50,
    activo: false,
    codigo_barras: "23456",
    categoria_id: "cat1",
    categoria: "Category A",
  },
  {
    id: "3",
    sku: "B001",
    imagen: "/default-product.png",
    nombre: "Producto 3",
    descripcion: "Descripción producto 3",
    stock: 20,
    precio: 150,
    activo: true,
    codigo_barras: "34567",
    categoria_id: "cat2",
    categoria: "Category B",
  },
  {
    id: "4",
    sku: "B002",
    imagen: "/default-product.png",
    nombre: "Producto 4",
    descripcion: "Descripción producto 4",
    stock: 0,
    precio: 80,
    activo: false,
    codigo_barras: "45678",
    categoria_id: "cat2",
    categoria: "Category B",
  },
  {
    id: "5",
    sku: "A003",
    imagen: "/default-product.png",
    nombre: "Producto 5",
    descripcion: "Descripción producto 5",
    stock: 15,
    precio: 120,
    activo: true,
    codigo_barras: "56789",
    categoria_id: "cat1",
    categoria: "Category A",
  },
];

const initialDummyCategorias = [
  { id: "cat1", name: "Category A" },
  { id: "cat2", name: "Category B" },
];

const Productos = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("activos");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState("");
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);

  const [editandoCategoria, setEditandoCategoria] = useState(false);
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState(null);
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState("");

  const [notificacion, setNotificacion] = useState(null);
  const mostrarNotificacion = (mensaje, tipo = "info") => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3000);
  };

  // Inicializamos con datos dummy sin conexión a backend
  useEffect(() => {
    setProductos(initialDummyProductos);
    setCategorias(initialDummyCategorias);
    setCategoriaSeleccionada("");
  }, []);

  const manejarBusqueda = (e) => setBusqueda(e.target.value);

  // Filtrado de productos según el usuario (admin ve todos, usuario normal solo activos)
  let productosCoincidentes = [];
  if (isAdmin) {
    if (busqueda.trim()) {
      productosCoincidentes = filtrarGlobal(productos, busqueda);
    } else {
      productosCoincidentes = filtrarProductosPorCategoria(
        productos,
        categoriaSeleccionada || "General",
        categorias
      );
    }
    productosCoincidentes = filtrarProductosPorEstado(productosCoincidentes, estadoFiltro);
  } else {
    if (!categoriaSeleccionada) {
      productosCoincidentes = [];
    } else {
      if (busqueda.trim()) {
        productosCoincidentes = filtrarGlobal(productos, busqueda);
      } else {
        productosCoincidentes = filtrarProductosPorCategoria(productos, categoriaSeleccionada, categorias);
      }
      productosCoincidentes = productosCoincidentes.filter((p) => p.activo);
    }
  }

  // CRUD de productos (operaciones en estado local)
  const handleAgregarProducto = (nuevo) => {
    if (
      !nuevo.sku?.trim() ||
      !nuevo.nombre?.trim() ||
      !nuevo.descripcion?.trim() ||
      isNaN(nuevo.precio) ||
      nuevo.precio <= 0 ||
      isNaN(nuevo.stock) ||
      nuevo.stock < 0 ||
      !nuevo.categoria?.trim()
    ) {
      mostrarNotificacion("Completa los campos obligatorios y selecciona una categoría.", "error");
      return;
    }
    const nuevosProductos = agregarProducto(productos, nuevo);
    setProductos(nuevosProductos);
    setMostrarModal(false);
    mostrarNotificacion("Producto agregado correctamente.", "success");
  };

  const handleEditarProducto = (prodEdit) => {
    if (
      !prodEdit.nombre?.trim() ||
      isNaN(prodEdit.precio) ||
      prodEdit.precio <= 0 ||
      !prodEdit.categoria
    ) {
      mostrarNotificacion("Completa todos los campos correctamente.", "error");
      return;
    }
    const nuevosProductos = editarProducto(productos, prodEdit);
    setProductos(nuevosProductos);
    setMostrarModal(false);
    mostrarNotificacion("Producto actualizado correctamente.", "success");
  };

  const handleEliminarProductoEnModal = (id) => {
    const nuevosProductos = eliminarProducto(productos, id);
    setProductos(nuevosProductos);
    setMostrarModal(false);
    mostrarNotificacion("Producto eliminado correctamente.", "success");
  };

  const handleToggleEstadoEnModal = (id) => {
    const nuevosProductos = toggleEstadoProducto(productos, id);
    setProductos(nuevosProductos);
    mostrarNotificacion("Estado del producto actualizado.", "info");
  };

  // CRUD de categorías (operaciones en estado local)
  const handleAgregarCategoria = (nombre) => {
    const nuevasCategorias = agregarCategoria(categorias, nombre);
    setCategorias(nuevasCategorias);
    if (!categoriaSeleccionada) setCategoriaSeleccionada(nombre);
    setMostrarModal(false);
    mostrarNotificacion("Categoría agregada correctamente.", "success");
  };

  const handleEditarCategoria = () => {
    if (!nuevoNombreCategoria.trim()) {
      mostrarNotificacion("El nombre de la categoría no puede estar vacío.", "error");
      return;
    }
    const { productosActualizados, categoriasActualizadas } = editarCategoriaYActualizarProductos(
      productos,
      categorias,
      categoriaEnEdicion.name,
      nuevoNombreCategoria.trim()
    );
    setProductos(productosActualizados);
    setCategorias(categoriasActualizadas);
    if (categoriaSeleccionada.toLowerCase() === categoriaEnEdicion.name.toLowerCase()) {
      setCategoriaSeleccionada(nuevoNombreCategoria.trim());
    }
    setMostrarModal(false);
    mostrarNotificacion("Categoría editada correctamente.", "success");
  };

  const handleEliminarCategoriaEnModal = () => {
    if (!categoriaEnEdicion) return;
    const { productosActualizados, categoriasActualizadas } = eliminarCategoria(
      productos,
      categorias,
      categoriaEnEdicion.id
    );
    setProductos(productosActualizados);
    setCategorias(categoriasActualizadas);
    setCategoriaSeleccionada("");
    setMostrarModal(false);
    mostrarNotificacion("Categoría eliminada correctamente.", "success");
  };

  // Abrir y cerrar modales
  const abrirModalProducto = (modo, producto = null) => {
    setEditandoCategoria(false);
    setModoEdicion(modo);
    setProductoEnEdicion(
      producto || {
        id: "",
        sku: "",
        nombre: "",
        descripcion: "",
        imagen: "",
        precio: 0,
        stock: 0,
        categoria: categoriaSeleccionada || "",
        activo: true,
        codigo_barras: "",
      }
    );
    setMostrarModal(true);
  };

  const abrirModalCategoria = (modo, cat = null) => {
    setEditandoCategoria(true);
    setModoEdicion(modo);
    if (modo === "agregar") {
      setCategoriaEnEdicion(null);
      setNuevoNombreCategoria("");
    } else {
      setCategoriaEnEdicion(cat);
      setNuevoNombreCategoria(cat?.name || "");
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoEnEdicion(null);
    setCategoriaEnEdicion(null);
    setNuevoNombreCategoria("");
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 p-8">
      {/* Notificación */}
      {notificacion && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl border z-[999999] transition-all duration-300 transform ${
            notificacion.tipo === "success"
              ? "bg-green-100 border-green-400 text-green-800"
              : notificacion.tipo === "error"
              ? "bg-red-100 border-red-400 text-red-800"
              : "bg-gray-100 border-gray-300 text-gray-800"
          }`}
        >
          {notificacion.mensaje}
        </div>
      )}

      {/* Encabezado */}
      {isAdmin ? (
        <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-red-700 mb-8 transform hover:scale-105 transition duration-300">
          <h1 className="text-4xl font-extrabold text-red-700 text-center">
            Gestión de Productos
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Administra tus productos y categorías.
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-red-700 mb-8 transform hover:scale-105 transition duration-300">
          <h1 className="text-4xl font-extrabold text-red-700 text-center">
            Catálogo de Productos
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Descubre nuestra selección.
          </p>
        </div>
      )}

      {/* Panel de controles */}
      {isAdmin ? (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-red-700 mb-8 transform hover:scale-105 transition duration-300">
          <div className="flex flex-col lg:flex-row items-center justify-around space-y-4 lg:space-y-0 lg:space-x-6">
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="p-3 border rounded bg-gray-100 text-red-800 w-52 focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="">-- Selecciona categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoriaSeleccionada && (
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="p-3 border rounded bg-gray-100 text-red-800 w-52 focus:ring-2 focus:ring-red-500 transition"
              >
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => abrirModalCategoria("agregar")}
                className="bg-red-700 text-white py-2 px-6 rounded-lg hover:bg-red-800 text-sm transition"
              >
                Agregar categoría
              </button>
              {categoriaSeleccionada && (
                <button
                  onClick={() => {
                    const catObj = categorias.find((c) => c.name === categoriaSeleccionada);
                    if (catObj) abrirModalCategoria("editar", catObj);
                  }}
                  className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-900 text-sm transition"
                >
                  Editar categoría
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="relative w-full md:w-3/4 lg:w-1/2">
              <input
                type="text"
                value={busqueda}
                onChange={manejarBusqueda}
                placeholder="Buscar producto..."
                className="p-3 border rounded w-full text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => abrirModalProducto("agregar")}
                className="bg-red-700 text-white py-2 px-6 rounded-lg hover:bg-red-800 text-sm transition"
              >
                Agregar producto
              </button>
            </div>
            <p className="text-red-800 font-semibold">
              Mostrando productos {estadoFiltro.toUpperCase()}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-red-700 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-around">
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="p-3 border rounded bg-gray-100 text-red-800 w-full sm:w-52 focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="">-- Seleccione categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={busqueda}
              onChange={manejarBusqueda}
              placeholder="Buscar producto..."
              className="p-3 border rounded w-full sm:w-72 text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </div>
        </div>
      )}

      {(isAdmin || (!isAdmin && categoriaSeleccionada)) && (
        <div className="max-h-[500px] overflow-y-auto overflow-x-auto shadow-2xl rounded-2xl">
          <table className="w-full table-fixed border-collapse bg-white rounded-2xl">
            <thead className="bg-red-800 text-white sticky top-0">
              <tr>
                {isAdmin && <th className="px-4 py-3 text-left w-16">ID</th>}
                <th className="px-4 py-3 text-left w-24">SKU</th>
                <th className="px-4 py-3 text-left w-28">Imagen</th>
                <th className="px-4 py-3 text-left w-40">Nombre</th>
                <th className="px-4 py-3 text-left w-72">Descripción</th>
                {isAdmin && <th className="px-4 py-3 text-left w-20">Stock</th>}
                <th className="px-4 py-3 text-left w-32">Precio</th>
                {isAdmin && <th className="px-4 py-3 text-left w-28">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {productosCoincidentes.map((prod, idx) => (
                <tr
                  key={prod.id}
                  className={`transition-colors ${
                    prod.activo
                      ? idx % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-white hover:bg-gray-100"
                      : "bg-gray-300 opacity-70"
                  }`}
                >
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">{prod.id}</td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">{prod.sku}</td>
                  <td className="px-4 py-3">
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                        Sin img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-normal break-words">
                    {prod.nombre}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="max-h-20 overflow-y-auto whitespace-normal break-words p-2">
                      {prod.descripcion}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">{prod.stock}</td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">
                    ${Number(prod.precio).toFixed(2)}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setModoEdicion("editar");
                          setProductoEnEdicion(prod);
                          setEditandoCategoria(false);
                          setMostrarModal(true);
                        }}
                        className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-900 text-sm transition"
                      >
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl max-h-[90vh] overflow-y-auto transform hover:scale-105 transition duration-300">
            {editandoCategoria ? (
              <>
                {modoEdicion === "agregar" ? (
                  <h3 className="text-2xl font-semibold mb-4 text-red-700">
                    Agregar Categoría
                  </h3>
                ) : (
                  <h3 className="text-2xl font-semibold mb-4 text-red-700">
                    Editar Categoría
                  </h3>
                )}
                <label className="block mb-2 text-sm font-semibold text-black">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  value={nuevoNombreCategoria}
                  onChange={(e) => setNuevoNombreCategoria(e.target.value)}
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />
                <div className="flex justify-end space-x-4">
                  {modoEdicion === "editar" && (
                    <button
                      onClick={handleEliminarCategoriaEnModal}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  )}
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                  {modoEdicion === "agregar" ? (
                    <button
                      onClick={() => handleAgregarCategoria(nuevoNombreCategoria)}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={handleEditarCategoria}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
                    >
                      Guardar
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {modoEdicion === "agregar" ? (
                  <h3 className="text-2xl font-semibold mb-4 text-red-700">
                    Agregar Producto
                  </h3>
                ) : (
                  <h3 className="text-2xl font-semibold mb-4 text-red-700">
                    Editar Producto
                  </h3>
                )}
                <label className="block mb-2 text-sm font-semibold text-black">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  value={productoEnEdicion?.nombre || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      nombre: e.target.value,
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Descripción
                </label>
                <input
                  type="text"
                  value={productoEnEdicion?.descripcion || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      descripcion: e.target.value,
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Stock
                </label>
                <input
                  type="number"
                  value={productoEnEdicion?.stock || 0}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Precio
                </label>
                <input
                  type="number"
                  value={productoEnEdicion?.precio || 0}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      precio: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  SKU (máx. 5 caracteres)
                </label>
                <input
                  type="text"
                  value={productoEnEdicion?.sku || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      sku: e.target.value.substring(0, 5),
                    })
                  }
                  maxLength={5}
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Código de Barras
                </label>
                <input
                  type="text"
                  onFocus={(e) => e.target.select()}
                  value={productoEnEdicion?.codigo_barras || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      codigo_barras: e.target.value,
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Categoría
                </label>
                <select
                  value={productoEnEdicion?.categoria || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      categoria: e.target.value,
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                >
                  <option value="">-- Seleccione categoría --</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <label className="block mb-2 text-sm font-semibold text-black">
                  Imagen (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setProductoEnEdicion({
                          ...productoEnEdicion,
                          imagen: reader.result,
                        });
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />
                {productoEnEdicion?.imagen && (
                  <img
                    src={productoEnEdicion.imagen}
                    alt="Vista previa"
                    className="w-32 h-32 object-cover mt-2 mx-auto rounded"
                  />
                )}

                <div className="flex flex-wrap justify-end gap-2 mt-4">
                  {modoEdicion === "editar" && (
                    <>
                      <button
                        onClick={() => handleToggleEstadoEnModal(productoEnEdicion.id)}
                        className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                      >
                        {productoEnEdicion?.activo ? "Inactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => handleEliminarProductoEnModal(productoEnEdicion.id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                  {modoEdicion === "agregar" ? (
                    <button
                      onClick={() => handleAgregarProducto(productoEnEdicion)}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditarProducto(productoEnEdicion)}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
                    >
                      Guardar
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
