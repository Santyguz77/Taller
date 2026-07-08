# 🛡️ PROTECCIÓN DE DATOS - SISTEMA DE RESPALDO

## 🚨 PROBLEMA RESUELTO

Se identificó que los clientes se borraban porque el endpoint `POST /api/:table` ejecuta un `DELETE FROM` masivo antes de insertar nuevos datos. Si se enviaba un array vacío por error, **se borraban todos los registros**.

---

## ✅ PROTECCIONES IMPLEMENTADAS

### 1️⃣ **Validación en el Backend** ([server.js](server.js#L84-L140))
- ❌ **Bloquea** intentos de guardar arrays vacíos en tablas críticas (`clients`, `orders`, `invoices`)
- ✅ **Verifica** si hay datos existentes antes de permitir el borrado
- 📝 **Retorna error** con mensaje claro si se intenta vaciar una tabla crítica

```javascript
// Si intentas hacer POST con array vacío a /api/clients:
{
  "error": "No se permite borrar todos los registros de tablas críticas",
  "tip": "Si realmente deseas vaciar la tabla, usa el endpoint de backup primero"
}
```

### 2️⃣ **Backup Automático** ([server.js](server.js#L110-L124))
- 🔄 **Crea respaldo automático** antes de cada operación `DELETE FROM`
- 📅 **Nombra con timestamp**: `clients_backup_2025-12-21T15-30-45-123Z`
- 💾 **Guarda en SQLite** en la misma base de datos
- 📊 **Registra en consola** cuántos registros se respaldaron

### 3️⃣ **Validación en el Frontend** ([index.html](index.html#L1528-L1537))
- ⚠️ **Detecta** arrays vacíos antes de enviar al servidor
- 🛑 **Bloquea** la operación y muestra error al usuario
- 📝 **Registra en consola** el intento bloqueado

```javascript
// Ejemplo de error en frontend:
"No se puede vaciar la tabla clients. Si esto es intencional, contacta al administrador."
```

### 4️⃣ **Logging Completo** ([server.js](server.js))
- 📝 Todas las operaciones DELETE registran:
  - ✅ Tabla afectada
  - ✅ ID del registro (DELETE individual)
  - ✅ Cantidad de registros (DELETE masivo)
  - ✅ Timestamp automático en consola

---

## 🔄 ENDPOINTS DE RESPALDO

### 📋 **Listar Backups Disponibles**
```bash
GET /api/backups/:table
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/backups/clients
```

**Respuesta:**
```json
[
  {
    "name": "clients_backup_2025-12-21T15-30-45-123Z",
    "timestamp": "2025:12:21T15:30:45:123Z"
  },
  {
    "name": "clients_backup_2025-12-21T10-15-20-456Z",
    "timestamp": "2025:12:21T10:15:20:456Z"
  }
]
```

---

### 🔄 **Restaurar desde Backup**
```bash
POST /api/restore/:backupTable/:targetTable
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/restore/clients_backup_2025-12-21T15-30-45-123Z/clients
```

**Respuesta:**
```json
{
  "success": true,
  "restored": 150,
  "preRestoreBackup": "clients_pre_restore_2025-12-21T16-00-00-789Z"
}
```

**⚠️ IMPORTANTE:** 
- Antes de restaurar, el sistema **crea un backup del estado actual** por seguridad
- Puedes revertir la restauración usando el backup `pre_restore`

---

## 🔍 CÓMO RESTAURAR CLIENTES BORRADOS

### Opción 1: Desde el VPS (Recomendado)

1. **SSH al VPS:**
   ```bash
   ssh usuario@tu-vps-ip
   ```

2. **Navegar a la carpeta del proyecto:**
   ```bash
   cd /ruta/a/tu/proyecto
   ```

3. **Ver backups disponibles:**
   ```bash
   curl http://localhost:3000/api/backups/clients
   ```

4. **Restaurar el backup más reciente:**
   ```bash
   # Reemplaza el nombre del backup con el que obtuviste arriba
   curl -X POST http://localhost:3000/api/restore/clients_backup_FECHA/clients
   ```

### Opción 2: Desde SQLite directamente

1. **Conectar a la base de datos:**
   ```bash
   sqlite3 mipc.db
   ```

2. **Ver tablas de backup:**
   ```sql
   SELECT name FROM sqlite_master 
   WHERE type='table' AND name LIKE 'clients_backup_%' 
   ORDER BY name DESC;
   ```

