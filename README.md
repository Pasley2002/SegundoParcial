🧾 Sistema de Gestión, Facturación y Reportes (MEAN/Angular + Firebase)

Este proyecto es una aplicación web robusta desarrollada con Angular y Firebase para la gestión de productos, facturación y análisis de datos en tiempo real. Permite la gestión completa del catálogo, la generación de facturas en pesos (ARS) o dólares (USD), y ofrece herramientas administrativas avanzadas.

🚀 Tecnologías clave:

Frontend: Angular, TypeScript, HTML / CSS, Bootstrap.

Base de Datos: Firebase Firestore (Base de datos NoSQL en la nube).

Autenticación: Firebase Authentication.

Gráficos: Chart.js (vía ng2-charts) para visualización de datos.

Integración Externa: API REST del BCRA (cotización dólar oficial).

Otros: RxJS para el manejo asíncrono de datos.

📦 Funcionalidades principales:

Gestión y Procesos

ABM de Productos: Completo control administrativo (Crear, Editar, Eliminar) del catálogo de productos.

Facturación: Agregado de productos al carrito, visualización de resumen y generación de factura.

Cotización Dinámica: Cálculo en ARS y USD, utilizando la cotización actual obtenida de la API del BCRA.

Módulo de Usuario

Autenticación Segura: Registro y login gestionados por Firebase Auth.

Control de Acceso: Uso de roles (administrador / cliente) para restringir el acceso a módulos sensibles (Reportes, ABM de productos).

Herramientas Colaborativas y Analíticas

Chat en Tiempo Real: Comunicación instantánea entre usuarios y administradores, implementada con Firebase Firestore y onSnapshot para actualizaciones en tiempo real.

Módulo de Reportes (Solo Admin):

Gráfico de Ventas por Día (basado en el historial de facturas).

Gráfico de Top Productos Más Vendidos.

Gráfico de Evolución del Dólar (integración con BCRA).

💾 Persistencia de Datos (Backend): 

Este proyecto utiliza una base de datos en la nube de alta disponibilidad.

Toda la información crítica de la aplicación (usuarios, roles, productos, facturas y mensajes de chat) es almacenada de forma persistente en Firebase Firestore.

Esto permite:

Datos en Tiempo Real: Todos los usuarios ven los cambios (inventario, chat, reportes) al instante.

Multiusuario: El sistema es funcional y coherente para múltiples usuarios simultáneos.

Seguridad: Los datos están protegidos por las reglas de seguridad de Firebase.
