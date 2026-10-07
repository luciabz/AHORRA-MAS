<div align="center">

# 💰 AHORRA-MAS

**App full stack para organizar ingresos y gastos, y planificar metas de ahorro.**

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)

</div>

## 📸 Vista previa

<!-- Reemplazá estas rutas por capturas reales del proyecto (por ejemplo, en una carpeta /screenshots) -->
<p align="center">
 <img width="789" height="597" alt="finanzas" src="https://github.com/user-attachments/assets/2627cfc7-c55e-47f8-bf44-74e7a50732b2" />

  
</p>

## 💡 La idea

Quería una herramienta para ordenar mi propia plata: saber cuánto entra, cuánto sale, cuánto sobra y cuánto puedo ahorrar. AHORRA-MAS sirve tanto para alguien con un sueldo fijo como para quien tiene ingresos variables durante la semana: registrás todo, lo separás por categorías y ves de forma gráfica cuánto tiempo te llevaría llegar a cada meta.

Empezó como trabajo integrador de la materia Paradigmas de Programación, pero la diseñé y la programé sola, frontend y backend, pensando en usarla yo.

## ✨ Funcionalidades

- 📊 **Dashboard general** con ingresos, gastos, sobrantes y ahorros.
- 🧾 **Registro de ingresos y gastos** organizados por categorías.
- 🎯 **Metas de ahorro**: distribuís lo que sobra y ves gráficamente cuánto tiempo te llevaría alcanzarlas.
- 🔐 **Cuentas de usuario** con login y rutas protegidas.

## 🏗️ Arquitectura

```
AHORRA-MAS/
├── ahorraMas/   # Frontend: React + Vite
└── api/         # Backend: API REST en TypeScript
```

**Frontend**
- React con Vite y React Router
- Redux Toolkit para el estado global
- Recharts para los gráficos
- Tailwind CSS para los estilos
- Axios para consumir la API

**Backend**
- API REST con Express y TypeScript
- TypeORM + PostgreSQL
- Autenticación con JWT y contraseñas encriptadas con argon2
- Validación de datos con express-validator
- Seguridad de cabeceras HTTP con helmet
- Logs con winston y morgan

## 🚀 Cómo correrlo

**1. API**
```bash
cd api
npm install
# Creá un archivo .env con los datos de conexión a PostgreSQL y la clave para JWT
npm run dev
```

**2. Frontend**
```bash
cd ahorraMas
npm install
npm run dev
```

Después abrí `http://localhost:5173` en el navegador.

## 📌 Estado

La app estuvo desplegada en AWS. Hoy la demo está fuera de línea, pero el código está completo y se puede correr de forma local.

---

<div align="center">

Hecho con 💗 por [Lucía Benítez](https://www.linkedin.com/in/lucia-b-324a4927a)

</div>