3. **Ver contenido de un backup:**
   ```sql
   SELECT * FROM clients_backup_2025-12-21T15-30-45-123Z LIMIT 5;
   ```

4. **Restaurar manualmente:**
   ```sql
   BEGIN;
   DELETE FROM clients;
   INSERT INTO clients SELECT id, data FROM clients_backup_FECHA;
   COMMIT;
   ```

---

## 📊 MONITOREO Y AUDITORÍA

### Ver logs del servidor en tiempo real:
```bash
# En el VPS donde corre el servidor
pm2 logs server
# O si usas node directamente:
tail -f /ruta/logs/server.log
```

### Logs que verás:
- ✅ `✅ Backup creado: clients_backup_... (150 registros)`
- 🗑️ `🗑️ DELETE ejecutado en clients`
- ✅ `✅ clients actualizado: 150 registros guardados`
- ⚠️ `⚠️ BLOQUEADO: Intento de borrar todos los registros de clients`

---

## 🚀 CÓMO REINICIAR EL SERVIDOR CON LAS NUEVAS PROTECCIONES

1. **SSH al VPS:**
   ```bash
   ssh usuario@tu-vps-ip
   ```

2. **Navegar al proyecto:**
   ```bash
   cd /ruta/a/tu/proyecto
   ```

3. **Reiniciar el servidor:**
   ```bash
   # Si usas PM2:
   pm2 restart server
   
   # Si usas systemd:
   sudo systemctl restart mipc-server
   
   # Si usas node directamente:
   pkill -f "node server.js"
   node server.js &
   ```

4. **Verificar que funciona:**
   ```bash
   curl http://localhost:3000/api/clients
   ```

---

## 📝 RECOMENDACIONES ADICIONALES

### 🔒 Seguridad:
- ✅ Las validaciones están tanto en frontend como backend
- ✅ Los backups se crean automáticamente
- ✅ Hay logging completo de todas las operaciones

### 🗄️ Mantenimiento de Backups:
- Los backups se acumulan en la base de datos
- **Recomendación:** Crear un cron job que elimine backups antiguos (>30 días)

**Script de limpieza (ejecutar mensualmente):**
```bash
sqlite3 mipc.db <<EOF
-- Ver backups antiguos
SELECT name FROM sqlite_master 
WHERE type='table' AND name LIKE '%backup%' 
ORDER BY name;

-- Eliminar backups mayores a 30 días (ajusta según necesites)
-- (Tendrás que ejecutar DROP TABLE manualmente para cada uno)
EOF
```

### 🔄 Backup Externo Adicional:
**Recomendación:** Hacer backup diario de `mipc.db` completo

```bash
# Crear script en /home/usuario/backup-db.sh
#!/bin/bash
BACKUP_DIR="/home/usuario/backups"
DATE=$(date +%Y-%m-%d)
sqlite3 /ruta/a/mipc.db ".backup '$BACKUP_DIR/mipc-$DATE.db'"
find $BACKUP_DIR -name "mipc-*.db" -mtime +30 -delete
```

**Agregar a crontab:**
```bash
crontab -e
# Agregar esta línea (backup diario a las 3 AM):
0 3 * * * /home/usuario/backup-db.sh
```

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Puedo desactivar las protecciones?**  
R: Sí, pero NO se recomienda. Si necesitas vaciar una tabla, usa el endpoint de backup manualmente primero.

**P: ¿Los backups ocupan mucho espacio?**  
R: Depende de cuántos datos tengas. Con 200 clientes, cada backup ocupa ~50-100KB. Limpia backups antiguos mensualmente.

**P: ¿Qué pasa si el servidor se reinicia?**  
R: Los backups persisten en la base de datos SQLite. No se pierden.

**P: ¿Puedo restaurar parcialmente?**  
R: No directamente. Deberías hacerlo manualmente con SQL, consultando el backup y copiando registros específicos.

---

## 🆘 SOPORTE

Si tienes problemas o necesitas restaurar datos, contacta al administrador del sistema con:
1. Fecha aproximada de cuando se borraron los datos
2. Cantidad aproximada de registros perdidos
3. Logs del servidor si están disponibles

---

**Última actualización:** 21 de diciembre de 2025  
**Versión del sistema:** 2.1 (con protecciones de datos)
