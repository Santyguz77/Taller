# 🚀 Deploy PWA en Netlify + Hostinger

## 📊 Tu arquitectura:

```
GITHUB (código) → NETLIFY (frontend) → HOSTINGER VPS (backend API)
```

---

## 📝 PASO A PASO:

### 1️⃣ PREPARAR ARCHIVOS LOCALMENTE

#### A. Generar íconos (5 min):
```bash
1. Abre: C:\Users\User\Desktop\Taller\generate-icons.html
2. Descarga TODOS los tamaños (8 archivos PNG)
3. Guárdalos en: C:\Users\User\Desktop\Taller\
```

#### B. Cambiar URL del API:
Edita estos archivos y cambia la URL:

**index.html (línea ~723):**
```javascript
// ANTES:
const API_BASE = "https://collecting-split-counts-operators.trycloudflare.com/api";

// DESPUÉS (usa tu URL real):
const API_BASE = "https://tu-dominio-hostinger.com/api";
// Ejemplo: "https://api.mipccomputadores.com/api"
```

**orden.html:**
```javascript
// Busca y cambia igual:
const API_URL = "https://tu-dominio-hostinger.com/api";
```

**order.html:**
```javascript
// Busca y cambia igual:
const API_URL = "https://tu-dominio-hostinger.com/api";
```

---

### 2️⃣ SUBIR A GITHUB

#### A. Agregar archivos nuevos:
```bash
cd C:\Users\User\Desktop\Taller

# Agregar todos los archivos nuevos
git add manifest.json
git add service-worker.js
git add icon-*.png
git add generate-icons.html

# Agregar cambios en los HTML
git add index.html orden.html order.html

# Commit
git commit -m "feat: Convertir a PWA - agregar manifest, service worker e iconos"

# Push a GitHub
git push origin main
```

---

### 3️⃣ CONFIGURAR NETLIFY

#### A. Archivo `netlify.toml` (crear en la raíz):
```toml
[build]
  publish = "."
  command = "echo 'No build needed'"

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"
    Service-Worker-Allowed = "/"
    Cache-Control = "no-cache, no-store, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json; charset=utf-8"
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

Guarda esto como: `C:\Users\User\Desktop\Taller\netlify.toml`

#### B. Subir a GitHub:
```bash
git add netlify.toml
git commit -m "feat: Configurar headers para PWA en Netlify"
git push origin main
```

---

### 4️⃣ VERIFICAR EN NETLIFY

Netlify hará deploy automático. Verifica:

1. Ve a: https://app.netlify.com
2. Tu sitio debería estar deployándose
3. Espera a que termine (1-2 min)
4. Abre tu URL: `https://tu-app.netlify.app`

---

### 5️⃣ CONFIGURAR CORS EN HOSTINGER

Tu backend en Hostinger necesita aceptar peticiones desde Netlify:

**En server.js (VPS Hostinger):**
```javascript
import cors from "cors";

const app = express();

// CAMBIAR ESTO:
app.use(cors());

// POR ESTO (más seguro):
app.use(cors({
  origin: [
    'https://tu-app.netlify.app',  // ⬅️ Tu URL de Netlify
    'http://localhost:3000',        // Para desarrollo local
  ],
  credentials: true
}));
```

#### Reiniciar servidor en Hostinger:
```bash
# SSH a tu VPS
ssh usuario@tu-vps-hostinger.com

# Ir a carpeta del proyecto
cd /ruta/a/tu/proyecto

# Reiniciar PM2
pm2 restart server

# O reiniciar Node
killall node
node server.js &
```

---

### 6️⃣ PROBAR LA PWA

#### En computadora:
```
1. Abre Chrome
2. Ve a: https://tu-app.netlify.app
3. F12 → Application → Manifest
4. Deberías ver: "MIPC Taller"
5. Icono de instalación (+) en barra de direcciones
```

