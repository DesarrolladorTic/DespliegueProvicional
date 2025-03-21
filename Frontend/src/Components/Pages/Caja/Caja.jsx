import React, { useState } from "react";
import { useAuth } from "../../../Context/AuthContext"; // Ajusta la ruta según tu proyecto

const dummyProducts = [
  {
    id: "1",
    sku: "A001",
    imagen: "/default-product.png", // Asegúrate de tener este archivo en public
    nombre: "Producto 1",
    descripcion: "Descripción del producto 1",
    stock: 10,
    precio: 100,
    activo: true,
    codigo_barras: "12345",
  },
  {
    id: "2",
    sku: "A002",
    imagen: "/default-product.png",
    nombre: "Producto 2",
    descripcion: "Descripción del producto 2",
    stock: 5,
    precio: 50,
    activo: true,
    codigo_barras: "23456",
  },
  {
    id: "3",
    sku: "B001",
    imagen: "/default-product.png",
    nombre: "Producto 3",
    descripcion: "Descripción del producto 3",
    stock: 20,
    precio: 150,
    activo: true,
    codigo_barras: "34567",
  },
];

const Caja = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [codigo, setCodigo] = useState("");
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [alerta, setAlerta] = useState(null);
  const [confirmarVenta, setConfirmarVenta] = useState(null);

  const mostrarAlerta = (mensaje, tipo = "error") => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };

  const buscarProducto = () => {
    if (!codigo.trim()) return;
    // Buscamos en el array dummy comparando con sku o codigo_barras
    const found = dummyProducts.find(
      (p) =>
        p.codigo_barras === codigo.trim() ||
        p.sku.toLowerCase() === codigo.trim().toLowerCase()
    );
    if (found) {
      setProducto(found);
    } else {
      mostrarAlerta("Producto no encontrado.");
      setProducto(null);
    }
  };

  // Función para solicitar confirmación de venta (solo para admin)
  const solicitarConfirmacionVenta = () => {
    if (!producto || cantidad <= 0) return;
    setConfirmarVenta({
      mensaje: `¿Deseas vender ${cantidad} unidad(es) de "${producto.nombre}"?`,
      onConfirm: venderProducto,
    });
  };

  const venderProducto = () => {
    setConfirmarVenta(null);
    if (!producto || cantidad <= 0) return;
    if (cantidad > producto.stock) {
      mostrarAlerta("No hay suficiente stock para vender esa cantidad.");
      return;
    }
    // Simula la venta restando la cantidad vendida del stock
    const nuevoStock = producto.stock - cantidad;
    mostrarAlerta(`Venta realizada. Nuevo stock: ${nuevoStock}`, "success");
    // Actualizamos el estado del producto (en esta vista, solo se actualiza el objeto actual)
    setProducto({ ...producto, stock: nuevoStock });
    // Reiniciamos campos
    setCodigo("");
    setCantidad(1);
  };

  const cerrarProducto = () => {
    setProducto(null);
    setCodigo("");
  };

  return (
    <div className="mt-20 min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 text-gray-900 relative">
      {/* ENCABEZADO */}
      <div className="mt-20 w-full max-w-4xl bg-red-600 text-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-extrabold mb-2">Caja - TIC Americas</h1>
        <p className="text-sm font-medium">
          Escanea el código de barras o QR para ver la información del producto.
        </p>
      </div>

      {/* SECCIÓN DE BÚSQUEDA */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <label
          htmlFor="qrInput"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Escanea o introduce el código de barras/QR:
        </label>
        <div className="flex flex-col items-start gap-2">
          <input
            type="text"
            id="qrInput"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ingresa el código..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
          <button
            onClick={buscarProducto}
            className="bg-black text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* ALERTA */}
      {alerta && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white z-[999999] transition-transform`}
          style={{
            backgroundColor: alerta.tipo === "error" ? "#dc2626" : "#16a34a",
          }}
        >
          {alerta.mensaje}
        </div>
      )}

      {/* MODAL CON INFORMACIÓN DEL PRODUCTO */}
      {producto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md shadow-2xl rounded-lg p-6 relative transform transition duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {producto.nombre}
            </h2>
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-40 h-40 object-cover mb-4 mx-auto rounded-lg"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500 mb-4 mx-auto rounded-lg">
                Sin imagen
              </div>
            )}
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Descripción:</span>{" "}
              {producto.descripcion}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Precio:</span> ${producto.precio}
            </p>
            <p
              className={`mb-4 ${
                producto.stock <= 5 ? "text-red-600 font-bold" : "text-gray-700"
              }`}
            >
              <span className="font-semibold">Stock:</span> {producto.stock}
            </p>

            {/* Acciones para admin */}
            {isAdmin ? (
              <>
                {!producto.venderMode ? (
                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        setProducto({ ...producto, venderMode: true })
                      }
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                    >
                      Vender
                    </button>
                    <button
                      onClick={cerrarProducto}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Cantidad a vender:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      className="w-full p-2 border rounded mb-4"
                    />
                    <div className="flex justify-between">
                      <button
                        onClick={solicitarConfirmacionVenta}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                      >
                        Confirmar Venta
                      </button>
                      <button
                        onClick={() =>
                          setProducto({ ...producto, venderMode: false })
                        }
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={cerrarProducto}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE VENTA (para admin) */}
      {confirmarVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[999999]">
          <div className="bg-white w-80 rounded-lg p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-red-700 mb-4">
              Confirmar Venta
            </h3>
            <p className="text-gray-800 mb-6">{confirmarVenta.mensaje}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmarVenta(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  confirmarVenta.onConfirm();
                }}
                className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Caja;
