# Semana 2

## Dia 1 

### Lo que aprendi: 
- React es Javascript y HTML
- Componente = una función que retorna JSX (HTML + JS)
- JSX usa llaves para incluir Javascript en el código
- Los componentes se pueden reutilizar
- El componente App es la raíz del nodo de la aplicación
- Hot Reload: cuando hago cambios en un archivo, los cambios se reflejan automáticamente.

### Componentes creados:
1. App (componente principal)
2. Header (muestra el título y el logo)
3. Footer (muestra el pie de página)

### Sintaxis clave:
```jsx
function MiComponente() {
   return contenido
}

export default MiComponente;

// uso :
import MiComponente from './MiComponente';
```
### Diferencias entre JSX y HTML:
- `class` se escribe como `className`
- `for` se escribe como `htmlFor`
- `style="color:red"` se escribe como `style={{color: 'red'}}`
- componentes reutilizables

## Día 2 - Martes

### Fecha: [HOY]
### Tiempo invertido: ~1.5 horas

---

## Lo que aprendí:

### 1. ¿Qué son las Props?

Props = Properties (propiedades)

Son la forma de pasar datos de un componente padre a un componente hijo.

**Analogía:** Props son como los parámetros de una función.
```jsx
// Función
function saludar(nombre) {
  return "Hola " + nombre;
}

// Componente
function Saludo({ nombre }) {
  return Hola {nombre}
}

// Uso

```

---

### 2. Sintaxis de Props

**Forma larga:**
```jsx
function MiComponente(props) {
  return {props.titulo}
}
```

**Forma corta (destructuring) - RECOMENDADA:**
```jsx
function MiComponente({ titulo, descripcion }) {
  return {titulo}
}
```

---

### 3. Pasar props desde el padre
```jsx
// Componente padre (App.js)


// Componente hijo (Header.js)
function Header({ titulo, subtitulo }) {
  return {titulo}
}
```

---

### 4. Props con valores por defecto
```jsx
function Header({ titulo = "App", subtitulo = "Descripción" }) {
  return {titulo}
}

// Si no paso props, usa los valores por defecto
  // Muestra "App"
  // Muestra "Otra cosa"
```

---

### 5. Componentes reutilizables

El verdadero poder de props: escribís el componente UNA vez,
lo usás múltiples veces con diferentes datos.
```jsx



```

Mismo diseño, diferente contenido.

---

## Componentes creados hoy:

**BenefitCard.js** - Tarjeta reutilizable para mostrar beneficios

---

## Reglas importantes de Props:

1. ✅ Props se pasan de padre → hijo (nunca al revés)
2. ✅ Props son READ-ONLY (el hijo NO puede modificarlas)
3. ✅ Props pueden ser cualquier tipo: string, number, boolean, array, object, función
4. ✅ Nombres de props usan camelCase: `backgroundColor` no `background-color`

---

## Diferencias clave:

| HTML | React con Props |
|------|-----------------|
| `<div class="card">` | `<Card tipo="primaria">` |
| Atributos fijos | Atributos dinámicos |
| Copiar/pegar para reutilizar | Un componente, múltiples usos |

---

## Ejemplo real del proyecto:

**Antes (sin props):**
- 4 divs idénticos con diferente texto
- 80 líneas de código repetido
- Cambiar diseño = modificar 4 lugares

**Después (con props):**
- 1 componente BenefitCard
- 4 usos con diferentes props
- Cambiar diseño = modificar 1 lugar

---

## Lo que me costó:
[Escribí si algo te confundió]

---

## Preguntas para mañana:
- ¿Cómo hago que un componente "recuerde" valores? (useState)
- ¿Cómo hago el formulario de la landing? (Eventos + Estado)

---

## Próxima sesión: Miércoles
Tema: useState (Estado) - Hacer el formulario funcional
```

---

## ✅ CHECKLIST DEL MARTES

- [ ] `Header.js` acepta props (titulo, subtitulo)
- [ ] `App.js` pasa props al Header
- [ ] Probé cambiar los valores de las props
- [ ] `BenefitCard.js` creado
- [ ] 4 `BenefitCard` usados en App.js con diferentes datos
- [ ] Entendí que props van de padre → hijo
- [ ] Entendí que props son read-only
- [ ] `aprendizaje-react.md` actualizado

---
## Día 3 - Miércoles

### Fecha: [HOY]
### Tiempo invertido: ~2 horas

---

## Lo que aprendí:

### 1. ¿Qué es el State (Estado)?

El estado es la "memoria" de un componente. Son variables que pueden
cambiar con el tiempo y cuando cambian, React re-renderiza el componente.

**Diferencia clave:**

| Props | State |
|-------|-------|
| Vienen de afuera | Son internos |
| Read-only | Se pueden modificar |
| Fijos al renderizar | Cambian con el tiempo |

---

### 2. Sintaxis de useState
```jsx
import { useState } from 'react';

