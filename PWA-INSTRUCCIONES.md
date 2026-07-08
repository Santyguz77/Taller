# 📱 MIPC Taller - PWA (Progressive Web App)

## ✅ Archivos creados:

1. **manifest.json** - Configuración de la PWA
2. **service-worker.js** - Cache offline y sincronización
3. **generate-icons.html** - Generador de íconos
4. Meta tags agregados a: index.html, orden.html, order.html

---

## 🎨 PASO 1: Generar los íconos

1. Abre en el navegador: `generate-icons.html`
2. Descarga todos los tamaños haciendo clic en cada botón:
   - icon-72.png
   - icon-96.png
   - icon-128.png
   - icon-144.png
   - icon-152.png
   - icon-192.png
   - icon-384.png
   - icon-512.png

3. Guarda todos los archivos en la carpeta `Taller` (junto a index.html)

---

## 🚀 PASO 2: Probar la PWA

### En tu computadora:
1. Abre Chrome
2. Ve a: http://localhost:3000/index.html (o tu servidor local)
3. Presiona F12 (DevTools)
4. Ve a la pestaña "Application" → "Manifest"
5. Deberías ver toda la info de MIPC Taller

### En tu celular Android:
1. Abre Chrome en el celular
2. Ve a tu URL de Cloudflare: https://collecting-split-counts-operators.trycloudflare.com/index.html
3. En el menú (3 puntitos) aparecerá: **"Instalar app"** o **"Agregar a pantalla de inicio"**
4. Haz clic y ¡listo! Se instalará como app

### En iPhone/iPad:
1. Abre Safari
2. Ve a tu URL
3. Toca el botón de compartir (cuadrado con flecha)
4. Selecciona **"Agregar a pantalla de inicio"**
5. ¡Listo!

---

## 🔧 PASO 3: Actualizar server.js (IMPORTANTE)

Tu server.js necesita servir los archivos estáticos correctamente:

```javascript
// Agregar DESPUÉS de las importaciones:
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Agregar ANTES de las rutas de API:
app.use(express.static(__dirname));

// Servir manifest.json con el tipo correcto
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(join(__dirname, 'manifest.json'));
});

// Servir service worker
app.get('/service-worker.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(join(__dirname, 'service-worker.js'));
});
```

---

## 📊 PASO 4: Verificar que funciona

### Checklist:

✅ **Manifest cargado:**
- DevTools → Application → Manifest
- Deberías ver "MIPC Taller" con todos los iconos

✅ **Service Worker registrado:**
- DevTools → Application → Service Workers
- Estado: "Activated and running"

✅ **Funciona offline:**
1. Abre la app
2. DevTools → Network → Marcar "Offline"
3. Recarga la página
4. ¡Debería seguir funcionando!

✅ **Se puede instalar:**
- Icono de instalación (+) en la barra de direcciones (Chrome)
- O mensaje: "Instalar MIPC Taller"

---

## 🎯 Características activadas:

✅ **Instalable** - Se instala como app nativa
✅ **Offline** - Funciona sin internet (páginas visitadas)
✅ **Cache inteligente** - Red primero, cache de respaldo
✅ **Ícono personalizado** - Logo de MIPC con 🔧
✅ **Pantalla completa** - Sin barras del navegador
✅ **Accesos directos** - Nueva orden, Ver órdenes
✅ **Color de tema** - Amarillo MIPC (#c7ff00)

---

## ⚡ Comandos útiles:

### Limpiar cache del SW (desde DevTools Console):
```javascript
navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()))
caches.keys().then(keys => keys.forEach(k => caches.delete(k)))
location.reload()
```

### Ver estado del SW:
```javascript
navigator.serviceWorker.getRegistrations().then(r => console.log(r))
```

---

## 🐛 Solución de problemas:

**❌ No aparece opción de instalar:**
- Verifica que manifest.json se carga correctamente
- Asegúrate de estar en HTTPS (Cloudflare) o localhost
- Revisa la consola por errores

**❌ Service Worker no se registra:**
- Verifica que service-worker.js existe en la raíz
- Revisa la consola por errores
- Asegúrate que el servidor sirve archivos .js correctamente

**❌ No funciona offline:**
- Abre la app al menos una vez con internet
- Verifica en DevTools → Application → Cache Storage
- Debería haber archivos guardados

**❌ Los íconos no se ven:**
- Genera los íconos con generate-icons.html
- Guárdalos en la carpeta raíz
- Verifica que existen: icon-192.png e icon-512.png

---

## 🎨 Personalizar el ícono:

Si quieres cambiar el diseño del ícono:

1. Abre `generate-icons.html`
2. Modifica la función `drawIcon()` en el código
3. Cambia colores, texto, o emoji
4. Regenera todos los tamaños

---

## 📱 Resultado final:

Tu sistema ahora es una **PWA completa** que:
- ✅ Se instala como app en cualquier dispositivo
- ✅ Funciona offline
- ✅ Carga super rápido
- ✅ Parece una app nativa
- ✅ Tiene ícono profesional

**¡Todo sin cambiar tu código existente!** 🚀

---

## 🔄 Actualizaciones futuras:

Para actualizar la PWA:
1. Cambia `CACHE_VERSION` en service-worker.js
2. Los usuarios verán mensaje de actualización
3. Recargando la página se actualiza automáticamente

---

**Desarrollado para MIPC Computadores** 🔧
