(function() {
    'use strict';

    // Page Initialization Logic (Matrix -> Glitch Reveal)
    const glitchOverlay = document.getElementById('glitchOverlay');
    
    if (glitchOverlay) {
        // Trigger interference flash immediately
        setTimeout(() => {
            glitchOverlay.classList.add('glitch-flash');
            
            // Fast reveal
            setTimeout(() => {
                document.body.classList.remove('loading');
                
                // Final cleanup of overlay
                setTimeout(() => {
                    glitchOverlay.style.display = 'none';
                }, 1000);
            }, 300);
        }, 100); 
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Hero Typing Effect
    const typedRoleElement = document.querySelector('.typed-role');
    if (typedRoleElement) {
        const roles = [
            "Building Scalable Backend Systems",
            "Defeating Advanced Anti-Bot Protections",
            "Architecting Distributed Systems",
            "Fortifying System Security & Integrity",
            "Optimizing High-Concurrency Performance",
            "Open Source Engineer"
        ];
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        
        function typeRole() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typedRoleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50; // Faster deleting
            } else {
                typedRoleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100; // Normal typing speed
            }
            
            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingDelay = 2000; // Pause at the end of typing
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingDelay = 500; // Pause before typing new word
            }
            
            setTimeout(typeRole, typingDelay);
        }
        
        // Start typing effect after reveal has stabilized
        setTimeout(typeRole, 2000); 
    }

    // Matrix Rain Effect
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
        const fontSize = 14;
        let columns = canvas.width / fontSize;
        let drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            columns = canvas.width / fontSize;
            while (drops.length < columns) {
                drops.push(Math.random() * -100);
            }
        });

        function drawMatrix() {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const rootStyle = getComputedStyle(document.documentElement);
            const phosphorColor = rootStyle.getPropertyValue('--accent-primary').trim() || '#00ff88';
            ctx.fillStyle = phosphorColor;
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 35);
    }

    // Terminal Animation
    const terminalLines = [
        { type: 'command', text: 'docker-compose up -d --build backend-services' },
        { type: 'output', text: '[+] Running 6/6' },
        { type: 'output', text: ' ✔ Container postgres-cluster    Started' },
        { type: 'output', text: ' ✔ Container redis-cache         Started' },
        { type: 'output', text: ' ✔ Container rabbitmq-broker     Started' },
        { type: 'output', text: ' ✔ Container celery-workers      Started' },
        { type: 'output', text: ' ✔ Container prometheus-monitor  Started' },
        { type: 'output', text: ' ✔ Container fastapi-gateway     Started' },
        { type: 'command', text: 'alembic upgrade head' },
        { type: 'output', text: 'INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.' },
        { type: 'output', text: 'INFO  [alembic.runtime.migration] Will assume transactional DDL.' },
        { type: 'output', text: 'INFO  [alembic.runtime.migration] Running upgrade e3f12b -> f42a91, added_user_auth' },
        { type: 'output', text: 'INFO  [alembic.runtime.migration] Running upgrade f42a91 -> d81c4e, index_product_prices' },
        { type: 'command', text: 'uvicorn fingrasp.main:app --host 0.0.0.0 --port 8000 --workers 4' },
        { type: 'output', text: '[SYS] Booting FastAPI async engine (version 0.109.0)...' },
        { type: 'output', text: '[SYS] Loading security middleware: OAuth2, Fingerprint-Shield' },
        { type: 'output', text: '[SYS] REST & WebSocket gateways mounted securely' },
        { type: 'output', text: 'INFO:     Started server process [29481]' },
        { type: 'output', text: 'INFO:     Waiting for application startup.' },
        { type: 'output', text: 'INFO:     Application startup complete.' },
        { type: 'command', text: 'python scraper_bot.py --stealth --mode distributed --target store-grid' },
        { type: 'output', text: '[BOT] Init Playwright headless context (Chrome/146)...' },
        { type: 'output', text: '[BOT] Spoofing navigator.webdriver and RTC properties' },
        { type: 'output', text: '[BOT] Proxy rotation: US-EAST-1 residential pool active' },
        { type: 'output', text: '[BOT] Scrape initiated: target=E-commerce_Grid_v3' },
        { type: 'output', text: '[BOT] Extracting live DOM... syncing with Kafka stream: Done' },
        { type: 'command', text: 'celery -A worker_process.tasks status' },
        { type: 'output', text: ' -> celery@worker_cluster_01: OK' },
        { type: 'output', text: ' -> celery@worker_cluster_02: OK' },
        { type: 'command', text: 'pytest -v tests/' },
        { type: 'output', text: '[PASS] tests/api/test_rate_limiter.py' },
        { type: 'output', text: '[PASS] tests/security/test_anti_detection.py' },
        { type: 'output', text: '[PASS] tests/test_whatsapp_monitor.py' },
        { type: 'output', text: '[PASS] tests/test_human_typing_markov.py' },
        { type: 'output', text: '[PASS] tests/test_product_price_tracker.py' },
        { type: 'output', text: '[PASS] tests/integration/test_kafka_pipeline.py' },
        { type: 'output', text: '============ 68 passed, 2 skipped in 18.52s ============' },
        { type: 'command', text: 'tail -n 5 logs/system_health.log' },
        { type: 'output', text: '2026-04-18 10:22:15 [INFO] Memory usage: 42%' },
        { type: 'output', text: '2026-04-18 10:22:18 [INFO] Request throughput: 1.2k req/sec' },
        { type: 'output', text: '2026-04-18 10:22:20 [INFO] All nodes reporting healthy' }
    ];

    let lineIndex = 0;
    const terminalBody = document.getElementById('aboutTerminalBody');

    if (terminalBody) {
        function addTerminalLine() {
            if (lineIndex >= terminalLines.length) {
                lineIndex = 0;
                setTimeout(() => {
                    terminalBody.innerHTML = '';
                    setTimeout(addTerminalLine, 500);
                }, 4000);
                return;
            }

            const line = terminalLines[lineIndex];
            const div = document.createElement('div');
            div.className = 'line';
            div.style.animationDelay = '0s';

            if (line.type === 'command') {
                div.innerHTML = `<span class="prompt">~$</span> <span class="command">${line.text}</span>`;
            } else {
                div.innerHTML = `<span class="output">${line.text}</span>`;
            }

            terminalBody.appendChild(div);

            let activeCursor = terminalBody.querySelector('.cursor');
            if (!activeCursor) {
                activeCursor = document.createElement('span');
                activeCursor.className = 'cursor';
            }
            div.appendChild(activeCursor);

            // Only auto-scroll if the user is already at the bottom (or very close to it)
            const threshold = 60; // pixels
            const isAtBottom = terminalBody.scrollHeight - terminalBody.scrollTop - terminalBody.clientHeight < threshold;

            if (isAtBottom) {
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }

            lineIndex++;
            const delay = line.type === 'command' ? 1200 : (Math.random() * 300 + 100);
            setTimeout(addTerminalLine, delay);
        }

        setTimeout(addTerminalLine, 1000);
    }

    // Cursor Trail
    const trail = document.querySelector('.cursor-trail');
    const dot = document.querySelector('.cursor-dot');
    if (trail && dot) {
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            dot.style.left = mouseX - 10 + 'px';
            dot.style.top = mouseY - 10 + 'px';
        });

        function animateCursor() {
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;
            
            trail.style.left = trailX - 4 + 'px';
            trail.style.top = trailY - 4 + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }
})();