const [valor, setValor] = useState(valorInicial);
//     ↑       ↑                    ↑
//     │       │                    └─ Valor al crear el componente
//     │       └─ Función para cambiar el estado
//     └─ Variable con el valor actual
```

**Ejemplos:**
```jsx
const [count, setCount] = useState(0);           // Número
const [email, setEmail] = useState('');          // String
const [isOpen, setIsOpen] = useState(false);     // Boolean
const [items, setItems] = useState([]);          // Array
const [user, setUser] = useState(null);          // Object/null
```

---

### 3. Actualizar el estado

**Con valores simples:**
```jsx
setCount(5);              // Establecer valor fijo
setCount(count + 1);      // Incrementar
setEmail('nuevo@email');  // Cambiar string
```

**Con arrays (IMPORTANTE - crear nuevo array):**
```jsx
// ❌ NO HACER (no funciona)
items.push(nuevoItem);
setItems(items);

// ✅ HACER (crear nuevo array)
setItems([...items, nuevoItem]);          // Agregar al final
setItems([nuevoItem, ...items]);          // Agregar al principio
setItems(items.filter(i => i.id !== 5));  // Eliminar
```

---

### 4. Controlled inputs (Inputs controlados)

Un input controlado es aquel cuyo valor está sincronizado con el estado:
```jsx
const [email, setEmail] = useState('');

<input 
  value={email}                           // React controla el valor
  onChange={(e) => setEmail(e.target.value)}  // Actualiza estado
/>
```

**Ventajas:**
- Validación en tiempo real
- Limpiar el input fácilmente (`setEmail('')`)
- Single source of truth (el estado es la verdad)

---

### 5. Eventos en React
```jsx
// onClick
<button onClick={() => setCount(count + 1)}>Click

// onChange (inputs)
<input onChange={(e) => setEmail(e.target.value)} />

// onSubmit (formularios)
<form onSubmit={(e) => {
  e.preventDefault();  // ← MUY IMPORTANTE
  // ... resto del código
}}>
```

**`e.preventDefault()`** evita que el formulario recargue la página.

---

### 6. Renderizado condicional
```jsx
// Mostrar solo si hay valor
{message && {message}}

// Mostrar una cosa u otra
{isLoading ? Cargando... : Listo}

// Operador ternario para estilos

  {message}

```

---

## Componentes creados hoy:

1. **Counter.js** - Componente de prueba para entender useState
2. **WaitlistForm.js** - Formulario funcional con validación

---

## Flujo completo del formulario:
```
1. Usuario escribe en input
   ↓
2. onChange ejecuta setEmail(...)
   ↓
3. Estado 'email' se actualiza
   ↓
4. React re-renderiza (input muestra el nuevo valor)
   ↓
5. Usuario hace submit
   ↓
6. handleSubmit valida el email
   ↓
7. Si es válido: agrega a 'emails' array
   ↓
8. Contador se actualiza automáticamente
   ↓
9. Input se limpia (setEmail(''))
```

---

## Reglas de useState (MUY IMPORTANTE):

1. ✅ Solo se puede usar dentro de componentes funcionales
2. ✅ Debe estar en el nivel superior (no dentro de if/loops)
3. ✅ Siempre usar el setter para cambiar: `setCount(5)` no `count = 5`
4. ✅ Con arrays/objects, crear nuevos (spread operator)
5. ✅ React re-renderiza automáticamente cuando el estado cambia

---

## Errores comunes que evité:

1. ❌ Mutar el estado directamente
```jsx
   // MAL
   emails.push(newEmail);
   
   // BIEN
   setEmails([...emails, newEmail]);
