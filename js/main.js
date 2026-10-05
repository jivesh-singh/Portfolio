/**
 * ALEX RIVERA // SENIOR FULL-STACK & CLOUD SYSTEMS ARCHITECT
 * Interactive JavaScript Engine
 * Color Palette: #0D1B2A, #1B263B, #415A77, #778DA9, #E0E1DD
 */

document.addEventListener('DOMContentLoaded', () => {
  initConstellationCanvas();
  initTypewriter();
  initCardSpotlight();
  initProjectFilters();
  initCaseStudyModal();
  initDeveloperTerminal();
  initContactForm();
  initClipboardCopy();
  initNavigation();
  initLocalTime();
});

/* ==========================================================================
   1. CONSTELLATION BACKGROUND CANVAS
   ========================================================================== */
function initConstellationCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse collision / repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 2;
          this.y -= dirY * force * 2;
        }
      }
    }

    draw() {
      ctx.fillStyle = `rgba(119, 141, 169, ${this.baseAlpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.22;
          ctx.strokeStyle = `rgba(65, 90, 119, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Full-Stack Architect',
    'Cloud Systems Engineer',
    'High-Performance Developer',
    'Distributed Systems Specialist'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. MOUSE SPOTLIGHT ON GLASS CARDS
   ========================================================================== */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.glass-card, .project-card, .skill-category-card, .timeline-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   4. PROJECT CATEGORY FILTER
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. CASE STUDY MODAL SYSTEM
   ========================================================================== */
const projectCaseStudies = {
  nexus: {
    title: 'Nexus Cloud — Distributed Infrastructure Orchestrator',
    tag: 'Cloud & Systems Architecture',
    problem:
      'Enterprise microservices running across multi-region Kubernetes clusters experienced unpredictable tail latency during failovers, coupled with opaque observability and spiraling inter-zone ingress egress costs.',
    solution:
      'Architected an intelligent, zero-overhead service mesh orchestrator in Go and Rust utilizing eBPF network telemetry. Built a unified glassmorphic management dashboard featuring real-time cluster topology maps and predictive autoscaling policies.',
    metrics: [
      'Processed over 1.2 Billion monthly telemetry events with <2ms overhead.',
      'Reduced cross-availability-zone data transfer costs by 38.5%.',
      'Improved multi-region failover mean time to recovery (MTTR) from 4.5 minutes to under 8 seconds.'
    ],
    stack: ['Go', 'Rust', 'Kubernetes', 'eBPF', 'PostgreSQL', 'TypeScript', 'WebSockets']
  },
  neuroflow: {
    title: 'NeuroFlow — Autonomous AI Agent Studio & Graph Engine',
    tag: 'AI Engineering & Full-Stack',
    problem:
      'Product teams building LLM workflows lacked a reliable, deterministic orchestration canvas for recursive reasoning, memory vector synchronization, and safe human-in-the-loop approvals.',
    solution:
      'Designed and engineered a node-based visual orchestration studio with real-time token streaming, state persistence via Redis, and dynamic model routing (Gemini, Claude, GPT-4o) with automatic semantic cache fallback.',
    metrics: [
      'Over 24,000 active AI agent pipelines constructed.',
      'Saved 42% in raw API tokens via prompt memoization and semantic deduplication.',
      'Awarded #1 Product of the Day on Product Hunt.'
    ],
    stack: ['React', 'Next.js', 'Node.js', 'Redis', 'Pinecone', 'Python', 'WebSockets', 'TailwindCSS']
  },
  vaultpay: {
    title: 'VaultPay — High-Frequency Fintech & Payments Gateway',
    tag: 'Fintech & Security',
    problem:
      'Payment transactions faced checkout drop-offs due to fragile multi-acquirer integrations, fraud detection latency spikes exceeding 600ms, and strict PCI-DSS Level 1 compliance mandates.',
    solution:
      'Developed a distributed payment orchestration engine with intelligent transaction routing, sub-millisecond fraud scoring using isolation trees, and an immutable ledger audit trail.',
    metrics: [
      'Facilitated $45M+ in processed transactions with 99.999% uptime.',
      'Cut fraud dispute rate from 0.8% down to 0.04%.',
      'Decreased checkout processing latency from 680ms to 95ms globally.'
    ],
    stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Kafka', 'Docker', 'AWS KMS', 'Redis']
  }
};

function initCaseStudyModal() {
  const modalOverlay = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggerBtns = document.querySelectorAll('[data-case-study]');

  if (!modalOverlay) return;

  function openModal(projectId) {
    const data = projectCaseStudies[projectId];
    if (!data) return;

    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalTag').textContent = data.tag;
    document.getElementById('modalProblem').textContent = data.problem;
    document.getElementById('modalSolution').textContent = data.solution;

    const metricsList = document.getElementById('modalMetrics');
    metricsList.innerHTML = '';
    data.metrics.forEach((m) => {
      const li = document.createElement('li');
      li.textContent = m;
      metricsList.appendChild(li);
    });

    const stackList = document.getElementById('modalStack');
    stackList.innerHTML = '';
    data.stack.forEach((tech) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tech;
      stackList.appendChild(span);
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-case-study');
      openModal(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. DEVELOPER TERMINAL / CLI PLAYGROUND
   ========================================================================== */
function initDeveloperTerminal() {
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  if (!input || !output) return;

  const commands = {
    help: `Available commands:
  - <span style="color: #778DA9;">about</span>        : Read engineer biography & background
  - <span style="color: #778DA9;">skills</span>       : List technical competencies & languages
  - <span style="color: #778DA9;">projects</span>     : Summary of featured high-impact systems
  - <span style="color: #778DA9;">theme</span>        : Inspect the Coolors palette configuration
  - <span style="color: #778DA9;">contact</span>      : Show direct contact methods
  - <span style="color: #778DA9;">clear</span>        : Clear the terminal console
  - <span style="color: #778DA9;">sudo hire-alex</span>: Launch confidential talent acquisition protocol`,

    about: `Alex Rivera is a Senior Full-Stack & Cloud Systems Architect with 6+ years of
experience architecting high-throughput distributed backends, resilient cloud topologies,
and ultra-responsive web experiences. Passionate about clean code, high reliability, and intuitive DX.`,

    skills: `Core Competencies:
  • Languages: TypeScript, JavaScript (ESNext), Go, Rust, Python, SQL
  • Frontend: React, Next.js, WebGL/Canvas, Modern CSS Architecture, State Machines
  • Backend: Node.js, Go Microservices, GraphQL, REST, gRPC, WebSockets
  • Infrastructure: Kubernetes, Docker, AWS (ECS, Lambda, CloudFront), Terraform, CI/CD
  • Storage & Message: PostgreSQL, Redis, Kafka, Elasticsearch, Pinecone`,

    projects: `Featured Systems:
  1. [Nexus Cloud]  Distributed infrastructure telemetry & K8s mesh orchestrator
  2. [NeuroFlow]    Autonomous node-based visual AI agent studio & graph engine
  3. [VaultPay]     Sub-100ms financial transaction router & fraud scoring matrix`,

    theme: `Active Design Tokens (Coolors Palette):
  • #0D1B2A  -  Rich Deep Space Navy (Base Background)
  • #1B263B  -  Oxford Navy (Card Surfaces & Elevated Modals)
  • #415A77  -  YinMn Slate Blue (Borders, Outlines, Structural Badges)
  • #778DA9  -  Shadow Blue (Secondary Typography, Subtle Highlights)
  • #E0E1DD  -  Platinum (High-Contrast Headlines & Focal Text)`,

    contact: `Direct Coordinates:
  • Email: alex.rivera.dev@example.com
  • GitHub: https://github.com/alexrivera-eng
  • LinkedIn: https://linkedin.com/in/alexrivera-architect
  • Availability: Immediate / Q4 Engineering Engagements`,

    'sudo hire-alex': `<span style="color: #4ade80;">
  [AUTHENTICATION SUCCESSFUL] 🚀
  -------------------------------------------------------------
  Candidate: Alex Rivera
  Status: Available for Staff / Senior Lead Engineering roles.
  Action: Scheduling priority introductory call.
  -------------------------------------------------------------
  Please send direct dispatch to alex.rivera.dev@example.com
  or use the interactive contact form below!
</span>`
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      if (!val) return;

      const cmdRow = document.createElement('div');
      cmdRow.className = 'terminal-line';
      cmdRow.innerHTML = `<span class="terminal-prompt-sym">➜ alex@portfolio:~$</span> ${escapeHTML(val)}`;
      output.appendChild(cmdRow);

      const normalized = val.toLowerCase();

      if (normalized === 'clear') {
        output.innerHTML = '';
      } else if (commands[normalized]) {
        const responseRow = document.createElement('div');
        responseRow.className = 'terminal-line';
        responseRow.innerHTML = commands[normalized];
        output.appendChild(responseRow);
      } else {
        const errorRow = document.createElement('div');
        errorRow.className = 'terminal-line';
        errorRow.style.color = '#ef4444';
        errorRow.textContent = `zsh: command not found: ${val}. Type 'help' for available commands.`;
        output.appendChild(errorRow);
      }

      input.value = '';
      output.scrollTop = output.scrollHeight;
    }
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

/* ==========================================================================
   7. CONTACT FORM & TOAST NOTIFICATIONS
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please complete all required fields.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending Message...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast('🚀 Thank you! Your message has been received. I will respond within 24 hours.', 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 900);
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ==========================================================================
   8. CLIPBOARD COPY
   ========================================================================== */
function initClipboardCopy() {
  const copyBtns = [document.getElementById('copyEmailBtn'), document.getElementById('copyEmailBtn2')].filter(Boolean);
  if (copyBtns.length === 0) return;

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = 'alex.rivera.dev@example.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalHTML = btn.innerHTML;
        btn.textContent = 'Copied!';
        btn.style.color = '#4ade80';
        showToast('📋 Email address copied to clipboard!');
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.color = '';
        }, 2000);
      }).catch(() => {
        showToast('Could not copy automatically. Email: ' + email);
      });
    });
  });
}

/* ==========================================================================
   9. NAVIGATION & ACTIVE SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 180;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileBtn && mobileOverlay) {
    mobileBtn.addEventListener('click', () => {
      mobileOverlay.classList.toggle('open');
      const isOpen = mobileOverlay.classList.contains('open');
      mobileBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
        mobileBtn.innerHTML = '☰';
      });
    });
  }
}

/* ==========================================================================
   10. LOCAL TIME DISPLAY
   ========================================================================== */
function initLocalTime() {
  const timeEl = document.getElementById('localTime');
  if (!timeEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timeEl.textContent = `${hours}:${minutes} (${tz.split('/')[1] || tz})`;
  }

  update();
  setInterval(update, 30000);
}
