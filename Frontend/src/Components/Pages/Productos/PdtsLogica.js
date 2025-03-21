export function generarIdCorto() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export function agregarProducto(productos, nuevoProducto) {
  if (!nuevoProducto.id || !nuevoProducto.id.trim()) {
    nuevoProducto.id = generarIdCorto();
  }
  nuevoProducto.sku = (nuevoProducto.sku || "").substring(0, 5);
  if (!nuevoProducto.codigo_barras) {
    nuevoProducto.codigo_barras = "";
  }
  return [...productos, nuevoProducto];
}

export function editarProducto(productos, productoEditado) {
  return productos.map((p) => (p.id === productoEditado.id ? productoEditado : p));
}

export function eliminarProducto(productos, productoId) {
  return productos.filter((p) => p.id !== productoId);
}

export function toggleEstadoProducto(productos, productoId) {
  return productos.map((p) =>
    p.id === productoId ? { ...p, activo: !p.activo } : p
  );
}

export function filtrarProductosPorCategoria(productos, categoriaSeleccionada, categorias) {
  if (!categoriaSeleccionada || categoriaSeleccionada === "General") return productos;
  const catObj = categorias.find((cat) => cat.name === categoriaSeleccionada);
  if (!catObj) return [];
  return productos.filter((p) => p.categoria_id === catObj.id);
}

export function filtrarProductosPorEstado(productos, estadoFiltro) {
  return estadoFiltro === "activos"
    ? productos.filter((p) => p.activo)
    : productos.filter((p) => !p.activo);
}

export function filtrarGlobal(productos, busqueda) {
  if (!busqueda.trim()) return productos;
  return productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
    (p.sku && p.sku.toLowerCase().includes(busqueda.toLowerCase()))
  );
}

export function agregarCategoria(categorias, nuevaCategoria) {
  const categoriaLimpia = nuevaCategoria.trim();
  if (categoriaLimpia && !categorias.some((c) => c.name === categoriaLimpia)) {
    return [...categorias, { id: generarIdCorto(), name: categoriaLimpia }];
  }
  return categorias;
}

export function editarCategoriaYActualizarProductos(productos, categorias, categoriaSeleccionada, nuevaCategoria) {
  const productosActualizados = productos.map((producto) =>
    producto.categoria === categoriaSeleccionada
      ? { ...producto, categoria: nuevaCategoria }
      : producto
  );
  const categoriasActualizadas = categorias.map((cat) =>
    cat.name === categoriaSeleccionada ? { ...cat, name: nuevaCategoria.trim() } : cat
  );
  return { productosActualizados, categoriasActualizadas };
}

export function eliminarCategoria(productos, categorias, categoriaId) {
  const catObj = categorias.find((c) => c.id === categoriaId);
  const productosActualizados = productos.map((producto) =>
    producto.categoria === (catObj ? catObj.name : "")
      ? { ...producto, categoria: "" }
      : producto
  );
  const categoriasActualizadas = categorias.filter((c) => c.id !== categoriaId);
  return { productosActualizados, categoriasActualizadas };
}
