(function() {
    'use strict';

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
        { type: 'output', text: '[+] Running 4/4' },
        { type: 'output', text: ' ✔ Container postgres-cluster  Started' },
        { type: 'output', text: ' ✔ Container redis-cache       Started' },
        { type: 'output', text: ' ✔ Container celery-workers    Started' },
        { type: 'output', text: ' ✔ Container fastapi-gateway   Started' },
        { type: 'command', text: 'uvicorn fingrasp.main:app --workers 4' },
        { type: 'output', text: '[SYS] Booting FastAPI async engine...' },
        { type: 'output', text: '[SYS] REST & WebSocket gateways mounted securely' },
        { type: 'command', text: 'python scraper_bot.py --stealth --target all' },
        { type: 'output', text: '[BOT] Init Playwright headless context (Chrome/146)' },
        { type: 'output', text: '[BOT] Extracting live DOM... syncing with Kafka: Done' },
        { type: 'command', text: 'pytest -v tests/' },
        { type: 'output', text: '[PASS] tests/api/test_rate_limiter.py' },
        { type: 'output', text: '[PASS] tests/test_whatsapp_monitor.py' },
        { type: 'output', text: '[PASS] tests/test_human_typing_markov.py' },
        { type: 'output', text: '[PASS] tests/test_product_price_tracker.py' },
        { type: 'output', text: '============ 43 passed in 12.04s ============' }
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

            terminalBody.scrollTop = terminalBody.scrollHeight;

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
