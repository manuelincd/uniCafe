# CaféUni

CaféUni es una aplicación web progresiva (PWA) desarrollada como 
proyecto final universitario. Permite a los estudiantes consultar 
el menú de la cafetería, realizar pedidos personalizados y elegir 
un horario de recolección, con el objetivo de reducir tiempos de 
espera y mejorar la experiencia del servicio en horarios de alta 
demanda.

La aplicación incorpora elementos de gamificación como un sistema 
de puntos, niveles y logros, diseñados para motivar el uso 
frecuente y fomentar la anticipación en los pedidos.

---

## Información del proyecto

- **Materia:** Diseño y Evaluación de Interfaces de Usuario
- **Profesor:** Pedro César Santana Mancilla
- **Integrantes:**
  - Manuel Emiliano Castillo Díaz
  - Ian Ramsés Martínez Gutiérrez
  - Juan Pablo Vázquez Lara Herrera
  - Carlos Gael Campos Aguirre

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | Interfaz de usuario |
| Vite | 5 | Herramienta de desarrollo y construcción |
| TailwindCSS | 3 | Estilos y diseño visual |
| React Router | 6 | Navegación entre pantallas |
| Zustand | 4 | Manejo del estado global |

---

## Instalación y ejecución

Sigue estos pasos para ejecutar el proyecto en tu computadora:

**1. Clona el repositorio**
git clone https://github.com/manuelincd/uniCafe 

**2. Instala las dependencias**
npm install

**3. Inicia el servidor de desarrollo**
npm run dev

**4. Abre la app en tu navegador**
http://localhost:5173

Para generar la versión de producción:
npm run build

---

## Prototipo funcional

Puedes acceder a la versión publicada de la aplicación en el 
siguiente enlace:

🔗 https://uni-cafe-psi.vercel.app/ 

Para instalarla en tu celular como app:
1. Abre el enlace desde el navegador de tu dispositivo móvil
2. Toca el botón "Agregar a pantalla de inicio" o el ícono 
   de compartir en Safari/Chrome
3. Acepta la instalación

---

## Funcionalidades implementadas

- **Consulta del menú:** El usuario puede explorar los productos 
  organizados en 7 categorías definidas a partir de un ejercicio 
  de card sorting realizado con usuarios potenciales.

- **Creación de pedido:** El usuario puede agregar uno o varios 
  productos al carrito, visualizar cantidades, precios individuales 
  y el total estimado.

- **Personalización de productos:** Cada producto ofrece opciones 
  de personalización como quitar ingredientes o agregar extras, 
  con ajuste automático al precio.

- **Selección de horario:** El usuario elige un horario de 
  recolección entre los disponibles. Los horarios saturados se 
  bloquean automáticamente para garantizar que la cafetería pueda 
  cumplir con la demanda.

- **Confirmación del pedido:** Antes de enviar, el usuario revisa 
  un resumen completo con productos, personalizaciones, horario 
  y total.

- **Historial de pedidos:** La app muestra los pedidos activos 
  y el historial anterior, con opción de cancelar pedidos activos 
  y repetir compras anteriores.

- **Gamificación:** La app incluye un sistema de puntos y niveles 
  (Casual, Habitual, Cafetero VIP), insignias desbloqueables y 
  bonificaciones por pedir con anticipación, con el objetivo de 
  motivar el uso frecuente y mejorar la organización del servicio.

---

## Decisiones de diseño

La organización del menú se definió a partir de un ejercicio de 
card sorting realizado con usuarios potenciales, lo que permitió 
identificar cómo los estudiantes agrupan naturalmente los 
productos de la cafetería.

El diseño de la interfaz sigue principios de diseño móvil 
reconocidos, priorizando la claridad visual, la retroalimentación 
inmediata al usuario y una navegación intuitiva adaptada a 
dispositivos móviles.

Los elementos de gamificación se integraron con una intención 
clara: el sistema de puntos recompensa pedir con anticipación, 
las insignias motivan explorar el menú completo y mantener una 
racha de uso, y los niveles generan un sentido de progresión que 
fomenta el regreso a la aplicación.

---

## Uso de inteligencia artificial

Durante el desarrollo de este proyecto se utilizaron las 
siguientes herramientas de inteligencia artificial:

### Claude (Anthropic)
- **Tareas:** Planificación del proyecto, definición de la 
  arquitectura de la aplicación, generación del código fuente 
  completo, redacción del README y apoyo en decisiones de diseño.
- **Partes apoyadas por IA:** Estructura de carpetas, stores de 
  Zustand, lógica de gamificación, lógica de horarios, todas 
  las páginas y componentes de la aplicación.
- **Validación del equipo:** El equipo revisó el código generado, 
  lo probó en entorno local, corrigió errores de integración y 
  ajustó detalles visuales para que coincidieran con los mockups 
  definidos previamente.
- **Enlace a la conversación:** [Chat con Claude](https://claude.ai/share/a58d2cbc-bad3-4c0d-b934-3483f93202b1)

### ChatGPT (OpenAI)
- **Tareas:** Generación de mockups visuales de las pantallas 
  de la aplicación.
- **Partes apoyadas por IA:** Diseño visual de referencia para 
  las 8 pantallas principales de la app.
- **Validación del equipo:** Los mockups fueron revisados por el 
  equipo, se identificaron ajustes necesarios (eliminación de 
  referencias a envío, cambio de nombres de niveles de usuario) 
  y se usaron únicamente como guía visual de referencia para 
  el desarrollo.
- **Enlace a la conversación:** [Chat con ChatGPT](https://chatgpt.com/share/6a135c4d-fb78-83e8-a043-6b0c596e3109)

El uso de inteligencia artificial fue supervisado en todo momento 
por el equipo. Todo el código entregado fue revisado, probado y 
ajustado por los integrantes, quienes son responsables del 
funcionamiento correcto de la aplicación.

---