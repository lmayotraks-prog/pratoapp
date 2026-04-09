// Particle Background Effect
const canvas = document.getElementById('bg-canvas');

let particles = [];
const particleCount = 100;

// Only run particle code if canvas exists on this page
if (canvas) {
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2; // Slower, more elegant movement
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 3 + 1; // Slightly larger, softer particles
        // Base color flag, actual color resolved in draw()
        this.isCyan = Math.random() > 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        const theme = document.body.getAttribute('data-theme') || (document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Colors adapt to theme variables via computed styles or standard logic
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--primary-accent').trim();
        const text = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim();
        
        ctx.fillStyle = this.isCyan ? `${accent}88` : `${text}44`;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; 
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const accent = getComputedStyle(document.documentElement).getPropertyValue('--primary-accent').trim();
                ctx.beginPath();
                ctx.strokeStyle = `${accent}${Math.floor((0.15 - dist / 800) * 255).toString(16).padStart(2, '0')}`;
                ctx.lineWidth = 0.6;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

// Initial Setup
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initParticles();
animateParticles();

} // end if (canvas)
// Scroll Animation with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Select elements to animate and set initial state
document.querySelectorAll('.feature-card, .service-item, .project-card, .store-item, .gallery-item, .lead-section').forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px) scale(0.98)";
    el.style.transition = `all 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.05}s`;
    observer.observe(el);
});

// Logic for VIP Lead Form submission
document.addEventListener('DOMContentLoaded', () => {
    const vipForm = document.getElementById('vip-lead-form');
    if (vipForm) {
        vipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-lead-btn');
            const msg = document.getElementById('form-message');
            btn.innerHTML = 'Procesando...';
            btn.disabled = true;

            const leadData = {
                id: Date.now(),
                name: document.getElementById('lead-name').value,
                email: document.getElementById('lead-email').value,
                phone: document.getElementById('lead-phone').value,
                service: document.getElementById('lead-service').value,
                date: new Date().toISOString()
            };

            // Attempt to send to local server if exists, else fallback to localStorage
            try {
                // In a real scenario, this would post to http://localhost:3000/api/leads
                // Since this is a local simulated demo, we save to local storage
                let leads = JSON.parse(localStorage.getItem('vip_leads') || '[]');
                leads.push(leadData);
                localStorage.setItem('vip_leads', JSON.stringify(leads));

                // Optional: We could trigger a BroadcastChannel to update admin.html in real-time
                const channel = new BroadcastChannel('vip_leads_channel');
                channel.postMessage({ type: 'NEW_LEAD', lead: leadData });

                setTimeout(() => {
                    msg.style.display = 'block';
                    msg.style.color = '#2ecc71';
                    msg.innerText = '¡Solicitud recibida! Un asesor VIP te contactará pronto.';
                    btn.innerHTML = 'Solicitar Valoración Exclusiva';
                    btn.disabled = false;
                    vipForm.reset();
                }, 1500);

            } catch (err) {
                console.error(err);
                msg.style.display = 'block';
                msg.style.color = '#e74c3c';
                msg.innerText = 'Hubo un error al procesar tu solicitud.';
                btn.innerHTML = 'Intentar de Nuevo';
                btn.disabled = false;
            }
        });
    }
});


// Mobile menu toggle (simple version)
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('open');
    });
}

// Custom Cursor Animation
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

// Check if device supports hover AND cursor elements exist
if (cursorDot && cursorOutline && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    // Ensure cursor elements never block clicks
    cursorDot.style.pointerEvents = 'none';
    cursorOutline.style.pointerEvents = 'none';

    let cursorX = -200;
    let cursorY = -200;
    let outlineX = -200;
    let outlineY = -200;
    let cursorVisible = false;

    window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;

        // Show cursor on first real mouse movement
        if (!cursorVisible) {
            cursorVisible = true;
            document.body.classList.add('custom-cursor-active');
            cursorDot.classList.add('cursor-visible');
            cursorOutline.classList.add('cursor-visible');
        }
    });

    // Smooth outline with lag
    function animateCursor() {
        let ease = 0.15;
        outlineX += (cursorX - outlineX) * ease;
        outlineY += (cursorY - outlineY) * ease;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Reusable function — call on load AND after dynamic content is injected
    function registerCursorTargets() {
        const selector = 'a, button, .btn, .hover-glow, .gallery-item, .video-container, .project-card, input, textarea, select, .store-item, .play-overlay, .proc-btn, .form-control, .cta-btn, .nav-back';
        document.querySelectorAll(selector).forEach(el => {
            // Avoid double-binding by checking flag
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = 'true';
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorOutline.classList.remove('hover');
            });
        });
    }

    // Initial registration on page load
    registerCursorTargets();

    // Re-register after DOMContentLoaded to catch dynamically added form elements
    document.addEventListener('DOMContentLoaded', registerCursorTargets);

} else if (cursorDot && cursorOutline) {
    // Hide custom cursor on mobile/touch devices
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
}

