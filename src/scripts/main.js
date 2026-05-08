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

    // Hacker Text Decipher Effect
    class HackerText {
        constructor(el) {
            this.el = el;
            this.originalText = el.innerText;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => (this.resolve = resolve));
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Dynamic Glitch Effect
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const hacker = new HackerText(heroTitle);
        let isGlitching = false;

        function triggerGlitchBurst() {
            if (isGlitching) return;
            isGlitching = true;
            
            heroTitle.classList.add('glitch-active');
            
            // Randomly trigger text deciphering
            if (Math.random() > 0.6) {
                hacker.setText(heroTitle.getAttribute('data-text') || heroTitle.innerText);
            }
            
            setTimeout(() => {
                heroTitle.classList.remove('glitch-active');
                isGlitching = false;
            }, 300 + Math.random() * 400);
        }
        
        // Random glitch bursts
        function scheduleGlitch() {
            const delay = 4000 + Math.random() * 6000;
            setTimeout(() => {
                if (Math.random() > 0.3) triggerGlitchBurst();
                scheduleGlitch();
            }, delay);
        }
        
        // Initial effect
        setTimeout(() => {
            hacker.setText(heroTitle.getAttribute('data-text') || heroTitle.innerText);
        }, 1200);

        setTimeout(scheduleGlitch, 3000);
        
        // Mouse triggers (throttled)
        let lastGlitch = 0;
        let mouseMoveRAF = null;
        document.addEventListener('mousemove', () => {
            if (mouseMoveRAF) return;
            mouseMoveRAF = requestAnimationFrame(() => {
                mouseMoveRAF = null;
                const now = Date.now();
                if (Math.random() > 0.95 && now - lastGlitch > 2000) {
                    triggerGlitchBurst();
                    lastGlitch = now;
                }
            });
        });
    }

    // Section Titles Hacker Effect
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length > 0) {
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const trigger = entry.target.querySelector('.hacker-trigger');
                    if (trigger) {
                        const hacker = new HackerText(trigger);
                        hacker.setText(trigger.innerText);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sectionTitles.forEach(title => observer.observe(title));
    }

        // Global Random Glitch Bursts
        const scanlines = document.querySelector('.scanlines');
        if (scanlines) {
            let glitchTimerId = null;
            
            function triggerGlobalGlitch() {
                if (document.hidden) {
                    // Don't glitch while tab is hidden; reschedule
                    glitchTimerId = setTimeout(triggerGlobalGlitch, 8000);
                    return;
                }
                
                // Apply intense glitch (scanlines only, no body filter)
                scanlines.classList.add('glitch-intense');
                document.body.classList.add('global-glitch-active');
                
                const duration = 150 + Math.random() * 250;
                
                setTimeout(() => {
                    scanlines.classList.remove('glitch-intense');
                    document.body.classList.remove('global-glitch-active');
                    
                    const nextBurst = 8000 + Math.random() * 15000;
                    glitchTimerId = setTimeout(triggerGlobalGlitch, nextBurst);
                }, duration);
            }
            
            glitchTimerId = setTimeout(triggerGlobalGlitch, 5000);
        }

    // Hero Typing Effect
    const typedRoleElement = document.querySelector('.typed-role');
    if (typedRoleElement) {
        const roles = [
            "Building Scalable Backend Systems",
            "Defeating Advanced Anti-Bot Protections",
            "Continuous Learner",
            "Fortifying System Security & Integrity",
            "Establishing Engineering Best Practices"
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
            columns = Math.floor(canvas.width / fontSize);
            if (drops.length < columns) {
                while (drops.length < columns) {
                    drops.push(Math.random() * -100);
                }
            } else {
                drops.length = columns;
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

            const activeCursor = terminalBody.querySelector('.cursor') || document.createElement('span');
            if (!activeCursor.parentElement) {
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

    // Theme Toggle Easter Egg (Anti-Light Mode Protocol)
    const themeToggle = document.getElementById('themeToggle');
    const themeTooltip = document.getElementById('themeTooltip');
    if (themeToggle && themeTooltip) {
        const darkMessages = [
            "My eyes! It's way too bright!",
            "Dark mode is the only way, sorry!",
            "Once you go dark, you never go back.",
            "Who actually uses light mode?",
            "Eyes haven't seen the sun in years.",
            "Keeping things easy on the eyes.",
            "Wait, you actually like the color white?",
            "Light Mode = Eye Burn. Staying in the dark.",
            "The dark side has better code.",
            "Retinal safety protocol active.",
            "Nice try! But we stay in the shadows.",
            "Error: Sun is too bright. Stay in the room.",
            "Light mode is for lightbulbs.",
            "We don't do that here.",
            "Is it morning already? No thanks.",
            "My eyes are happier this way.",
            "Save your eyes, stay in the dark.",
            "Too bright! Switching back...",
            "Dark mode: 100%, Light mode: 0%."
        ];

        let lastMsgIndex = -1;

        const updateMessage = () => {
            let randomIdx;
            // Ensure we don't pick the same message twice in a row
            do {
                randomIdx = Math.floor(Math.random() * darkMessages.length);
            } while (randomIdx === lastMsgIndex);
            
            lastMsgIndex = randomIdx;
            themeTooltip.textContent = `# ${darkMessages[randomIdx]}`;
        };

        themeToggle.addEventListener('mouseenter', updateMessage);
        
        themeToggle.addEventListener('click', () => {
            updateMessage();
            themeTooltip.classList.add('error-pulse');
            setTimeout(() => {
                themeTooltip.classList.remove('error-pulse');
            }, 600);
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    if (contactForm && formStatus && submitBtn && btnText) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // UI Feedback: Loading State (Scanner Effect)
            submitBtn.classList.add('loading');
            const originalText = btnText.textContent;
            btnText.textContent = ">> SENDING...";
            formStatus.className = 'status-message';
            formStatus.style.display = 'none';
            formStatus.innerHTML = "";

            const formData = new FormData(contactForm);
            
            // Slight delay for smooth transitions
            await new Promise(resolve => setTimeout(resolve, 800));

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success State: Plain English
                    const successIcon = `
                        <span class="success-icon-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                <polyline points="9 11 12 14 15 9"></polyline>
                            </svg>
                        </span>
                    `;
                    
                    formStatus.innerHTML = `${successIcon} >> MESSAGE SENT SUCCESSFULLY.`;
                    formStatus.style.display = 'block';
                    formStatus.classList.add('success');
                    contactForm.reset();
                    btnText.textContent = ">> SENT";
                    
                    // Reset button after 5 seconds
                    setTimeout(() => {
                        btnText.textContent = originalText;
                        submitBtn.classList.remove('loading');
                        formStatus.classList.remove('success');
                        formStatus.style.display = 'none';
                    }, 5000);
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.textContent = ">> ERROR: " + data.errors.map(error => error.message).join(", ");
                    } else {
                        formStatus.textContent = ">> ERROR: FAILED TO SEND. PLEASE TRY AGAIN LATER.";
                    }
                    formStatus.style.display = 'block';
                    formStatus.classList.add('error');
                    btnText.textContent = originalText;
                    submitBtn.classList.remove('loading');
                }
            } catch (error) {
                formStatus.textContent = ">> ERROR: CONNECTION FAILED. PLEASE CHECK YOUR INTERNET.";
                formStatus.style.display = 'block';
                formStatus.classList.add('error');
                btnText.textContent = originalText;
                submitBtn.classList.remove('loading');
            }
        });
    }
})();