```

2. ❌ Olvidar preventDefault en formularios
```jsx
   // MAL
   const handleSubmit = (e) => {
     // Sin preventDefault, la página se recarga
   }
   
   // BIEN
   const handleSubmit = (e) => {
     e.preventDefault();  // ← Esto
   }
```

3. ❌ Usar el estado inmediatamente después de setearlo
```jsx
   // MAL - el estado no cambia instantáneamente
   setCount(5);
   console.log(count);  // Muestra el valor ANTERIOR
   
   // BIEN - usar el valor directamente
   const newCount = 5;
   setCount(newCount);
   console.log(newCount);  // Muestra 5
```

---

## Comparación: HTML puro vs React

### HTML puro (Semana 1):
```javascript
const emailInput = document.getElementById('email');
const button = document.getElementById('btn');

button.addEventListener('click', () => {
  const email = emailInput.value;
  // Manipular DOM manualmente
  document.getElementById('counter').textContent = count;
});
```

### React (Semana 2):
```jsx
const [email, setEmail] = useState('');
const [count, setCount] = useState(0);

// React maneja el DOM automáticamente
<input value={email} onChange={(e) => setEmail(e.target.value)} />
{count}
```

**React es declarativo: Le decimos QUÉ mostrar, no CÓMO mostrarlo.**

---

## Lo que me costó:
[Escribí si algo te confundió]

---

## Próxima sesión: Jueves
Tema: Migrar todos los estilos a CSS Modules + Pulir la landing completa
```

---

## ✅ CHECKLIST DEL MIÉRCOLES

- [ ] `Counter.js` creado y funcionando
- [ ] Entendí la sintaxis: `const [valor, setValor] = useState(inicial)`
- [ ] Probé los 3 botones del contador
- [ ] `WaitlistForm.js` creado
- [ ] Formulario acepta emails y los guarda
- [ ] Validación funciona (email sin @ da error)
- [ ] Duplicados se detectan
- [ ] Contador se actualiza automáticamente
- [ ] Mensaje aparece y desaparece después de 3 segundos
- [ ] Input se limpia después de enviar
- [ ] Entendí la diferencia entre Props y State
- [ ] `aprendizaje-react.md` actualizado

---

## 🎯 RESULTADO ESPERADO

Tu `localhost:3000` debería tener:
```
┌──────────────────────────────────────┐
│ ⚡ ElectroApp                         │ ← Header
│ Sistema de gestión gratis...         │
├──────────────────────────────────────┤
│                                       │
│      ¿Por qué ElectroApp?            │
│                                       │
│  [4 BenefitCards...]                 │
│                                       │
│ ┌─────────────────────────────────┐  │
│ │     Próximamente                │  │
│ │                                  │  │
│ │ [tu@email.com] [Unirme]         │  │ ← Formulario funcional
│ │                                  │  │
│ │ ✅ ¡Listo! Te avisaremos...     │  │ ← Mensaje (si enviaste)
│ │                                  │  │
│ │ 2 electricistas ya se anotaron  │  │ ← Contador dinámico
│ └─────────────────────────────────┘  │
│                                       │
├──────────────────────────────────────┤
│ © 2026 ElectroApp...                 │ ← Footer

---

## Día 5 - Viernes

### Fecha: [HOY]
### Tiempo invertido: ~1 hora

---

## Lo que hice hoy:

### 1. Git y GitHub
- Inicialicé Git en el proyecto React
- Creé `.gitignore` para excluir `node_modules`
- Hice el primer commit
- Creé repositorio `electroapp-react` en GitHub
- Pusheé el código

### 2. Deploy en Vercel
- Conecté GitHub con Vercel
- Deployé automáticamente
- Verifiqué que funciona en producción

### 3. URLs finales

**Versión HTML (Semana 1):**
https://electroapp-landing.vercel.app

**Versión React (Semana 2):**
https://electroapp-react-[mi-url].vercel.app

---

## 🎉 SEMANA 2 COMPLETADA

### Proyecto final:
✅ Landing page funcional en React
✅ 6 componentes modulares (Header, Footer, BenefitCard, WaitlistForm, App, index)
✅ CSS Modules para estilos
✅ Formulario con validación
✅ Responsive design
✅ Deployed en Vercel
✅ Código en GitHub

---

## Estadísticas de la Semana 2:

| Métrica | Valor |
|---------|-------|
| **Días de trabajo** | 5 |
| **Horas invertidas** | ~8.5 horas |
| **Componentes creados** | 5 (Header, Footer, BenefitCard, WaitlistForm, Counter) |
| **Archivos CSS Modules** | 5 |
| **Líneas de código** | ~400 |
| **Commits** | 1 (por ahora) |
| **Conceptos aprendidos** | 10+ |

---

## Conceptos dominados:

### React Fundamentals:
✅ Componentes funcionales
✅ JSX
✅ Props (pasar datos)
✅ useState (estado)
✅ Eventos (onClick, onChange, onSubmit)
✅ Renderizado condicional
✅ Controlled inputs
✅ CSS Modules

### Herramientas:
✅ create-react-app
✅ npm start
✅ Hot reload
✅ React DevTools (básico)

### Buenas prácticas:
✅ Separación de componentes
✅ Props con destructuring
✅ Nombres descriptivos
✅ Estilos modulares
✅ Estructura de carpetas organizada

---

## Comparación: Semana 1 vs Semana 2

### Semana 1 (HTML):
- 1 archivo HTML
- 1 archivo CSS
- 1 archivo JS
- ~250 líneas total
- Todo mezclado

### Semana 2 (React):
- 12 archivos organizados
- ~400 líneas (pero más mantenibles)
- Componentes reutilizables
- Arquitectura escalable

**Resultado:** Misma funcionalidad, mejor arquitectura.

---

## Lo más difícil de la semana:
- Entender el flujo de datos (props vs state)
- Recordar usar `set` para cambiar el estado
- No mutar arrays directamente
- Sintaxis de CSS Modules

## Lo más satisfactorio:
- Ver el formulario funcionando con useState
- Eliminar todos los estilos inline
- El efecto hover en las tarjetas
- Deploy automático funcionando

---

## Errores que cometí y aprendí:

1. **Intentar modificar props** 
   - Props son read-only
   - Solución: Usar estado si necesito cambiar algo

2. **Mutar el estado directamente**
```jsx
   // ❌ MAL
   emails.push(newEmail);
   
   // ✅ BIEN
   setEmails([...emails, newEmail]);
