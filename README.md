# ⚡ ElectroApp - Landing Page

Landing page con waitlist para ElectroApp, un CRM gratuito para electricistas profesionales.

## 🚀 Demo

- **Producción:** [tu-url-de-vercel.vercel.app](https://tu-url-de-vercel.vercel.app)
- **Repositorio:** [GitHub](https://github.com/tu-usuario/electroapp)

## 📸 Screenshots

### Landing Page
![Landing](./screenshots/landing.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

## 🛠️ Tech Stack

- **Frontend:** React 18
- **Estilos:** CSS Modules
- **Base de datos:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Control de versiones:** Git + GitHub

## ✨ Características

### Versión Actual (Semana 3)
- ✅ Landing page con sección de beneficios
- ✅ Formulario de waitlist funcional
- ✅ Validación de emails duplicados
- ✅ Contador dinámico de usuarios registrados
- ✅ Dashboard de administración
- ✅ Filtros por fecha (7 días, 30 días, todos)
- ✅ Copiar emails al clipboard
- ✅ Exportar lista a CSV
- ✅ Diseño responsive (mobile + desktop)
- ✅ Conexión con Supabase (PostgreSQL)
- ✅ Row Level Security (RLS) configurado
- ✅ Deploy automático en Vercel

### Próximas Features (Semana 4-5)
- [ ] Actualización en tiempo real (Supabase Realtime)
- [ ] Paginación del dashboard
- [ ] Búsqueda de emails
- [ ] Autenticación de admin
- [ ] Envío de emails de bienvenida

## 📁 Estructura del Proyecto
```
electroapp/
├── public/
├── src/
│   ├── App.js                      # Componente principal
│   ├── App.module.css
│   ├── Header.js                   # Header con logo
│   ├── Footer.js                   # Footer con contador
│   ├── BenefitCard.js              # Card de beneficios
│   ├── WaitlistForm.js             # Formulario con Supabase
│   ├── EmailDashboard.js           # Dashboard de admin
│   ├── supabaseClient.js           # Configuración de Supabase
│   └── index.js
├── .env.local                      # Variables de entorno (no subir a Git)
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación Local

### Prerrequisitos
- Node.js 18+ instalado
- Cuenta en Supabase (gratis)
- Git instalado

### Pasos

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/electroapp.git
cd electroapp
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

Crear archivo `.env.local` en la raíz:
```env
REACT_APP_SUPABASE_URL=tu_supabase_url
REACT_APP_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configurar Supabase:**

Ejecutar en el SQL Editor de Supabase:
```sql
-- Crear tabla waitlist
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy para permitir lectura pública
CREATE POLICY "allow_public_read" ON waitlist
  FOR SELECT USING (true);

-- Policy para permitir inserción pública
CREATE POLICY "allow_public_insert" ON waitlist
  FOR INSERT WITH CHECK (true);
```

5. **Iniciar servidor de desarrollo:**
```bash
npm start
```

La app estará disponible en `http://localhost:3000`

## 📊 Base de Datos (Supabase)

### Tabla: `waitlist`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID | ID único (primary key) |
| email | VARCHAR(255) | Email del usuario (unique) |
| created_at | TIMESTAMP | Fecha de registro |

### Row Level Security (RLS)
- ✅ Lectura pública (cualquiera puede ver el contador)
- ✅ Inserción pública (cualquiera puede registrarse)
- ❌ Actualización/borrado bloqueados

## 🌐 Deploy en Vercel

### Configuración

1. Conectar repositorio de GitHub en Vercel
2. Agregar variables de entorno:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3. Deploy automático en cada push a `main`

### Variables de Entorno en Vercel
```
Settings → Environment Variables → Add New

Name: REACT_APP_SUPABASE_URL
Value: https://tuproyecto.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development

Name: REACT_APP_SUPABASE_ANON_KEY
Value: tu_anon_key
Environments: ✅ Production ✅ Preview ✅ Development
```

## 📝 Aprendizajes (Semana 1-3)

### Semana 1
- HTML/CSS básico
- JavaScript vanilla
- localStorage para datos temporales

### Semana 2
- Migración a React
- Componentes funcionales
- React Hooks (useState, useEffect)
- CSS Modules
- Git básico

### Semana 3
- Integración con Supabase
- PostgreSQL queries (SELECT, INSERT, COUNT)
- Row Level Security (RLS)
- Manejo de estados asíncronos
- Clipboard API
- Exportar a CSV
- Deploy en Vercel
- Variables de entorno

## 🐛 Bugs Resueltos

### Bug #1: RLS bloqueaba queries
**Problema:** Contador mostraba 0 aunque había emails en Supabase  
**Causa:** RLS habilitado sin policies  
**Solución:** Crear policies para `anon` public

### Bug #2: Variables de entorno undefined en Vercel
**Problema:** Error 401 en producción  
**Causa:** Build con caché sin las nuevas variables  
**Solución:** Redeploy sin "Use existing Build Cache"

## 📈 Métricas Actuales

- **Usuarios en waitlist:** [Ver en vivo en el sitio]
- **Performance Lighthouse:** 95+ en todas las categorías
- **Tiempo de carga:** < 1 segundo
- **Uptime:** 99.9% (Vercel)

## 🤝 Contribuciones

Este es un proyecto personal de aprendizaje, pero si encontrás bugs o tenés sugerencias:

1. Abrí un Issue en GitHub
2. Fork el repositorio
3. Creá un Pull Request

## 📄 Licencia

MIT License - Libre para usar y modificar

## 👤 Autor

**Emanuel Naon**
- GitHub: [@emanuelnaon](https://github.com/emanuelnaon)
- LinkedIn: [tu-perfil](https://linkedin.com/in/emanuelnaon)

---

⚡ Hecho con React, Supabase y mucho café