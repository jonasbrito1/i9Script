import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showAllTech, setShowAllTech] = useState(false);

  const projects = [
    {
      title: 'Sistema Hospitalar',
      description: 'Gestão completa de prontuários eletrônicos com integração de exames e laudos médicos em tempo real',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Socket.IO'],
      icon: '🏥',
      status: 'Concluído',
      path: '/projects/sistema%20hospitalar/index.html'
    },
    {
      title: 'GarminTech E-commerce',
      description: 'Loja online premium de tecnologia GPS e smartwatches com sistema completo de carrinho e checkout',
      tags: ['Bootstrap', 'JavaScript', 'HTML5', 'CSS3'],
      icon: '🛒',
      status: 'Concluído',
      path: '/projects/ecommerce/index.html'
    },
    {
      title: 'Dashboard Analytics',
      description: 'Visualização de dados em tempo real com gráficos interativos e métricas de performance',
      tags: ['React', 'D3.js', 'WebSocket', 'Charts'],
      icon: '📊',
      status: 'Concluído',
      path: '/projects/Dashboard%20Analytics/index.html'
    },
    {
      title: 'EduSystem - Plataforma EAD',
      description: 'Sistema educacional completo com gestão de cursos, alunos, certificações e avaliações online',
      tags: ['React', 'Express', 'MySQL', 'AWS'],
      icon: '🎓',
      status: 'Concluído',
      path: '/projects/EduSystem/index.html'
    },
    {
      title: 'DeliveryAI - IA para Delivery',
      description: 'App de delivery inteligente com IA para otimização de rotas e previsão de demanda',
      tags: ['AI/ML', 'Node.js', 'Maps API', 'Analytics'],
      icon: '🏍️',
      status: 'Concluído',
      path: '/projects/deliveryAI/index.html'
    },
    {
      title: 'i9Vet - Petshop Online',
      description: 'Loja veterinária online com catálogo completo de produtos, carrinho e sistema de categorias',
      tags: ['JavaScript', 'Bootstrap', 'PWA', 'E-commerce'],
      icon: '🐾',
      status: 'Concluído',
      path: '/projects/petshop/index.html'
    },
    {
      title: 'Platform de Cursos Online',
      description: 'Marketplace de cursos com player de vídeo, avaliações, certificados e área do aluno',
      tags: ['React', 'Video.js', 'Stripe', 'Firebase'],
      icon: '📚',
      status: 'Concluído',
      path: '/projects/courses/index.html'
    }
  ];

  const services = [
    {
      icon: '💻',
      title: 'Desenvolvimento Web',
      description: 'Aplicações web modernas e responsivas com as melhores tecnologias do mercado',
      features: ['React / Next.js', 'Node.js / Express', 'TypeScript', 'API REST / GraphQL']
    },
    {
      icon: '📱',
      title: 'Aplicativos Mobile',
      description: 'Apps nativos e híbridos para iOS e Android com performance otimizada',
      features: ['React Native', 'Flutter', 'PWA', 'App Store / Play Store']
    },
    {
      icon: '🤖',
      title: 'Automação & IA',
      description: 'Automatize processos e integre inteligência artificial em seus sistemas',
      features: ['Bots & RPA', 'Machine Learning', 'Integração de APIs', 'Workflows']
    },
    {
      icon: '☁️',
      title: 'Cloud & DevOps',
      description: 'Infraestrutura escalável e deploy automatizado com as melhores práticas',
      features: ['AWS / Azure / GCP', 'Docker / Kubernetes', 'CI/CD', 'Monitoramento']
    }
  ];

  const techStack = [
    // Frontend
    { name: 'React', icon: '⚛️', color: '#61DAFB' },
    { name: 'Next.js', icon: '▲', color: '#000000' },
    { name: 'TypeScript', icon: '💙', color: '#3178C6' },
    { name: 'JavaScript', icon: '⚡', color: '#F7DF1E' },
    { name: 'HTML5', icon: '📄', color: '#E34F26' },
    { name: 'CSS3', icon: '🎨', color: '#1572B6' },
    { name: 'Tailwind', icon: '🌊', color: '#06B6D4' },
    { name: 'Bootstrap', icon: '🅱️', color: '#7952B3' },
    { name: 'Vue.js', icon: '💚', color: '#4FC08D' },
    { name: 'Angular', icon: '🔺', color: '#DD0031' },

    // Backend
    { name: 'Node.js', icon: '🟢', color: '#339933' },
    { name: 'Express', icon: '🚂', color: '#000000' },
    { name: 'Python', icon: '🐍', color: '#3776AB' },
    { name: 'Django', icon: '🎸', color: '#092E20' },
    { name: 'FastAPI', icon: '⚡', color: '#009688' },
    { name: 'PHP', icon: '🐘', color: '#777BB4' },
    { name: 'Laravel', icon: '🔴', color: '#FF2D20' },
    { name: 'NestJS', icon: '🔥', color: '#E0234E' },

    // Mobile
    { name: 'React Native', icon: '📱', color: '#61DAFB' },
    { name: 'Flutter', icon: '🦋', color: '#02569B' },
    { name: 'PWA', icon: '⚙️', color: '#5A0FC8' },

    // Database
    { name: 'MySQL', icon: '🐬', color: '#4479A1' },
    { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
    { name: 'MongoDB', icon: '🍃', color: '#47A248' },
    { name: 'Redis', icon: '💎', color: '#DC382D' },
    { name: 'Firebase', icon: '🔥', color: '#FFCA28' },
    { name: 'SQLite', icon: '💾', color: '#003B57' },

    // Cloud & DevOps
    { name: 'AWS', icon: '☁️', color: '#FF9900' },
    { name: 'Azure', icon: '☁️', color: '#0078D4' },
    { name: 'Google Cloud', icon: '☁️', color: '#4285F4' },
    { name: 'Docker', icon: '🐳', color: '#2496ED' },
    { name: 'Kubernetes', icon: '⎈', color: '#326CE5' },
    { name: 'Jenkins', icon: '👨‍🔧', color: '#D24939' },
    { name: 'GitHub Actions', icon: '⚙️', color: '#2088FF' },
    { name: 'Terraform', icon: '🏗️', color: '#7B42BC' },

    // AI & ML
    { name: 'TensorFlow', icon: '🧠', color: '#FF6F00' },
    { name: 'PyTorch', icon: '🔥', color: '#EE4C2C' },
    { name: 'OpenAI', icon: '🤖', color: '#412991' },
    { name: 'Scikit-learn', icon: '📊', color: '#F7931E' },

    // APIs & Integration
    { name: 'GraphQL', icon: '🔷', color: '#E10098' },
    { name: 'REST API', icon: '🔗', color: '#009688' },
    { name: 'WebSocket', icon: '🔌', color: '#010101' },
    { name: 'Socket.IO', icon: '⚡', color: '#010101' },
    { name: 'Stripe', icon: '💳', color: '#635BFF' },
    { name: 'Maps API', icon: '🗺️', color: '#4285F4' },

    // Tools & Others
    { name: 'Git', icon: '🌿', color: '#F05032' },
    { name: 'GitHub', icon: '🐙', color: '#181717' },
    { name: 'GitLab', icon: '🦊', color: '#FC6D26' },
    { name: 'Nginx', icon: '🟢', color: '#009639' },
    { name: 'Apache', icon: '🪶', color: '#D22128' },
    { name: 'Webpack', icon: '📦', color: '#8DD6F9' },
    { name: 'Vite', icon: '⚡', color: '#646CFF' },
    { name: 'Jest', icon: '🃏', color: '#C21325' },
    { name: 'Cypress', icon: '🌲', color: '#17202C' },

    // CMS & E-commerce
    { name: 'WordPress', icon: '📝', color: '#21759B' },
    { name: 'Shopify', icon: '🛍️', color: '#7AB55C' },
    { name: 'Magento', icon: '🛒', color: '#EE672F' },

    // Real-time & Video
    { name: 'Video.js', icon: '🎥', color: '#FF0000' },
    { name: 'WebRTC', icon: '📹', color: '#333333' },
    { name: 'FFmpeg', icon: '🎬', color: '#007808' }
  ];

  useEffect(() => {
    // Check cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setTimeout(() => setShowCookieBanner(true), 2000);
    }

    // Auto scroll projects
    const interval = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % projects.length);
    }, 5000);

    // Scroll listener for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll carousel when active project changes
  useEffect(() => {
    if (carouselRef.current) {
      const cards = carouselRef.current.children;
      if (cards[activeProject]) {
        const card = cards[activeProject] as HTMLElement;
        const cardWidth = card.offsetWidth;
        const gap = 32; // clamp gap, using max value
        const scrollPosition = activeProject * (cardWidth + gap);

        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [activeProject]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieBanner(false);
  };

  const openProjectDemo = (projectPath: string) => {
    window.open(projectPath, '_blank', 'noopener,noreferrer');
  };

  const goToPrevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToNextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const goToProject = (index: number) => {
    setActiveProject(index);
  };

  return (
    <div className="landing-page" data-theme={theme}>
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="logo-container" onClick={() => scrollToTop()}>
            <h1 className="logo">i9Script</h1>
            <p className="logo-subtitle">INNOVATION & TECHNOLOGY</p>
          </div>

          <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
            <a onClick={() => scrollToSection('services')}>Serviços</a>
            <a onClick={() => scrollToSection('projects')}>Projetos</a>
            <a onClick={() => scrollToSection('tech')}>Tecnologias</a>
            <a onClick={() => scrollToSection('mvv')}>Sobre</a>
            <a onClick={() => scrollToSection('contact')}>Contato</a>
            <button onClick={() => navigate('/login')} className="btn btn-nav">
              Acessar Sistema
            </button>
          </div>

          <div className="nav-controls">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
            <button
              className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Transformamos <span className="highlight">Ideias</span> em
              <span className="highlight"> Soluções Digitais</span>
            </h1>
            <p>
              Desenvolvimento de software, aplicativos e automações inteligentes
              com as tecnologias mais avançadas do mercado
            </p>
            <div className="cta-buttons">
              <button onClick={() => scrollToSection('contact')} className="btn btn-primary">
                <i className="fas fa-rocket"></i> Começar Projeto
              </button>
              <button onClick={() => scrollToSection('projects')} className="btn btn-secondary">
                <i className="fas fa-code"></i> Ver Portfólio
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-window">
              <div className="code-header">
                <div className="code-dot dot-red"></div>
                <div className="code-dot dot-yellow"></div>
                <div className="code-dot dot-green"></div>
              </div>
              <div className="code-content">
                <div className="code-line">
                  <span className="line-number">1</span>
                  <span className="code-text">
                    <span className="keyword">const</span> <span className="function">i9Script</span> = () =&gt; &#123;
                  </span>
                </div>
                <div className="code-line">
                  <span className="line-number">2</span>
                  <span className="code-text">
                    &nbsp;&nbsp;<span className="keyword">return</span> <span className="string">'Inovação'</span> + <span className="string">'Tecnologia'</span>;
                  </span>
                </div>
                <div className="code-line">
                  <span className="line-number">3</span>
                  <span className="code-text">&#125;;</span>
                </div>
                <div className="code-line">
                  <span className="line-number">4</span>
                  <span className="code-text"></span>
                </div>
                <div className="code-line">
                  <span className="line-number">5</span>
                  <span className="code-text">
                    <span className="comment">// Excelência em cada linha de código</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <h2>Nossos Serviços</h2>
            <p>Soluções completas para transformar seu negócio</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <div className="section-header">
            <h2>Projetos Desenvolvidos</h2>
            <p>Conheça alguns dos nossos cases de sucesso</p>
          </div>
          <div className="projects-carousel-container">
            <div className="projects-carousel" ref={carouselRef}>
              {projects.map((project, index) => (
                <div
                  key={index}
                  className={`project-card ${index === activeProject ? 'active' : ''}`}
                  onClick={() => goToProject(index)}
                >
                  <div className="project-image">
                    <span className="project-icon">{project.icon}</span>
                    <div className="project-overlay">
                      <button
                        className="btn btn-demo"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProjectDemo(project.path);
                        }}
                      >
                        <i className="fas fa-external-link-alt"></i> Ver Demo
                      </button>
                    </div>
                  </div>
                  <div className="project-content">
                    <div className="project-header">
                      <h3>{project.title}</h3>
                      <span className={`project-status ${project.status === 'Concluído' ? 'completed' : 'development'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                    <button
                      className="btn btn-view-project"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectDemo(project.path);
                      }}
                    >
                      <i className="fas fa-arrow-right"></i> Visualizar Projeto
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-nav">
              <button
                className="carousel-btn"
                onClick={goToPrevProject}
                aria-label="Previous project"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="carousel-indicators">
                {projects.map((_, index) => (
                  <div
                    key={index}
                    className={`carousel-indicator ${index === activeProject ? 'active' : ''}`}
                    onClick={() => goToProject(index)}
                  ></div>
                ))}
              </div>
              <button
                className="carousel-btn"
                onClick={goToNextProject}
                aria-label="Next project"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="tech">
        <div className="container">
          <div className="section-header">
            <h2>Stack Tecnológica</h2>
            <p>Utilizamos as melhores ferramentas e tecnologias</p>
          </div>
          <div className={`tech-grid ${showAllTech ? 'expanded' : 'collapsed'}`}>
            {techStack.slice(0, showAllTech ? techStack.length : 20).map((tech, index) => (
              <div key={index} className="tech-item">
                <div className="tech-icon" style={{ color: tech.color }}>
                  {tech.icon}
                </div>
                <div className="tech-name">{tech.name}</div>
              </div>
            ))}
          </div>
          <div className="tech-toggle-container">
            <button
              className="btn btn-secondary btn-toggle-tech"
              onClick={() => setShowAllTech(!showAllTech)}
            >
              <i className={`fas fa-chevron-${showAllTech ? 'up' : 'down'}`}></i>
              {showAllTech ? 'Ver Menos' : `Ver Mais (${techStack.length - 20}+)`}
            </button>
          </div>
        </div>
      </section>

      {/* MVV Section */}
      <section id="mvv" className="mvv-section">
        <div className="container">
          <div className="section-header">
            <h2>Missão, Visão e Valores</h2>
            <p>O que nos move e nos diferencia</p>
          </div>
          <div className="mvv-container">
            <div className="mvv-card">
              <div className="mvv-icon">🎯</div>
              <h3>Missão</h3>
              <p>
                Desenvolver soluções tecnológicas inovadoras que otimizem processos
                e gerem valor real para nossos clientes, utilizando as melhores
                práticas e tecnologias do mercado.
              </p>
            </div>
            <div className="mvv-card">
              <div className="mvv-icon">🔭</div>
              <h3>Visão</h3>
              <p>
                Ser referência em desenvolvimento de software na região amazônica,
                reconhecida pela qualidade técnica, inovação e resultados
                mensuráveis entregues aos clientes.
              </p>
            </div>
            <div className="mvv-card">
              <div className="mvv-icon">💎</div>
              <h3>Valores</h3>
              <ul>
                <li><strong>Excelência Técnica:</strong> Código limpo e bem documentado</li>
                <li><strong>Transparência:</strong> Comunicação clara e honesta</li>
                <li><strong>Inovação:</strong> Sempre buscando as melhores soluções</li>
                <li><strong>Resultados:</strong> Focados em entregas que geram valor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Entre em Contato</h2>
            <p>Vamos transformar sua ideia em realidade</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Fale Conosco</h3>
              <p>
                Estamos prontos para ouvir suas ideias e desenvolver a solução
                perfeita para seu negócio.
              </p>
              <ul className="contact-methods">
                <li>
                  <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                  <span>contato@i9script.com</span>
                </li>
                <li>
                  <div className="contact-icon"><i className="fas fa-phone"></i></div>
                  <span>(92) 99999-9999</span>
                </li>
                <li>
                  <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <span>Manaus - Amazonas</span>
                </li>
              </ul>
            </div>
            <div className="contact-form">
              <form onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada! Entraremos em contato em breve.'); }}>
                <div className="form-group">
                  <label htmlFor="name">Nome *</label>
                  <input type="text" id="name" placeholder="Seu nome completo" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail *</label>
                  <input type="email" id="email" placeholder="seu@email.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input type="tel" id="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="form-group">
                  <label htmlFor="service">Serviço de Interesse</label>
                  <select id="service">
                    <option value="">Selecione um serviço</option>
                    <option value="web">Desenvolvimento Web</option>
                    <option value="mobile">Aplicativo Mobile</option>
                    <option value="automation">Automação</option>
                    <option value="cloud">Cloud & DevOps</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensagem *</label>
                  <textarea id="message" rows={5} placeholder="Conte-nos sobre seu projeto..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary full-width">
                  <i className="fas fa-paper-plane"></i> Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="logo">i9Script</h3>
              <p className="footer-tagline">Inovação & Tecnologia</p>
              <p className="footer-location">Manaus - Amazonas, Brasil</p>
            </div>
            <div className="social-links">
              <a href="mailto:contato@i9script.com" className="social-link email" aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
              <a href="https://wa.me/5592999999999" className="social-link whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://instagram.com/i9script" className="social-link instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com/company/i9script" className="social-link linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://github.com/i9script" className="social-link github" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 i9Script. Todos os direitos reservados.</p>
            <div className="footer-links">
              <a href="/governanca">Governança</a>
              <a href="/governanca/privacidade/politica_privacidade.html">Privacidade</a>
              <a href="/governanca/compliance">Compliance</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="cookie-banner show">
          <div className="cookie-content">
            <div className="cookie-text">
              <p>
                🍪 Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{' '}
                <a href="/governanca/privacidade/politica_privacidade.html">Política de Privacidade</a>.
              </p>
            </div>
            <div className="cookie-buttons">
              <button className="cookie-btn cookie-btn-accept" onClick={acceptCookies}>
                Aceitar
              </button>
              <button className="cookie-btn cookie-btn-decline" onClick={() => setShowCookieBanner(false)}>
                Recusar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      {/* Font Awesome Icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default LandingPage;