```

3. **Olvidar preventDefault**
   - El formulario recargaba la página
   - Solución: `e.preventDefault()` siempre en onSubmit

4. **Estilos inline desorganizados**
   - Difíciles de mantener
   - Solución: CSS Modules

---

## Próximos pasos (Semana 3):

**Objetivo:** Conectar React con Supabase

**Temas:**
- Crear proyecto en Supabase
- Diseñar schema de base de datos
- Integrar Supabase con React
- Guardar emails reales en DB (no localStorage)
- Autenticación básica (si da el tiempo)

**Resultado esperado:**
Landing funcional + Base de datos real

---

## Reflexión personal:

### ¿Cómo me siento después de Semana 2?

[Escribí aquí tu reflexión]

### ¿Qué fue lo que más me gustó de React?

[Escribí aquí]

### ¿Sigo motivado para Semana 3?

[1-10 y por qué]

---

## 🏆 Logros desbloqueados:

✅ Primera app en React deployada
✅ Dominio de componentes y props
✅ Manejo de estado con useState
✅ CSS Modules implementados
✅ Git workflow establecido
✅ Portfolio público en crecimiento

---
### Mejora adicional - Validación de email con regex

**Problema detectado:**
La validación `email.includes('@')` aceptaba `test@test` como válido.

**Solución implementada:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  // Email inválido
}
```

**Qué valida:**
- ✅ Debe tener texto antes del @
- ✅ Debe tener @ exactamente una vez
- ✅ Debe tener dominio después del @
- ✅ Debe tener punto en el dominio
- ✅ Debe tener extensión después del punto
- ❌ No puede tener espacios

**Casos de prueba:**
- `test@test` → ❌ Rechazado
- `test@test.com` → ✅ Aceptado

---

## ✅ Lunes completado

### Tabla creada:
```sql
waitlist (
  id BIGINT PRIMARY KEY,
  created_at TIMESTAMPTZ,
  email TEXT UNIQUE
)
```

### Datos de prueba insertados:
- test@gmail.com
- juan@electricista.com  
- maria@electronica.com.ar

### Restricción UNIQUE verificada:
✅ Intento de duplicado fue rechazado por la base de datos

### Credenciales obtenidas:
- ✅ Project URL guardada
- ✅ Anon Key guardada
- ✅ Archivo `CREDENCIALES-SUPABASE.txt` creado

