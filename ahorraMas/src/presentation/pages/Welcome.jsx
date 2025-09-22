
import React from 'react';
import { useNavigate } from 'react-router-dom';

const carouselData = [
  {
    title: 'Visualiza tu balance',
    desc: 'Consulta tu balance mensual, ingresos, gastos y sobrante de forma clara y visual.',
    img: '/public/carrusel-balance.avif'
  },
  {
    title: 'Define metas de ahorro',
    desc: 'Establece objetivos y sigue tu progreso para lograr tus sueños financieros.',
    img: '/public/carrusel-metas.webp'
  },
  {
    title: 'Controla tus gastos',
    desc: 'Registra gastos fijos y variables, identifica oportunidades para ahorrar más.',
    img: '/public/carrusel-gastos.jpg'
  }
];

export default function Welcome() {
  const navigate = useNavigate();
  const [slide, setSlide] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setSlide(s => (s + 1) % carouselData.length), 3500);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setSlide((slide + 1) % carouselData.length);
  const prevSlide = () => setSlide((slide - 1 + carouselData.length) % carouselData.length);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-green-50">
      <nav className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-5 bg-white shadow-md gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <img src="/finanzas.png" alt="Logo Ahorra Más" className="w-12 h-12 md:w-16 md:h-16" />
          <span className="text-2xl sm:text-3xl font-extrabold text-green-900 tracking-wide">AHORRA MÁS</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button className="bg-green-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-800 transition w-full sm:w-auto" onClick={() => navigate('/login')}>Iniciar sesión</button>
          <button className="border-2 border-green-700 text-green-900 px-5 py-2 rounded-lg font-semibold hover:bg-green-700 hover:text-white transition w-full sm:w-auto" onClick={() => navigate('/register')}>Registrarse</button>
        </div>
      </nav>

  <section className="flex flex-col md:flex-row items-center  justify-center gap-8 md:gap-12 py-8 md:py-12 px-2 sm:px-4 md:px-0 bg-gradient-to-br from-green-50 to-gray-100 w-full">
        <div className="flex-1 m-6 flex flex-col  items-center md:items-start max-w-xl w-full">
          <h1 className="text-2xl xs:text-3xl  sm:text-4xl md:text-5xl font-bold text-green-900 mb-6 text-center md:text-left leading-tight">Gestiona tus <span className="text-green-700">finanzas personales</span> y ahorra fácil</h1>
          <p className="text-base sm:text-lg  text-green-900 mb-6 px-2 sm:px-0 text-center md:text-left">
            AHORRA MÁS es tu aliado para tomar el control de tus ingresos y gastos, visualizar tu progreso y alcanzar tus metas de ahorro.<br/>
            Registra tus ingresos, gastos fijos y variables, y descubre cómo puedes optimizar tu dinero cada mes.
          </p>
          <button className="bg-green-700 text-white px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg font-bold shadow hover:bg-green-800 transition mb-4 w-full sm:w-auto" onClick={() => navigate('/register')}>¡Comienza a ahorrar!</button>
        </div>
        <div className="flex-1 flex justify-center w-full ">
          <img src="/public/hero-finanzas.webp" alt="Finanzas personales" className="xs:w-64 xs:h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] xl:w-7xl xl:h-7xl object-contain drop-shadow-xl rounded-2xl" />
        </div>
      </section>

      <section className="flex flex-col items-center py-8 sm:py-10 bg-white w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900 mb-6 text-center">¿Qué puedes hacer con AHORRA MÁS?</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center">
          <button className="text-3xl text-green-400 hover:text-green-700 transition" onClick={prevSlide} aria-label="Anterior">&#8592;</button>
          <div className="flex flex-col items-center bg-green-50 rounded-2xl shadow-lg px-4 xs:px-8 sm:px-10 py-6 sm:py-8 min-w-[220px] xs:min-w-[280px] sm:min-w-3xlxl max-w-5xl w-full">
            <img src={carouselData[slide].img} alt={carouselData[slide].title} className="xs:w-32 xs:h-32 object-contain mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2 text-center">{carouselData[slide].title}</h3>
            <p className="text-green-900 text-base text-center">{carouselData[slide].desc}</p>
          </div>
          <button className="text-3xl text-green-400 hover:text-green-700 transition" onClick={nextSlide} aria-label="Siguiente">&#8594;</button>
        </div>
        <div className="flex gap-2 mt-4">
          {carouselData.map((_, idx) => (
            <span key={idx} className={`w-3 h-3 rounded-full ${slide === idx ? 'bg-green-700' : 'bg-green-200'} cursor-pointer`} onClick={() => setSlide(idx)}></span>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center py-8 sm:py-10 bg-gradient-to-br from-green-50 to-gray-100 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900 mb-4 text-center">Beneficios</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-green-900 text-base sm:text-lg max-w-2xl w-full px-2">
          <li className="flex items-center gap-2"><span className="text-green-600 text-2xl">✔</span> Visualiza tu balance mensual y sobrante</li>
          <li className="flex items-center gap-2"><span className="text-green-600 text-2xl">✔</span> Lleva registro de tus gastos fijos y variables</li>
          <li className="flex items-center gap-2"><span className="text-green-600 text-2xl">✔</span> Define metas de ahorro y sigue tu progreso</li>
          <li className="flex items-center gap-2"><span className="text-green-600 text-2xl">✔</span> Accede desde cualquier dispositivo</li>
        </ul>
      </section>

      
      <footer className="text-center text-green-900 py-6 bg-white border-t border-green-100 flex flex-col items-center gap-2 w-full">
        <span className="font-semibold">Creado por Lucía Benítez © 2025</span>
      </footer>
    </div>
  );
}