#### En celular Android:
```
1. Chrome → https://tu-app.netlify.app
2. Menú (⋮) → "Instalar app"
3. ¡Listo!
```

#### En iPhone:
```
1. Safari → https://tu-app.netlify.app
2. Compartir (□↑) → "Agregar a inicio"
3. ¡Listo!
```

---

### 7️⃣ DOMINIO PERSONALIZADO (Opcional)

Si quieres usar tu propio dominio:

#### En Netlify:
```
1. Site settings → Domain management
2. Add custom domain → "mipccomputadores.com"
3. Configurar DNS según instrucciones
4. Netlify dará HTTPS automático (Let's Encrypt)
```

#### Actualizar URLs:
```javascript
// En tus archivos HTML, cambiar:
const API_BASE = "https://api.tudominio.com/api";
```

---

## 🔍 VERIFICACIÓN FINAL:

### ✅ Checklist Netlify:
- [ ] Todos los archivos en GitHub
- [ ] Deploy exitoso en Netlify
- [ ] PWA instalable (icono + en Chrome)
- [ ] Service Worker activado (F12 → Application)
- [ ] Funciona offline
- [ ] API se conecta a Hostinger

### ✅ Checklist Hostinger:
- [ ] CORS configurado para Netlify
- [ ] Server.js corriendo (PM2 o node)
- [ ] Base de datos accesible
- [ ] Puerto abierto (3000 o el que uses)
- [ ] HTTPS configurado (certificado SSL)

---

## 🐛 PROBLEMAS COMUNES:

### ❌ "Failed to fetch" en producción:
```
Causa: CORS bloqueado
Solución: Configurar cors() en server.js con tu URL de Netlify
```

### ❌ Service Worker no se registra:
```
Causa: Headers incorrectos
Solución: Agregar netlify.toml con los headers correctos
```

### ❌ No aparece "Instalar app":
```
Causa: Falta HTTPS o manifest.json no carga
Solución: Netlify da HTTPS automático, verifica manifest.json
```

### ❌ Iconos no se ven:
```
Causa: No subiste los PNG a GitHub
Solución: git add icon-*.png && git commit && git push
```

---

## 📊 ESTRUCTURA FINAL EN GITHUB:

```
tu-repo/
├── index.html              ✅
├── orden.html              ✅
├── order.html              ✅
├── manifest.json           ✅ NUEVO
├── service-worker.js       ✅ NUEVO
├── netlify.toml            ✅ NUEVO
├── icon-72.png             ✅ NUEVO
├── icon-96.png             ✅ NUEVO
├── icon-128.png            ✅ NUEVO
├── icon-144.png            ✅ NUEVO
├── icon-152.png            ✅ NUEVO
├── icon-192.png            ✅ NUEVO
├── icon-384.png            ✅ NUEVO
├── icon-512.png            ✅ NUEVO
├── image.png               ✅
├── generate-icons.html     ✅ NUEVO (opcional)
└── README.md               (tu actual)
```

---

## 🎯 RESUMEN:

1. ✅ Frontend (PWA) → **Netlify** (desde GitHub)
2. ✅ Backend (API) → **Hostinger VPS** (server.js)
3. ✅ Base de datos → **Hostinger VPS** (mipc.db)

**NO necesitas subir nada de PWA al VPS de Hostinger**
Todo el frontend va en GitHub → Netlify automático

---

## 🚀 COMANDOS RÁPIDOS:

```bash
# 1. Generar íconos (abre en navegador):
start generate-icons.html

# 2. Cambiar URLs en archivos (manual)

# 3. Subir a GitHub:
git add .
git commit -m "feat: PWA completa"
git push origin main

# 4. Netlify hace deploy automático

# 5. En Hostinger VPS (SSH):
ssh usuario@vps-hostinger
cd /ruta/proyecto
pm2 restart server
```

---

**¿Cuál es tu URL de Hostinger?** Te ayudo a configurar las URLs correctas.