### Estado del proyecto:
Base de datos lista y con datos de prueba.
Próximo paso: Conectar con React.

---

## Próxima sesión: Martes
Tema: Instalar Supabase en React y hacer primera query
```

---

## ✅ CHECKLIST FINAL DEL LUNES

- [ ] Cuenta en Supabase creada
- [ ] Proyecto `ElectroApp` creado
- [ ] Tabla `waitlist` creada con 3 columnas
- [ ] 3 emails de prueba insertados
- [ ] Restricción UNIQUE probada y funcionando
- [ ] Project URL copiada
- [ ] Anon Key copiada
- [ ] Archivo `CREDENCIALES-SUPABASE.txt` creado
- [ ] `aprendizaje-supabase.md` actualizado

---

## 🎊 LUNES SEMANA 3 COMPLETADO
```
╔════════════════════════════════════════════════╗
║                                                ║
║     ✅ LUNES SEMANA 3 COMPLETADO ✅            ║
║                                                ║
║  Base de datos PostgreSQL en la nube:         ║
║  ✓ Proyecto creado en Supabase                ║
║  ✓ Tabla waitlist con 3 emails                ║
║  ✓ Restricción UNIQUE funcionando             ║
║  ✓ Credenciales guardadas                     ║
║                                                ║
║  Mañana: Conectar React con Supabase          ║
║                                                ║
╚════════════════════════════════════════════════╝

---

## Día 3 - Miércoles

### Fecha: [HOY]
### Tiempo invertido: ~2 horas

---

## Lo que hice hoy:

### 1. Modifiqué WaitlistForm para usar Supabase

**Antes (localStorage):**
```javascript
localStorage.setItem('email_' + Date.now(), email);
```

**Después (Supabase):**
```javascript
const { data, error } = await supabase
  .from('waitlist')
  .insert([{ email: email }]);
```

### 2. Implementé contador desde Supabase
```javascript
const { count } = await supabase
  .from('waitlist')
  .select('*', { count: 'exact', head: true });
```

### 3. Validación automática de duplicados
Supabase rechaza duplicados automáticamente (error code `23505`).
Ya no necesito validar manualmente en React.

### 4. Estado de loading
Botón muestra "Enviando..." mientras guarda en la base de datos.

---

## Queries aprendidas:

### INSERT (crear registro)
```javascript
const { data, error } = await supabase
  .from('tabla')
  .insert([{ columna: valor }])
  .select();  // ← Devuelve el registro creado
```

### COUNT (contar registros)
```javascript
const { count, error } = await supabase
  .from('tabla')
  .select('*', { count: 'exact', head: true });
// head: true = solo el count, no los datos
```

---

## Manejo de errores de Supabase:

| Error Code | Significado | Cómo manejarlo |
|------------|-------------|----------------|
| `23505` | Duplicate key (UNIQUE violation) | Mostrar "Email ya existe" |
| `42P01` | Table doesn't exist | Verificar nombre de tabla |
| `PGRST116` | No rows returned | Normal cuando no hay datos |

---

## Flujo completo del formulario:
```
1. Usuario escribe email
2. React valida formato (regex)
3. Submit → setLoading(true)
4. Supabase.insert()
5. Supabase valida duplicados
6. Si OK: guarda en PostgreSQL
7. React recibe respuesta
8. Actualiza UI (contador + mensaje)
9. Limpia input
```

---

## Diferencias clave:

### localStorage (Semana 2):
- Validación manual de duplicados
- Datos solo locales
- Sincronización manual del contador

### Supabase (Semana 3):
- Validación automática (constraint UNIQUE)
- Datos en la nube
- Contador sincronizado con DB real

---

## Archivos modificados hoy:

- ✅ `src/WaitlistForm.js` (migrado a Supabase)
- ✅ `src/App.js` (removido TestSupabase)
- ❌ `src/TestSupabase.js` (borrado)

---

## Testing realizado:

✅ Email nuevo se guarda correctamente
✅ Duplicados son rechazados
✅ Contador se actualiza en tiempo real
✅ Estado loading funciona
✅ Validación de formato sigue funcionando
✅ Datos persisten en Supabase

---

## Próxima sesión: Jueves
Tema: Dashboard para ver todos los emails + Exportar a CSV