// =============================================
// Before / After Image Comparison Sliders
// =============================================
function initBASliders() {
    document.querySelectorAll('.ba-slider').forEach(slider => {
        const handle = slider.querySelector('.ba-handle');
        const before = slider.querySelector('.ba-before');
        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            
            // Constrain
            position = Math.max(0, Math.min(100, position));
            
            // Update UI
            handle.style.left = `${position}%`;
            before.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            updateSlider(x);
        };

        const onStart = (e) => {
            isDragging = true;
            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            updateSlider(x);
            handle.style.transition = 'none';
            before.style.transition = 'none';
        };

        const onEnd = () => {
            isDragging = false;
        };

        // Events
        slider.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        slider.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
        
        // Initial position
        updateSlider(slider.offsetWidth / 2 + slider.getBoundingClientRect().left);
    });
}

// Run on Load
document.addEventListener('DOMContentLoaded', initBASliders);


// =============================================
// Theme Toggle Logic
// =============================================
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

// Set Initial Theme
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon('dark');
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        let newTheme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            newTheme = 'dark';
        }
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
        // Change to Sun Icon since it's dark
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    } else {
        // Change to Moon Icon
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    }
}

// =============================================
// Virtual Secretary Chatbot Logic
// =============================================
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatWidget = document.getElementById('chat-widget');
const closeChat = document.getElementById('close-chat');
const chatBody = document.getElementById('chat-body');
const chatOptions = document.getElementById('chat-options');

if (chatToggleBtn && chatWidget && closeChat) {
    chatToggleBtn.addEventListener('click', () => {
        chatWidget.classList.add('active');
        chatToggleBtn.style.opacity = '0'; // Hide button when open
        chatToggleBtn.style.pointerEvents = 'none';
        
        // Auto scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    });

    closeChat.addEventListener('click', () => {
        chatWidget.classList.remove('active');
        chatToggleBtn.style.opacity = '1';
        chatToggleBtn.style.pointerEvents = 'auto';
    });
}

function appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg user';
    msg.innerText = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function appendBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    msg.innerText = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Global scope handle for onClick attributes
window.handleChatOption = function(optionText) {
    appendUserMessage(optionText);
    
    // Hide old options
    chatOptions.style.display = 'none';

    setTimeout(() => {
        let n = "573022780781";
        if (optionText === 'Agendar Cita') {
            appendBotMessage("Perfecto, para agendar tu cita, vamos a continuar a través de WhatsApp para coordinar la fecha y hora ideal para ti.");
            setTimeout(() => {
                window.open(`https://wa.me/${n}?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20VIP.`, '_blank');
                closeChat.click();
            }, 1000);
        } else if (optionText === 'Conocer Procedimientos') {
            appendBotMessage("Ofrecemos Diseño de Sonrisa, Rehabilitación Oral, Blanqueamiento, Cirugía e Implantes. Para brindarte la mejor asesoría personalizada, conéctate con nosotros vía WhatsApp.");
            setTimeout(() => {
                window.open(`https://wa.me/${n}?text=Hola,%20deseo%20conocer%20m%C3%A1s%20sobre%20los%20procedimientos%20dentales.`, '_blank');
                closeChat.click();
            }, 1500);
        } else {
            appendBotMessage("Nuestros especialistas de élite están listos para atenderte personalmente en WhatsApp.");
            setTimeout(() => {
                window.open(`https://wa.me/${n}?text=Hola,%20quisiera%20hablar%20con%20un%20asesor.`, '_blank');
                closeChat.click();
            }, 1000);
        }
    }, 500);
};

// =============================================
// Video Modal Functionality
// =============================================
function initVideoModal() {
    const videoModal = document.getElementById('video-modal');
    const modalContainer = document.getElementById('modal-video-container');
    const closeModal = document.querySelector('.modal-close');
    const videoItems = document.querySelectorAll('.video-container');

    if (!videoModal || !modalContainer) return;

    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            const videoType = item.getAttribute('data-video-type') || 'youtube';
            
            if (videoId) {
                let embedUrl = "";
                if (videoType === 'vimeo') {
                    // Vimeo embed URL
                    embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`;
                } else {
                    // YouTube embed URL
                    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                }
                
                modalContainer.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            }
        });
    });

    const closeHandler = () => {
        videoModal.classList.remove('active');
        modalContainer.innerHTML = ''; // Stop video
        document.body.style.overflow = 'auto'; // Re-enable scroll
    };

    if (closeModal) closeModal.addEventListener('click', closeHandler);

    // Close on background click
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeHandler();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeHandler();
        }
    });
}

// =============================================
// Theme Selector Logic (Multi-Palette)
// =============================================
function initThemeSelector() {
    const swatches = document.querySelectorAll('.theme-swatch');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const themeName = swatch.getAttribute('data-theme-name');
            applyTheme(themeName);
        });
    });
}

function applyTheme(themeName) {
    const swatches = document.querySelectorAll('.theme-swatch');
    
    // Clear all theme attributes and classes first
    document.body.removeAttribute('data-theme');
    // If it's the diamond theme, we just use defaults (light mode style)
    if (themeName !== 'diamond') {
        document.body.setAttribute('data-theme', themeName);
    }
    
    // Update Active Swatch
    swatches.forEach(s => {
        if (s.getAttribute('data-theme-name') === themeName) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });

    localStorage.setItem('selected-theme', themeName);
}

document.addEventListener('DOMContentLoaded', initThemeSelector);


// Initial Run
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoModal);
} else {
    initVideoModal();
}
