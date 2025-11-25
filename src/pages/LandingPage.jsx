import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from '../img/Dr-Victor.jpg';

const colors = {
  primary: '#457B9D',      // azul para acentos y títulos
  secondary: '#F4A261',    // naranja pastel para botones y resaltados
  accent: '#E76F51',       // rojo pastel para detalles
  dark: '#1D3557',         // azul oscuro para textos principales
  darkLight: '#2A4D69',    // azul medio para párrafos y subtítulos
  light: '#F1FAEE',        // fondo claro pastel
  white: '#FFFFFF',         // blanco
  gradient1: 'linear-gradient(135deg, #A8DADC 0%, #457B9D 100%)',
  gradient2: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
  gradient3: 'linear-gradient(135deg, #FFE5D9 0%, #FAD2E1 100%)',
};

const LandingPage = () => {
  const [activeService, setActiveService] = useState(0);
  const navigate = useNavigate();

  const services = [
    {
      title: "Psiquiatría para Adultos",
      description: "Tratamiento integral para depresión, ansiedad, trastornos del ánimo y otras condiciones de salud mental.",
      icon: "👤"
    },
    {
      title: "Alta Especialidad en Género",
      description: "Atención especializada para personas transgénero y no binarias, acompañamiento en procesos de transición y salud mental relacionada con identidad de género.",
      icon: "🏳️‍⚧️"
    },
    {
      title: "Atención a Víctimas de Violencia",
      description: "Tratamiento especializado en trauma, trastorno por estrés postraumático (TEPT) y recuperación de experiencias de violencia.",
      icon: "🛡️"
    },
    {
      title: "Psicoterapia Psicoanalítica",
      description: "Terapia profunda para comprender y transformar patrones inconscientes, fortalecer la identidad y mejorar las relaciones interpersonales.",
      icon: "💭"
    },
    {
      title: "Salud Reproductiva",
      description: "Apoyo en salud mental durante embarazo, posparto, pérdidas gestacionales y decisiones reproductivas.",
      icon: "🤰"
    }
  ];

  const stats = [
    { number: "10+", label: "Años de Experiencia" },
    { number: "500+", label: "Pacientes Atendidos" },
    { number: "100%", label: "Confidencialidad" },
    { number: "24/7", label: "Disponibilidad Online" }
  ];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: colors.dark }}>
      <header style={{
        background: colors.white,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', background: colors.gradient1, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Dr. Víctor Rodríguez
          </div>
          <nav style={{ display: 'flex', gap: '30px' }}>
            <a href="#servicios" style={{ color: colors.dark, textDecoration: 'none', fontWeight: '500' }}>Servicios</a>
            <a href="#sobre-mi" style={{ color: colors.dark, textDecoration: 'none', fontWeight: '500' }}>Sobre Mí</a>
            <a href="#contacto" style={{ color: colors.dark, textDecoration: 'none', fontWeight: '500' }}>Contacto</a>
          </nav>
        </div>
      </header>

      <section style={{
        background: colors.gradient1,
        padding: '100px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ color: colors.white, zIndex: 2 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '8px 20px',
              borderRadius: '30px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🏆 Certificado por el Consejo Mexicano de Psiquiatría
            </div>
            <h1 style={{ fontSize: '52px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>
              Tu Salud Mental Merece Atención Especializada
            </h1>
            <p style={{ fontSize: '20px', marginBottom: '30px', lineHeight: '1.6', opacity: 0.95 }}>
              DR. VÍCTOR ISRAEL RODRÍGUEZ GONZÁLEZ<br />
              <span style={{ fontSize: '18px' }}>Psiquiatra y Psicoterapeuta</span>
            </p>
            <p style={{ fontSize: '18px', marginBottom: '40px', lineHeight: '1.7', opacity: 0.9 }}>
              Especialista en atención de género, trauma, violencia y psicoterapia psicoanalítica.
              Ofrezco un espacio seguro, confidencial y profesional para tu bienestar emocional.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button
                onClick={() => navigate('/medical-form')}
                style={{
                  background: colors.white,
                  color: colors.primary,
                  border: 'none',
                  padding: '18px 40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Agendar Cita Ahora
              </button>
              <button
                onClick={() => document.getElementById('sobre-mi').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'transparent',
                  color: colors.white,
                  border: '2px solid white',
                  padding: '18px 40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = colors.white;
                  e.target.style.color = colors.primary;
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = colors.white;
                }}
              >
                Conocer Más
              </button>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              padding: '40px',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <img
                src={doctorImage}
                alt="Consultorio"
                style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              />
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', background: colors.gradient2, borderRadius: '50%', opacity: 0.1, filter: 'blur(80px)' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '250px', height: '250px', background: colors.gradient3, borderRadius: '50%', opacity: 0.1, filter: 'blur(80px)' }}></div>
      </section>

      <section style={{ background: colors.white, padding: '60px 20px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '30px',
            background: colors.white,
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '800', background: colors.gradient1, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '16px', color: colors.darkLight, fontWeight: '600' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="servicios" style={{ background: colors.light, padding: '100px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px' }}>
              Especialidades y Servicios
            </h2>
            <p style={{ fontSize: '20px', color: colors.darkLight, maxWidth: '700px', margin: '0 auto' }}>
              Atención integral y especializada para diversas necesidades de salud mental
            </p>
          </div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
  {services.map((service, index) => (
    <div
      key={index}
      style={{
        background: colors.white,
        color: colors.dark,
        padding: '40px',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = colors.gradient1;
        e.currentTarget.style.color = colors.white;
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(124, 58, 237, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = colors.white;
        e.currentTarget.style.color = colors.dark;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>{service.icon}</div>
      <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>
        {service.title}
      </h3>
      <p style={{ fontSize: '16px', lineHeight: '1.7', opacity: 0.85 }}>
        {service.description}
      </p>
    </div>
  ))}
</div>

        </div>
      </section>

      <section id="sobre-mi" style={{ background: colors.white, padding: '100px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <img
              src={doctorImage}
              alt="Dr. Víctor Rodríguez"
              style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            />
          </div>
          <div>
            <div style={{
              display: 'inline-block',
              background: colors.gradient1,
              color: colors.white,
              padding: '8px 20px',
              borderRadius: '30px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Sobre Mí
            </div>
            <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '30px', lineHeight: '1.2' }}>
              Dr. Víctor Israel Rodríguez González
            </h2>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: colors.primary, marginBottom: '20px' }}>
              Psiquiatra y Psicoterapeuta Certificado
            </h3>
            <div style={{ fontSize: '18px', lineHeight: '1.8', color: colors.darkLight, marginBottom: '30px' }}>
              <p style={{ marginBottom: '20px' }}>
                Médico especialista en Psiquiatría con Alta Especialidad en Género y Atención a Personas Víctimas de Violencia y Trauma, incluyendo Trastorno por Estrés Postraumático (TEPT).
              </p>
              <p style={{ marginBottom: '20px' }}>
                Mi formación incluye Psicoterapia Psicoanalítica, lo que me permite ofrecer un abordaje integral y profundo de los problemas de salud mental.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Estoy certificado por el Consejo Mexicano de Psiquiatría, garantizando los más altos estándares de calidad en mi práctica profesional.
              </p>
              <p>
                Mi objetivo es proporcionar un espacio seguro, confidencial y libre de juicios donde puedas trabajar en tu bienestar emocional y mental.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {['Certificación CMP', 'Alta Especialidad', 'Psicoanálisis', 'Trauma y Violencia', 'Género'].map((badge, index) => (
                <span key={index} style={{
                  background: colors.light,
                  color: colors.primary,
                  padding: '10px 20px',
                  borderRadius: '30px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: colors.gradient1, padding: '100px 20px', color: colors.white }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px' }}>
              ¿Por Qué Elegir Mi Consulta?
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.7', opacity: 0.95, color: colors.white }}>              Un enfoque profesional, empático y basado en evidencia científica
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {[
              {
                icon: '🎯',
                title: 'Atención Especializada',
                description: 'Alta especialidad en áreas específicas que requieren conocimiento profundo y actualizado'
              },
              {
                icon: '🤝',
                title: 'Espacio Seguro',
                description: 'Ambiente confidencial, libre de juicios y respetuoso de tu identidad y experiencias'
              },
              {
                icon: '🔬',
                title: 'Basado en Evidencia',
                description: 'Tratamientos respaldados por investigación científica y mejores prácticas clínicas'
              },
              {
                icon: '💜',
                title: 'Enfoque Integral',
                description: 'Combinación de psiquiatría y psicoterapia para un abordaje completo'
              },
              {
                icon: '⏰',
                title: 'Flexibilidad',
                description: 'Consultas presenciales y en línea adaptadas a tus necesidades y horarios'
              },
              {
                icon: '📋',
                title: 'Seguimiento Continuo',
                description: 'Acompañamiento constante en tu proceso de recuperación y bienestar'
              }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '40px',
                borderRadius: '20px',
                border: '2px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '16px', lineHeight: '1.7', opacity: 0.9 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" style={{ background: colors.white, padding: '100px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '30px' }}>
            Da el Primer Paso Hacia tu Bienestar
          </h2>
          <p style={{ fontSize: '20px', color: colors.darkLight, marginBottom: '40px', lineHeight: '1.7' }}>
            Agenda tu cita de manera fácil y rápida. Tu salud mental es prioridad,
            y estoy aquí para acompañarte en cada paso del camino.
          </p>
          <button
            onClick={() => navigate('/medical-form')}
            style={{
              background: colors.gradient1,
              color: colors.white,
              border: 'none',
              padding: '20px 50px',
              fontSize: '20px',
              fontWeight: '700',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 15px 40px rgba(124, 58, 237, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 20px 50px rgba(124, 58, 237, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 15px 40px rgba(124, 58, 237, 0.3)';
            }}
          >
            Agendar Mi Cita Ahora →
          </button>
          <p style={{ marginTop: '30px', color: colors.darkLight, fontSize: '16px' }}>
            📞 Llamar al consultorio | 💬 WhatsApp | 📧 Enviar email
          </p>
        </div>
      </section>

      <footer style={{ background: colors.dark, color: colors.white, padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Dr. Víctor Rodríguez</h3>
              <p style={{ opacity: 0.8, lineHeight: '1.7' }}>
                Psiquiatra y Psicoterapeuta certificado, especializado en género, trauma y psicoanálisis.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Enlaces Rápidos</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="#servicios" style={{ color: colors.white, opacity: 0.8, textDecoration: 'none' }}>Servicios</a>
                <a href="#sobre-mi" style={{ color: colors.white, opacity: 0.8, textDecoration: 'none' }}>Sobre Mí</a>
                <a href="#contacto" style={{ color: colors.white, opacity: 0.8, textDecoration: 'none' }}>Contacto</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Información</h4>
              <p style={{ opacity: 0.8, lineHeight: '1.7' }}>
                Certificado por el Consejo Mexicano de Psiquiatría<br />
                Consultas presenciales y en línea<br />
                Atención confidencial y profesional
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', textAlign: 'center', opacity: 0.6 }}>
            © {new Date().getFullYear()} Dr. Víctor Israel Rodríguez González. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;