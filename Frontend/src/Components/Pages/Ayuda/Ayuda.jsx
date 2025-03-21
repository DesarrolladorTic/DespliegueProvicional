import { useState } from "react";

const sections = [
  {
    title: "📌 ¿Qué es TIC Americas?",
    content: `
TIC Americas es un sistema integral diseñado para la verificación de precios y la gestión completa de productos, publicidad y procesos de venta en supermercados y tiendas con puntos de venta. La plataforma está pensada para optimizar la administración de inventario, publicidad y operaciones de caja, ofreciendo una experiencia intuitiva y segura tanto para administradores como para usuarios finales.

Principales características:
- Gestión de productos (crear, editar, eliminar y visualizar).
- Administración de publicidad mediante categorías y archivos multimedia.
- Procesos de venta y actualización de stock mediante lector de códigos QR/barra.
- Autenticación robusta con roles diferenciados y recuperación de contraseña.
- Importación y exportación de productos mediante archivos Excel.
- Interfaz responsiva y moderna, con animaciones y feedback visual.
    `
  },
  {
    title: "🛠️ Autenticación, Registro y Recuperación",
    content: `
El acceso al sistema se realiza mediante un proceso de autenticación basado en JSON Web Tokens (JWT). Esto garantiza que solo usuarios autorizados puedan acceder a las funcionalidades.

• **Inicio de Sesión:**  
  - Ingresa tu correo, contraseña y selecciona tu rol (Usuario o Admin).  
  - Para administradores, se solicita además una contraseña especial de admin.  
  - Opción "Recuérdame" para mantener la sesión iniciada.

• **Registro:**  
  - Los administradores deben registrarse proporcionando los datos de la empresa.  
  - Los usuarios finales se registran con sus datos personales.

• **Recuperación y Restablecimiento de Contraseña:**  
  - Si olvidaste tu contraseña, utiliza la opción “¿Olvidaste tu contraseña?” para recibir instrucciones vía email.  
  - En la pantalla de “Restablecer Contraseña” se valida el token recibido y se permite ingresar y confirmar una nueva contraseña.
    `
  },
  {
    title: "📦 Gestión de Productos",
    content: `
Los administradores tienen acceso al módulo de productos, donde se pueden realizar las siguientes acciones:

• **Agregar Producto:**  
  - Ingresar SKU, nombre, descripción, precio, categoría e imagen.  
  - Se valida la información antes de enviar los datos al servidor.

• **Editar Producto:**  
  - Actualiza los detalles del producto, incluyendo cambios en precio, descripción y categoría.

• **Eliminar Producto:**  
  - Remueve de forma definitiva un producto. Esta acción es irreversible.

• **Importación/Exportación:**  
  - **Importar:** Utiliza una plantilla Excel predefinida para cargar múltiples productos a la vez.  
  - **Exportar:** Genera un archivo Excel con la lista actual de productos, facilitando la gestión masiva.
  
Nota: Los usuarios finales solo tienen permiso para visualizar los productos.
    `
  },
  {
    title: "📢 Administración de Publicidad y Configuración del Programa",
    content: `
Este módulo permite gestionar toda la publicidad que se mostrará en la plataforma, a través de un proceso centralizado denominado “Iniciar Programa”.

• **Configuración de Categorías:**  
  - Crea, edita y elimina categorías para agrupar anuncios.  
  - Cada categoría se asocia a archivos multimedia (imágenes y videos).

• **Carga y Validación de Archivos:**  
  - Sube archivos (con validación de tipos permitidos) para cada categoría.  
  - Se muestran vistas previas de los archivos cargados y se pueden gestionar mediante un panel interactivo.
  
• **Inicio del Programa:**  
  - El programa solo se puede iniciar si al menos una categoría cuenta con archivos válidos.  
  - Al iniciar, se almacena la categoría seleccionada en el localStorage y se redirige a la vista de “programa”.
  
• **Panel de Categorías Activas:**  
  - Permite visualizar y gestionar (eliminar o modificar) las categorías que están en uso.
    `
  },
  {
    title: "💳 Caja y Procesos de Venta",
    content: `
El módulo de Caja está diseñado para agilizar el proceso de venta en puntos de venta físicos y virtuales.

• **Búsqueda de Productos:**  
  - Permite escanear o introducir manualmente el código de barras/QR para recuperar la información del producto.  
  - Se muestra nombre, descripción, precio, stock y foto (o un placeholder si no hay imagen).

• **Proceso de Venta (Solo para Administradores):**  
  - Activa un modo de venta que permite indicar la cantidad de unidades a vender.  
  - Se solicita confirmación antes de proceder con la actualización del stock en el backend.
  
• **Alertas y Feedback:**  
  - Mensajes emergentes informan sobre errores (como stock insuficiente o problemas con el token) y confirmaciones de ventas exitosas.
    `
  },
  {
    title: "📋 Importación y Exportación Masiva",
    content: `
El sistema facilita la gestión masiva de productos mediante el uso de archivos Excel.

• **Importación:**  
  - Descarga la plantilla Excel con el formato preestablecido.  
  - Completa la información de productos respetando las columnas indicadas.  
  - Sube el archivo y el sistema lo procesa, validando la integridad y formato de los datos.

• **Exportación:**  
  - Genera y descarga un archivo Excel que contiene todos los productos actualmente registrados, lo que facilita la actualización o respaldo de la información.
  
En caso de errores en el formato, el sistema notificará y evitará la carga de datos incompletos.
    `
  },
  {
    title: "📍 Lector de Códigos QR y Barras",
    content: `
Para mejorar la experiencia de consulta, TIC Americas integra un lector de códigos QR y de barras.

• **Funcionamiento:**  
  - Utiliza la cámara del dispositivo o un lector externo para escanear el código.  
  - Al ser escaneado, se despliega una ventana con toda la información del producto (nombre, SKU, descripción, precio, imagen y stock).

• **Funcionalidades Adicionales (Modo Admin):**  
  - Permite consultar y, en algunos casos, ajustar el stock en tiempo real.
  
Actualmente, se sigue trabajando para ampliar las capacidades del lector y optimizar su rendimiento.
    `
  },
  {
    title: "🧭 Navegación, Acceso y Diseño Responsivo",
    content: `
El sistema ha sido desarrollado con React y Tailwind CSS, lo que garantiza un diseño moderno, adaptativo y con transiciones suaves.

• **Header y Menú:**  
  - El header muestra el logo de TIC Americas y un menú de navegación que se adapta al tamaño de pantalla.  
  - Opciones disponibles incluyen “Inicio”, “Publicidad”, “Lector QR”, “Productos”, “Perfil” y “Ayuda”.  
  - En dispositivos móviles se utiliza un menú hamburguesa para facilitar la navegación.

• **Rutas y Acceso Condicional:**  
  - Algunas rutas, como “/programa”, ocultan el header para una experiencia inmersiva.  
  - El contenido y las opciones del menú varían según el rol del usuario (admin o usuario final).

• **Feedback Visual y Animaciones:**  
  - Cada acción (como clics o transiciones entre secciones) cuenta con animaciones y cambios de color que mejoran la experiencia del usuario.
    `
  },
  {
    title: "👤 Gestión de Perfil y Configuración Personal",
    content: `
El módulo de Perfil permite a los usuarios y administradores gestionar su información personal y configurar ciertos aspectos de la cuenta.

• **Visualización y Edición de Datos:**  
  - Actualiza información personal (nombre, correo, etc.) y, en el caso de administradores, los datos de la empresa.  
  - Posibilidad de cambiar la contraseña de forma segura.

• **Preferencias y Configuración:**  
  - Ajusta configuraciones personales como notificaciones o preferencias de visualización.
  
Esta sección asegura que cada usuario tenga control sobre su propia información y experiencia en la plataforma.
    `
  },
  {
    title: "🔧 Detalles Técnicos y Soporte",
    content: `
TIC Americas está basado en tecnologías modernas y robustas:

• **Arquitectura:**  
  - Frontend desarrollado en React, utilizando Context API para gestionar la autenticación y estado global.  
  - Estilos implementados con Tailwind CSS para un diseño responsivo y moderno.

• **Seguridad:**  
  - Comunicación segura con el backend a través de API REST y autenticación JWT.  
  - Validación de datos en cada solicitud y uso de middlewares para el manejo de errores.

• **Actualizaciones y Soporte:**  
  - El sistema se actualiza constantemente para incorporar nuevas funcionalidades y mejoras.  
  - En caso de incidencias o dudas, se recomienda contactar al equipo de soporte técnico.

• **Integración con Backend:**  
  - Todas las operaciones (CRUD, subida de archivos, autenticación, etc.) se realizan a través de llamadas API que garantizan la integridad y seguridad de la información.
  
Esta sección está destinada a usuarios avanzados y administradores que deseen conocer más sobre la infraestructura y políticas de soporte del sistema.
    `
  }
];

const Ayuda = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto mt-24 p-8 bg-gray-50 rounded-xl shadow-xl">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-10">
        📖 Manual de Usuario - TIC Americas
      </h1>
      <div className="max-w-4xl mx-auto">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <button
              className="w-full text-left bg-blue-600 text-white px-6 py-3 text-xl font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 flex justify-between"
              onClick={() => toggleSection(index)}
            >
              {section.title}
              <span>{activeIndex === index ? "🔼" : "🔽"}</span>
            </button>
            {activeIndex === index && (
              <div className="bg-white p-4 mt-2 rounded-lg shadow-md text-gray-700">
                <p className="text-lg whitespace-pre-line">{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ayuda;
