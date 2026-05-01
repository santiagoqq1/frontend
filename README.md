# Frontend

Frontend desarrollado en Vue 3 para la prueba técnica de arquitectura de microservicios.

## Tecnologías

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- HTML
- CSS
- JavaScript

## Descripción

Este proyecto corresponde a una SPA desacoplada que consume dos microservicios independientes:

```txt
Auth Service      -> http://127.0.0.1:8001
Pieces Service    -> http://127.0.0.1:8002
Frontend          -> http://localhost:5173
```

El frontend permite iniciar sesión mediante el Auth Service, almacenar el token generado y consumir el Pieces Service usando autenticación Bearer Token.

La aplicación permite registrar la fabricación de piezas seleccionando dinámicamente:

```txt
Proyecto -> Bloque -> Pieza
```

Luego permite ingresar el peso real, visualizar la diferencia de peso y registrar la fabricación en el backend.

## Funcionalidades principales

- Login de usuario.
- Almacenamiento del token en `localStorage`.
- Protección de rutas con Vue Router.
- Manejo de estado global con Pinia.
- Consumo de APIs REST con Axios.
- Carga dinámica de proyectos.
- Carga dinámica de bloques según el proyecto seleccionado.
- Carga dinámica de piezas según el bloque seleccionado.
- Validación de campos obligatorios.
- Validación de peso real numérico.
- Visualización de peso teórico.
- Cálculo de diferencia de peso.
- Registro persistente de fabricación en el Pieces Service.
- Cierre de sesión.

## Estructura principal

```txt
src/
  almacenes/
    autenticacion.js

  servicios/
    api.js

  vistas/
    loginvista.vue
    panelvista.vue

  router/
    index.js

  App.vue
  main.js
```

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Instalar dependencias principales si es necesario:

```bash
npm install axios vue-router pinia
```

Levantar el servidor de desarrollo:

```bash
npm run dev
```

El frontend quedará disponible en:

```txt
http://localhost:5173
```

## Servicios requeridos

Antes de usar el frontend, deben estar corriendo los dos servicios backend.

### Auth Service

```bash
cd C:\laragon\www\auth-service
php artisan serve --port=8001
```

URL:

```txt
http://127.0.0.1:8001
```

### Pieces Service

```bash
cd C:\laragon\www\pieces-service
php artisan serve --port=8002
```

URL:

```txt
http://127.0.0.1:8002
```

## Configuración de APIs

El archivo principal de configuración de APIs está en:

```txt
src/servicios/api.js
```

Contiene la configuración de Axios para consumir:

```txt
Auth Service
Pieces Service
```

Ejemplo:

```js
export const authApi = axios.create({
  baseURL: 'http://127.0.0.1:8001/api',
})

export const piecesApi = axios.create({
  baseURL: 'http://127.0.0.1:8002/api/v1',
})
```

El token se envía automáticamente al Pieces Service mediante un interceptor de Axios:

```js
piecesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

## Usuario de prueba

```txt
Email: santiago@correo.com
Password: santiago1234
```

## Flujo de uso

1. El usuario ingresa sus credenciales en el formulario de login.
2. El frontend envía las credenciales al Auth Service.
3. El Auth Service responde con un token Bearer.
4. El frontend guarda el token en `localStorage`.
5. El usuario es redirigido al panel principal.
6. El frontend consulta los proyectos al Pieces Service.
7. Al seleccionar un proyecto, se cargan sus bloques.
8. Al seleccionar un bloque, se cargan sus piezas.
9. El usuario selecciona una pieza.
10. El sistema muestra el peso teórico.
11. El usuario ingresa el peso real.
12. El frontend calcula la diferencia de peso.
13. El frontend envía el registro de fabricación al Pieces Service.
14. El backend guarda el registro y actualiza la pieza a estado `Fabricada`.

## Rutas del frontend

### Login

```txt
/
```

### Panel principal

```txt
/panel
```

La ruta `/panel` está protegida. Si no existe un token en el almacenamiento local, el usuario es redirigido al login.

## Validaciones en navegador

El formulario principal valida:

- Proyecto obligatorio.
- Bloque obligatorio.
- Pieza obligatoria.
- Peso real obligatorio.
- Peso real numérico.
- Peso real mayor o igual a cero.

## Decisiones técnicas

- Se utilizó Vue 3 por su simplicidad para construir una SPA desacoplada.
- Se utilizó Vue Router para manejar rutas públicas y protegidas.
- Se utilizó Pinia para manejar el estado global de autenticación.
- Se utilizó Axios para consumir las APIs REST.
- El token se almacena en `localStorage` para facilitar el consumo de APIs durante la prueba técnica.
- El frontend no accede directamente a ninguna base de datos.
- Toda la comunicación con backend se realiza mediante HTTP y JSON.
- El Pieces Service se consume enviando el token Bearer generado por el Auth Service.
- El cálculo de diferencia se visualiza en frontend, pero el backend también calcula y guarda la diferencia para mantener integridad de datos.

## Comandos útiles

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Construir para producción:

```bash
npm run build
```

Previsualizar build:

```bash
npm run preview
```

## Estado del frontend

El frontend permite:

- Iniciar sesión.
- Guardar token.
- Proteger rutas.
- Cerrar sesión.
- Consultar proyectos.
- Consultar bloques por proyecto.
- Consultar piezas por bloque.
- Registrar fabricación.
- Visualizar peso teórico.
- Ingresar peso real.
- Calcular diferencia de peso.
- Mostrar mensajes de éxito y error.