// ==========================================
// SMOOTH SCROLLING & NAVIGATION
// ==========================================

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ==========================================
// TYPING ANIMATION
// ==========================================

const typingTexts = [
    '"Software Engineer"',
    '"Security Specialist"',
    '"Cybersecurity Expert"',
    '"DevSecOps Engineer"'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

const typingElement = document.querySelector('.typing-text');

function typeText() {
    if (!typingElement) return;

    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 500; // Pause before typing next text
    }

    setTimeout(typeText, typingSpeed);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000);
});

// ==========================================
// SCROLL ANIMATIONS (AOS - Animate On Scroll)
// ==========================================

function initAOS() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

// Initialize AOS on page load
document.addEventListener('DOMContentLoaded', initAOS);

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// CONTACT FORM HANDLING
// ==========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Here you can add your form submission logic
        // For now, we'll show a success message

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');

            // Reset form
            contactForm.reset();
        } catch (error) {
            showNotification('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
        }
    });
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 2rem;
            background: var(--color-bg-card);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: 1rem 1.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .notification-success {
            border-left: 4px solid var(--color-green-primary);
        }

        .notification-error {
            border-left: 4px solid #ff5f56;
        }

        .notification-icon {
            font-size: 1.5rem;
        }

        .notification-success .notification-icon {
            color: var(--color-green-primary);
        }

        .notification-error .notification-icon {
            color: #ff5f56;
        }

        .notification-message {
            flex: 1;
            color: var(--color-text-primary);
            font-size: 0.9375rem;
        }

        .notification-close {
            background: none;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            font-size: 1.25rem;
            padding: 0;
            transition: var(--transition-fast);
        }

        .notification-close:hover {
            color: var(--color-text-primary);
        }

        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @media (max-width: 768px) {
            .notification {
                right: 1rem;
                left: 1rem;
                max-width: none;
            }
        }
    `;

    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ==========================================
// PARALLAX EFFECT FOR HERO BACKGROUND
// ==========================================

const heroBackground = document.querySelector('.hero-background');

if (heroBackground) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ==========================================
// CARD HOVER EFFECTS
// ==========================================

document.querySelectorAll('.expertise-card, .project-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ==========================================
// LAZY LOADING FOR IMAGES (if any added later)
// ==========================================

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', lazyLoadImages);

// ==========================================
// TERMINAL CURSOR BLINK
// ==========================================

const terminalCursor = document.querySelector('.terminal-cursor');
if (terminalCursor) {
    setInterval(() => {
        terminalCursor.style.opacity = terminalCursor.style.opacity === '0' ? '1' : '0';
    }, 500);
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================

document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        if (navLinks && navLinks.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }

    // Ctrl/Cmd + K for quick navigation (optional enhancement)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    }
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-intensive functions
window.addEventListener('scroll', debounce(highlightNavLink, 10));

// ==========================================
// PRELOADER (Optional)
// ==========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero [data-aos]');
        heroElements.forEach(el => el.classList.add('aos-animate'));
    }, 100);
});

// ==========================================
// SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS
// ==========================================

if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c👋 Olá, Developer!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%c💼 Interessado em trabalhar comigo? Entre em contato!', 'color: #00ff88; font-size: 14px;');
console.log('%c🔗 GitHub: https://github.com/jonasbrito1', 'color: #ffd600; font-size: 14px;');
console.log('%c🔗 LinkedIn: https://www.linkedin.com/in/jonaspacheco1/', 'color: #ffd600; font-size: 14px;');

// ==========================================
// ANALYTICS READY
// ==========================================

// Placeholder for analytics initialization
function initAnalytics() {
    console.log('Page loaded - Analytics ready');

    // Track important interactions
    document.querySelectorAll('.btn, .project-link, .social-link').forEach(element => {
        element.addEventListener('click', function() {
            const elementText = this.textContent.trim() || this.getAttribute('aria-label') || 'unknown';
            console.log('Click tracked:', elementText);
        });
    });
}

document.addEventListener('DOMContentLoaded', initAnalytics);

console.log('🚀 Portfolio v1.0.0 - Jonas Pacheco');

// ==========================================
// INTERNATIONALIZATION (i18n)
// ==========================================

const translations = {
    pt: {
        nav: {
            home: "Início",
            about: "Sobre",
            expertise: "Especialidades",
            projects: "Projetos",
            contact: "Contato"
        },
        hero: {
            badge: "Engenheiro de Software",
            description: "Transformo desafios técnicos em soluções seguras e escaláveis.<br>Especializado em desenvolvimento full-stack, DevSecOps e inteligência artificial.",
            cta1: "Entre em Contato",
            cta2: "Ver Projetos"
        },
        about: {
            tag: "<sobre>",
            title: "Sobre Mim",
            subtitle: "Construindo soluções que resolvem problemas reais",
            description1: "Com mais de <strong>50 projetos</strong> desenvolvidos, ajudo empresas a transformar desafios complexos em soluções eficientes. Meu trabalho vai além de escrever código — entendo do seu negócio, identifico os reais problemas e entrego sistemas que fazem a diferença no dia a dia.",
            description2: "Especializado em <strong>desenvolvimento full-stack, segurança e automação</strong>, trabalho com tecnologias modernas para criar aplicações escaláveis, seguras e fáceis de manter. Se você precisa de um sistema ERP personalizado, automação de processos ou uma solução de compliance, posso ajudar.",
            highlight1Title: "Desenvolvimento Seguro",
            highlight1Text: "Segurança integrada em todas as etapas do ciclo de desenvolvimento",
            highlight2Title: "Escalabilidade",
            highlight2Text: "Arquiteturas preparadas para crescimento",
            highlight3Title: "Automação",
            highlight3Text: "Processos eficientes e otimizados",
            stat1: "Projetos Entregues",
            stat2: "Satisfação do Cliente",
            stat3: "Uptime Garantido",
            stat4: "Incidentes de Segurança",
            value1: "Código limpo e documentado",
            value2: "Entrega dentro do prazo",
            value3: "Suporte pós-entrega"
        },
        expertise: {
            tag: "<especialidades>",
            title: "Áreas de Expertise",
            subtitle: "Especializado em desenvolvimento seguro e escalável com IA",
            backend: "Desenvolvimento Backend",
            backendDesc: "APIs RESTful, microserviços e arquitetura escalável com PHP, Python e Node.js. Integração com IA e Machine Learning. Foco em performance e segurança.",
            frontend: "Desenvolvimento Frontend",
            frontendDesc: "Interfaces modernas e responsivas com React, Next.js, JavaScript e HTML/CSS. Experiência do usuário aprimorada com IA e acessibilidade.",
            erp: "Sistemas ERP",
            erpDesc: "Desenvolvimento de soluções empresariais completas com análise preditiva por IA, gestão integrada e automação inteligente de processos.",
            devsecops: "DevSecOps",
            devsecopsDesc: "Integração de segurança no pipeline de desenvolvimento. CI/CD, containerização, infraestrutura como código e monitoramento automatizado.",
            mobile: "Desenvolvimento Mobile",
            mobileDesc: "Aplicativos nativos Android com Kotlin e recursos de IA. Design responsivo e performance otimizada para dispositivos móveis.",
            automation: "IA & Automação",
            automationDesc: "Soluções inteligentes com IA, Machine Learning e automação avançada. Frameworks personalizados para otimização de processos e compliance."
        },
        projects: {
            tag: "<projetos>",
            title: "Projetos em Destaque",
            subtitle: "Alguns dos trabalhos que desenvolvi",
            viewAll: "Ver Todos os Projetos",
            medsys: "Sistema completo de gestão médica e hospitalar que aumentou em 60% a eficiência no atendimento. Gestão de pacientes, prontuários eletrônicos e agendamentos com segurança LGPD garantida.",
            easycompliance: "Plataforma que reduziu em 30 horas semanais o tempo gasto com compliance. Automação completa de processos de auditoria, controles internos e relatórios regulatórios com zero erros.",
            evolutionerp: "Sistema ERP que reduziu custos operacionais em 40% e integrou todos os processos da empresa. Módulos de finanças, estoque, vendas e RH trabalhando em perfeita sincronia.",
            attackdetection: "Sistema de detecção e prevenção de ataques SSH. Monitoramento em tempo real, análise de padrões e bloqueio automático de tentativas maliciosas.",
            gbcidadenova: "Portal institucional com gestão de conteúdo e serviços integrados. Arquitetura moderna e interface responsiva para melhor experiência do usuário.",
            i9script: "Framework de automação e scripts personalizados para otimização de processos. Ferramentas inteligentes para desenvolvimento e operações de sistemas."
        },
        testimonials: {
            tag: "<depoimentos>",
            title: "O Que Dizem Sobre Meu Trabalho",
            subtitle: "Resultados reais de projetos entregues"
        },
        process: {
            tag: "<processo>",
            title: "Como Trabalho",
            subtitle: "Metodologia comprovada para entregar resultados",
            step1Title: "Análise & Planejamento",
            step1Desc: "Entendo profundamente seu negócio, os desafios e objetivos. Documento todos os requisitos e crio um plano de ação detalhado.",
            step2Title: "Design & Arquitetura",
            step2Desc: "Projeto a arquitetura do sistema priorizando segurança, escalabilidade e manutenibilidade. Defino a stack tecnológica ideal.",
            step3Title: "Desenvolvimento",
            step3Desc: "Codifico seguindo as melhores práticas, com testes automatizados e code reviews constantes. Você acompanha o progresso em tempo real.",
            step4Title: "Testes & Validação",
            step4Desc: "Realizo testes rigorosos de segurança, performance e usabilidade. Corrijo bugs e otimizo antes do lançamento.",
            step5Title: "Deploy & Suporte",
            step5Desc: "Faço o deploy com zero downtime, treino sua equipe e forneço documentação completa. Suporte pós-entrega está incluído."
        },
        technologies: {
            tag: "<tecnologias>",
            title: "Stack Tecnológico",
            subtitle: "Ferramentas e tecnologias que domino",
            languages: "Linguagens",
            frameworks: "Frameworks",
            databases: "Banco de Dados",
            devops: "DevOps & Ferramentas"
        },
        contact: {
            tag: "<contato>",
            title: "Vamos Trabalhar Juntos?",
            subtitle: "Consultoria gratuita + Garantias de qualidade",
            intro: "Entre em contato agora e receba uma consultoria gratuita sobre seu projeto. Vou analisar suas necessidades e propor a melhor solução técnica, sem compromisso.",
            readyTitle: "Pronto para começar?",
            name: "Nome",
            email: "Email",
            subject: "Assunto",
            message: "Mensagem",
            send: "Enviar Mensagem",
            guarantee1Title: "Consultoria Gratuita",
            guarantee1Desc: "Primeira reunião sem compromisso para entender seu projeto",
            guarantee2Title: "Entrega no Prazo",
            guarantee2Desc: "Cronogramas realistas e cumprimento de deadlines",
            guarantee3Title: "Suporte Incluído",
            guarantee3Desc: "30 dias de suporte pós-entrega sem custo adicional",
            guarantee4Title: "Código Documentado",
            guarantee4Desc: "Documentação completa e código limpo garantidos"
        },
        footer: {
            tagline: "Desenvolvendo sistemas que resolvem problemas reais",
            navigation: "Navegação",
            social: "Social",
            projects: "Projetos",
            rights: "Todos os direitos reservados.",
            developed: "Desenvolvido por",
            coffee: "e muito"
        }
    },
    en: {
        nav: {
            home: "Home",
            about: "About",
            expertise: "Expertise",
            projects: "Projects",
            contact: "Contact"
        },
        hero: {
            badge: "Software Engineer",
            description: "I transform technical challenges into secure and scalable solutions.<br>Specialized in full-stack development, DevSecOps, and artificial intelligence.",
            cta1: "Get in Touch",
            cta2: "View Projects"
        },
        about: {
            tag: "<about>",
            title: "About Me",
            subtitle: "Building solutions that solve real problems",
            description1: "With over <strong>50 projects</strong> delivered, I help companies transform complex challenges into efficient solutions. My work goes beyond writing code — I understand your business, identify real problems, and deliver systems that make a difference in daily operations.",
            description2: "Specialized in <strong>full-stack development, security, and automation</strong>, I work with modern technologies to create scalable, secure, and easy-to-maintain applications. Whether you need a custom ERP system, process automation, or a compliance solution, I can help.",
            highlight1Title: "Secure Development",
            highlight1Text: "Security integrated in all stages of the development cycle",
            highlight2Title: "Scalability",
            highlight2Text: "Architectures prepared for growth",
            highlight3Title: "Automation",
            highlight3Text: "Efficient and optimized processes",
            stat1: "Projects Delivered",
            stat2: "Client Satisfaction",
            stat3: "Guaranteed Uptime",
            stat4: "Security Incidents",
            value1: "Clean and documented code",
            value2: "On-time delivery",
            value3: "Post-delivery support"
        },
        expertise: {
            tag: "<expertise>",
            title: "Areas of Expertise",
            subtitle: "Specialized in secure and scalable development with AI",
            backend: "Backend Development",
            backendDesc: "RESTful APIs, microservices, and scalable architecture with PHP, Python, and Node.js. AI and Machine Learning integration. Focus on performance and security.",
            frontend: "Frontend Development",
            frontendDesc: "Modern and responsive interfaces with React, Next.js, JavaScript, and HTML/CSS. AI-enhanced user experience and accessibility.",
            erp: "ERP Systems",
            erpDesc: "Development of complete enterprise solutions with AI-powered predictive analytics, integrated management, and intelligent process automation.",
            devsecops: "DevSecOps",
            devsecopsDesc: "Security integration in the development pipeline. CI/CD, containerization, infrastructure as code, and automated monitoring.",
            mobile: "Mobile Development",
            mobileDesc: "Native Android applications with Kotlin and AI features. Responsive design and optimized performance for mobile devices.",
            automation: "AI & Automation",
            automationDesc: "Intelligent solutions with AI, Machine Learning, and advanced automation. Custom frameworks for process optimization and compliance."
        },
        projects: {
            tag: "<projects>",
            title: "Featured Projects",
            subtitle: "Some of the work I've developed",
            viewAll: "View All Projects",
            medsys: "Complete medical and hospital management system that increased care efficiency by 60%. Patient management, electronic medical records, and appointments with guaranteed LGPD security.",
            easycompliance: "Platform that reduced compliance time by 30 hours per week. Complete automation of audit processes, internal controls, and regulatory reports with zero errors.",
            evolutionerp: "ERP system that reduced operational costs by 40% and integrated all company processes. Finance, inventory, sales, and HR modules working in perfect sync.",
            attackdetection: "SSH attack detection and prevention system. Real-time monitoring, pattern analysis, and automatic blocking of malicious attempts.",
            gbcidadenova: "Institutional portal with content management and integrated services. Modern architecture and responsive interface for better user experience.",
            i9script: "Automation framework and custom scripts for process optimization. Intelligent tools for system development and operations."
        },
        testimonials: {
            tag: "<testimonials>",
            title: "What People Say About My Work",
            subtitle: "Real results from delivered projects"
        },
        process: {
            tag: "<process>",
            title: "How I Work",
            subtitle: "Proven methodology to deliver results",
            step1Title: "Analysis & Planning",
            step1Desc: "I deeply understand your business, challenges, and goals. I document all requirements and create a detailed action plan.",
            step2Title: "Design & Architecture",
            step2Desc: "I design system architecture prioritizing security, scalability, and maintainability. I define the ideal technology stack.",
            step3Title: "Development",
            step3Desc: "I code following best practices, with automated tests and constant code reviews. You track progress in real-time.",
            step4Title: "Testing & Validation",
            step4Desc: "I perform rigorous security, performance, and usability tests. I fix bugs and optimize before launch.",
            step5Title: "Deploy & Support",
            step5Desc: "I deploy with zero downtime, train your team, and provide complete documentation. Post-delivery support is included."
        },
        technologies: {
            tag: "<technologies>",
            title: "Technology Stack",
            subtitle: "Tools and technologies I master",
            languages: "Languages",
            frameworks: "Frameworks",
            databases: "Databases",
            devops: "DevOps & Tools"
        },
        contact: {
            tag: "<contact>",
            title: "Let's Work Together?",
            subtitle: "Free consultation + Quality guarantees",
            intro: "Get in touch now and receive a free consultation about your project. I'll analyze your needs and propose the best technical solution, with no commitment.",
            readyTitle: "Ready to start?",
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message",
            send: "Send Message",
            guarantee1Title: "Free Consultation",
            guarantee1Desc: "First meeting with no commitment to understand your project",
            guarantee2Title: "On-Time Delivery",
            guarantee2Desc: "Realistic schedules and deadline compliance",
            guarantee3Title: "Support Included",
            guarantee3Desc: "30 days of post-delivery support at no additional cost",
            guarantee4Title: "Documented Code",
            guarantee4Desc: "Complete documentation and clean code guaranteed"
        },
        footer: {
            tagline: "Developing systems that solve real problems",
            navigation: "Navigation",
            social: "Social",
            projects: "Projects",
            rights: "All rights reserved.",
            developed: "Developed by",
            coffee: "and lots of"
        }
    }
};

// Current language
let currentLang = localStorage.getItem('preferredLang') || 'pt';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    updateTypingTexts();
});

// Language toggle button
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
}

function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    setLanguage(currentLang);
    localStorage.setItem('preferredLang', currentLang);
    updateTypingTexts();
}

function setLanguage(lang) {
    currentLang = lang;

    // Update lang toggle button
    const langFlag = document.querySelector('.lang-flag');
    const langText = document.querySelector('.lang-text');
    if (langFlag && langText) {
        langFlag.textContent = lang === 'pt' ? '🇧🇷' : '🇺🇸';
        langText.textContent = lang === 'pt' ? 'PT' : 'EN';
    }

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    // Update specific sections that need innerHTML
    updateHeroSection(lang);
    updateAboutSection(lang);
    updateExpertiseSection(lang);
    updateProjectsSection(lang);
    updateTestimonialsSection(lang);
    updateProcessSection(lang);
    updateContactSection(lang);
    updateFooterSection(lang);
}

function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

function updateTypingTexts() {
    const texts = currentLang === 'pt'
        ? ['"Desenvolvedor Full-Stack"', '"Especialista em DevSecOps"', '"Arquiteto de Soluções"', '"Engenheiro de Software"']
        : ['"Full-Stack Developer"', '"DevSecOps Specialist"', '"Solutions Architect"', '"Software Engineer"'];

    // Update global typingTexts array
    window.typingTexts = texts;
    textIndex = 0;
    charIndex = 0;
    isDeleting = false;

    // Reset typing animation
    if (typingElement) {
        typingElement.textContent = '';
    }
}

function updateHeroSection(lang) {
    const t = translations[lang].hero;

    // Badge
    const badge = document.querySelector('.greeting-badge');
    if (badge) badge.textContent = t.badge;

    // Description
    const description = document.querySelector('.hero-description');
    if (description) description.innerHTML = t.description;

    // CTAs
    const cta1 = document.querySelector('.hero-cta .btn-primary span');
    if (cta1) cta1.textContent = t.cta1;

    const cta2 = document.querySelector('.hero-cta .btn-secondary span');
    if (cta2) cta2.textContent = t.cta2;
}

function updateAboutSection(lang) {
    const t = translations[lang].about;

    // Section tag
    const aboutTag = document.querySelector('#about .section-tag');
    if (aboutTag) aboutTag.textContent = t.tag;

    // Section title
    const aboutTitle = document.querySelector('#about .section-title');
    if (aboutTitle) aboutTitle.textContent = t.title;

    // Section subtitle
    const aboutSubtitle = document.querySelector('#about .section-subtitle');
    if (aboutSubtitle) aboutSubtitle.textContent = t.subtitle;

    // Descriptions
    const descriptions = document.querySelectorAll('#about .about-description');
    if (descriptions[0]) descriptions[0].innerHTML = t.description1;
    if (descriptions[1]) descriptions[1].innerHTML = t.description2;

    // Value props
    const valueItems = document.querySelectorAll('#about .value-item span');
    if (valueItems[0]) valueItems[0].textContent = t.value1;
    if (valueItems[1]) valueItems[1].textContent = t.value2;
    if (valueItems[2]) valueItems[2].textContent = t.value3;

    // Highlight items
    const highlights = document.querySelectorAll('#about .highlight-item');
    if (highlights[0]) {
        highlights[0].querySelector('h3').textContent = t.highlight1Title;
        highlights[0].querySelector('p').textContent = t.highlight1Text;
    }
    if (highlights[1]) {
        highlights[1].querySelector('h3').textContent = t.highlight2Title;
        highlights[1].querySelector('p').textContent = t.highlight2Text;
    }
    if (highlights[2]) {
        highlights[2].querySelector('h3').textContent = t.highlight3Title;
        highlights[2].querySelector('p').textContent = t.highlight3Text;
    }

    // Stats
    const stats = document.querySelectorAll('#about .stat-label');
    if (stats[0]) stats[0].textContent = t.stat1;
    if (stats[1]) stats[1].textContent = t.stat2;
    if (stats[2]) stats[2].textContent = t.stat3;
    if (stats[3]) stats[3].textContent = t.stat4;
}

function updateExpertiseSection(lang) {
    const t = translations[lang].expertise;

    // Section elements
    const expertiseTag = document.querySelector('#expertise .section-tag');
    if (expertiseTag) expertiseTag.textContent = t.tag;

    const expertiseTitle = document.querySelector('#expertise .section-title');
    if (expertiseTitle) expertiseTitle.textContent = t.title;

    const expertiseSubtitle = document.querySelector('#expertise .section-subtitle');
    if (expertiseSubtitle) expertiseSubtitle.textContent = t.subtitle;

    // Expertise cards
    const cards = document.querySelectorAll('#expertise .expertise-card');
    const cardData = [
        { title: t.backend, desc: t.backendDesc },
        { title: t.frontend, desc: t.frontendDesc },
        { title: t.erp, desc: t.erpDesc },
        { title: t.devsecops, desc: t.devsecopsDesc },
        { title: t.mobile, desc: t.mobileDesc },
        { title: t.automation, desc: t.automationDesc }
    ];

    cards.forEach((card, index) => {
        if (cardData[index]) {
            const cardTitle = card.querySelector('.card-title');
            const cardDesc = card.querySelector('.card-description');
            if (cardTitle) cardTitle.textContent = cardData[index].title;
            if (cardDesc) cardDesc.textContent = cardData[index].desc;
        }
    });
}

function updateProjectsSection(lang) {
    const t = translations[lang].projects;

    // Section elements
    const projectsTag = document.querySelector('#projects .section-tag');
    if (projectsTag) projectsTag.textContent = t.tag;

    const projectsTitle = document.querySelector('#projects .section-title');
    if (projectsTitle) projectsTitle.textContent = t.title;

    const projectsSubtitle = document.querySelector('#projects .section-subtitle');
    if (projectsSubtitle) projectsSubtitle.textContent = t.subtitle;

    // View all button
    const viewAllBtn = document.querySelector('#projects .projects-cta .btn span');
    if (viewAllBtn) viewAllBtn.textContent = t.viewAll;

    // Project descriptions
    const projects = document.querySelectorAll('#projects .project-description');
    const projectDescriptions = [
        t.medsys,
        t.easycompliance,
        t.evolutionerp,
        t.attackdetection,
        t.gbcidadenova,
        t.i9script
    ];

    projects.forEach((project, index) => {
        if (projectDescriptions[index]) {
            project.textContent = projectDescriptions[index];
        }
    });
}

function updateContactSection(lang) {
    const t = translations[lang].contact;

    // Section elements
    const contactTag = document.querySelector('#contact .section-tag');
    if (contactTag) contactTag.textContent = t.tag;

    const contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) contactTitle.textContent = t.title;

    const contactSubtitle = document.querySelector('#contact .section-subtitle');
    if (contactSubtitle) contactSubtitle.textContent = t.subtitle;

    // Guarantees
    const guaranteeItems = document.querySelectorAll('.guarantee-item');
    if (guaranteeItems[0]) {
        guaranteeItems[0].querySelector('h4').textContent = t.guarantee1Title;
        guaranteeItems[0].querySelector('p').textContent = t.guarantee1Desc;
    }
    if (guaranteeItems[1]) {
        guaranteeItems[1].querySelector('h4').textContent = t.guarantee2Title;
        guaranteeItems[1].querySelector('p').textContent = t.guarantee2Desc;
    }
    if (guaranteeItems[2]) {
        guaranteeItems[2].querySelector('h4').textContent = t.guarantee3Title;
        guaranteeItems[2].querySelector('p').textContent = t.guarantee3Desc;
    }
    if (guaranteeItems[3]) {
        guaranteeItems[3].querySelector('h4').textContent = t.guarantee4Title;
        guaranteeItems[3].querySelector('p').textContent = t.guarantee4Desc;
    }

    // Contact text
    const contactTextTitle = document.querySelector('.contact-text h3');
    if (contactTextTitle) contactTextTitle.textContent = t.readyTitle;

    const contactTextP = document.querySelector('.contact-text p');
    if (contactTextP) contactTextP.textContent = t.intro;

    // Form labels
    const nameLabel = document.querySelector('label[for="name"]');
    if (nameLabel) nameLabel.textContent = t.name;

    const emailLabel = document.querySelector('label[for="email"]');
    if (emailLabel) emailLabel.textContent = t.email;

    const subjectLabel = document.querySelector('label[for="subject"]');
    if (subjectLabel) subjectLabel.textContent = t.subject;

    const messageLabel = document.querySelector('label[for="message"]');
    if (messageLabel) messageLabel.textContent = t.message;

    // Submit button
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) submitBtn.textContent = t.send;
}

function updateFooterSection(lang) {
    const t = translations[lang].footer;

    // Footer tagline
    const tagline = document.querySelector('.footer-tagline');
    if (tagline) tagline.textContent = t.tagline;

    // Footer column titles
    const columns = document.querySelectorAll('.footer-column h3');
    if (columns[0]) columns[0].textContent = t.navigation;
    if (columns[1]) columns[1].textContent = t.social;
    if (columns[2]) columns[2].textContent = t.projects;

    // Copyright
    const copyright = document.querySelector('.footer-bottom p:first-child');
    if (copyright) {
        const year = new Date().getFullYear();
        copyright.textContent = `© ${year} Jonas Pacheco. ${t.rights}`;
    }
}

function updateTestimonialsSection(lang) {
    const t = translations[lang].testimonials;

    // Section elements
    const testimonialsTag = document.querySelector('#testimonials .section-tag');
    if (testimonialsTag) testimonialsTag.textContent = t.tag;

    const testimonialsTitle = document.querySelector('#testimonials .section-title');
    if (testimonialsTitle) testimonialsTitle.textContent = t.title;

    const testimonialsSubtitle = document.querySelector('#testimonials .section-subtitle');
    if (testimonialsSubtitle) testimonialsSubtitle.textContent = t.subtitle;
}

function updateProcessSection(lang) {
    const t = translations[lang].process;

    // Section elements
    const processTag = document.querySelector('#process .section-tag');
    if (processTag) processTag.textContent = t.tag;

    const processTitle = document.querySelector('#process .section-title');
    if (processTitle) processTitle.textContent = t.title;

    const processSubtitle = document.querySelector('#process .section-subtitle');
    if (processSubtitle) processSubtitle.textContent = t.subtitle;

    // Process steps
    const steps = document.querySelectorAll('.process-step');
    const stepData = [
        { title: t.step1Title, desc: t.step1Desc },
        { title: t.step2Title, desc: t.step2Desc },
        { title: t.step3Title, desc: t.step3Desc },
        { title: t.step4Title, desc: t.step4Desc },
        { title: t.step5Title, desc: t.step5Desc }
    ];

    steps.forEach((step, index) => {
        if (stepData[index]) {
            const stepTitle = step.querySelector('.step-title');
            const stepDesc = step.querySelector('.step-description');
            if (stepTitle) stepTitle.textContent = stepData[index].title;
            if (stepDesc) stepDesc.textContent = stepData[index].desc;
        }
    });
}