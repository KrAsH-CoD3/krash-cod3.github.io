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

        function triggerVisualGlitch() {
            if (isGlitching) return;
            isGlitching = true;
            
            heroTitle.classList.add('glitch-active');
            
            setTimeout(() => {
                heroTitle.classList.remove('glitch-active');
                isGlitching = false;
            }, 200 + Math.random() * 200);
        }
        
        function triggerDecipher() {
            if (isGlitching) return;
            isGlitching = true;
            
            heroTitle.classList.add('glitch-active');
            hacker.setText(heroTitle.getAttribute('data-text') || heroTitle.innerText);
            
            setTimeout(() => {
                heroTitle.classList.remove('glitch-active');
                isGlitching = false;
            }, 500);
        }
        
        function scheduleBurst() {
            const delay = 2500 + Math.random() * 5500;
            setTimeout(() => {
                if (!document.hidden) {
                    if (Math.random() < 0.5) {
                        triggerDecipher();
                    } else {
                        triggerVisualGlitch();
                    }
                }
                scheduleBurst();
            }, delay);
        }
        
        // Initial effect
        setTimeout(() => {
            hacker.setText(heroTitle.getAttribute('data-text') || heroTitle.innerText);
            setTimeout(scheduleBurst, 3000);
        }, 1200);
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



    // Hero Typing Effect (pauses when hero not visible)
    const typedRoleElement = document.querySelector('.typed-role');
    if (typedRoleElement) {
        const roles = [
            "Building Scalable Backend Systems",
            "Defeating Advanced Anti-Bot Protections",
            "Fortifying System Security & Integrity",
            "Establishing Engineering Best Practices",
        ];
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        let typingTimerId = null;
        let heroVisible = true;
        
        // Pause typing when hero scrolls out of view
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const typingObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    heroVisible = entry.isIntersecting;
                    if (heroVisible && !typingTimerId) {
                        typingTimerId = setTimeout(typeRole, typingDelay);
                    }
                });
            }, { threshold: 0 });
            typingObserver.observe(heroSection);
        }
        
        function typeRole() {
            typingTimerId = null;
            if (!heroVisible || document.hidden) {
                return;
            }
            
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typedRoleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50;
            } else {
                typedRoleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }
            
            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingDelay = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingDelay = 500;
            }
            
            typingTimerId = setTimeout(typeRole, typingDelay);
        }
        
        // Resume typing when tab becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && heroVisible && !typingTimerId) {
                typingTimerId = setTimeout(typeRole, typingDelay);
            }
        });
        
        // Start typing effect after reveal has stabilized
        typingTimerId = setTimeout(typeRole, 2000); 
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
        { type: 'output', text: '[BOT] Spoofing all web browser FPs' },
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
    let terminalCycles = 0;
    const MAX_TERMINAL_CYCLES = 2; // Stop looping after 2 full cycles
    const terminalBody = document.getElementById('aboutTerminalBody');

    if (terminalBody) {
        let terminalTimer = null;
        let terminalVisible = false;
        
        // Only run terminal animation when visible
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                terminalVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });
        terminalObserver.observe(terminalBody);
        
        function addTerminalLine() {
            if (lineIndex >= terminalLines.length) {
                terminalCycles++;
                if (terminalCycles >= MAX_TERMINAL_CYCLES) {
                    // Stop looping — leave final state visible
                    return;
                }
                lineIndex = 0;
                terminalTimer = setTimeout(() => {
                    terminalBody.innerHTML = '';
                    terminalTimer = setTimeout(addTerminalLine, 500);
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
            terminalTimer = setTimeout(addTerminalLine, delay);
        }
        
        terminalTimer = setTimeout(addTerminalLine, 1000);
    }



    // Multi-line terminal typewriter
    let typewriterTimer = null;
    function typeLines(el, lines, cb) {
        if (typewriterTimer) {
            clearInterval(typewriterTimer);
            typewriterTimer = null;
        }
        el.innerHTML = '';
        el.classList.add('visible');
        let lineIdx = 0;
        let charIdx = 0;

        function typeLine() {
            if (lineIdx >= lines.length) {
                if (cb) setTimeout(cb, 3000);
                return;
            }
            const line = lines[lineIdx];
            // render all lines so far + current line being typed
            let html = '';
            for (let i = 0; i < lineIdx; i++) {
                html += lines[i] + '<br>';
            }
            html += line.substring(0, charIdx + 1) + '<span class="terminal-cursor">█</span>';
            el.innerHTML = html;

            charIdx++;
            if (charIdx < line.length) {
                typewriterTimer = setTimeout(typeLine, 20 + Math.random() * 15);
            } else {
                // line complete — pause, then next line
                lineIdx++;
                charIdx = 0;
                typewriterTimer = setTimeout(typeLine, 350 + Math.random() * 200);
            }
        }

        typeLine();
    }

    // Terminal scan on page load — hints at easter egg
    setTimeout(() => {
        const tt = document.getElementById('themeTooltip');
        if (tt) {
            const hex = Array.from({length: 8}, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
            typeLines(tt, [
                '> unknown entity detected',
                '> interact? [Y/n] >_'
            ], () => tt.classList.remove('visible'));
        }
    }, 2800);

    // Theme Toggle Easter Egg (Anti-Light Mode Protocol)
    const themeToggle = document.getElementById('themeToggle');
    const themeTooltip = document.getElementById('themeTooltip');
    if (themeToggle && themeTooltip) {
        const darkMessages = [
            "// Safety Protocol Active",
            "// My eyes! It's way too bright!",
            "// Dark mode is the only way, sorry!",
            "// Once you go dark, you never go back.",
            "// Who actually uses light mode?",
            "// Eyes haven't seen the sun in years.",
            "// Keeping things easy on the eyes.",
            "// Light Mode = Eye Burn. Staying in the dark.",
            "// The dark side has better code.",
            "// Retinal safety protocol active.",
            "// Nice try! But we stay in the shadows.",
            "// Error: Sun is too bright. Stay in the room.",
            "// Light mode is for lightbulbs.",
            "// We don't do that here.",
            "// Is it morning already? No thanks.",
            "// My eyes are happier this way.",
            "// Save your eyes, stay in the dark.",
            "// Too bright! Switching back...",
            "// Dark mode: 100%, Light mode: 0%.",
            "// Light mode not found. Did you mean: dark?",
            "// 404: sunlight not available in this region"
        ];

        let lastMsgIndex = -1;

        const getRandomMessage = () => {
            let randomIdx;
            do {
                randomIdx = Math.floor(Math.random() * darkMessages.length);
            } while (randomIdx === lastMsgIndex);
            lastMsgIndex = randomIdx;
            return darkMessages[randomIdx];
        };

        themeToggle.addEventListener('mouseenter', () => {
            themeTooltip.textContent = getRandomMessage();
        });

        themeToggle.addEventListener('click', () => {
            // Brief icon scramble
            themeToggle.classList.add('toggle-glitch');
            setTimeout(() => themeToggle.classList.remove('toggle-glitch'), 400);

            const msg = getRandomMessage();
            typeLines(themeTooltip, [
                '> breach detected',
                msg
            ], () => {
                themeTooltip.classList.remove('visible');
            });
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
                    // Success State
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

    // Hero Status Clock
    const statusTime = document.getElementById('heroStatusTime');
    if (statusTime) {
        function updateStatusTime() {
            const now = new Date();
            statusTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
        }
        updateStatusTime();
        setInterval(updateStatusTime, 10000);
    }

    // Scroll Progress Indicator
    const progress = document.getElementById('scrollProgress');
    if (progress) {
        window.addEventListener('scroll', () => {
            const val = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            progress.style.transform = `scaleX(${val})`;
        }, { passive: true });
    }

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // GitHub Live Star & Fork Counts
    const GH_CACHE_KEY = 'gh-stats';
    const GH_CACHE_TTL = 3600000; // 1 hour

    function getFreshCache() {
        try {
            const raw = localStorage.getItem(GH_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.timestamp < GH_CACHE_TTL) return parsed.data;
            return null;
        } catch { return null; }
    }

    function getStaleCache() {
        try {
            const raw = localStorage.getItem(GH_CACHE_KEY);
            return raw ? JSON.parse(raw).data : null;
        } catch { return null; }
    }

    function setCachedStats(data) {
        try {
            localStorage.setItem(GH_CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data
            }));
        } catch {}
    }

    function applyStats(data) {
        const badges = document.querySelectorAll('.status-tag.stats');
        badges.forEach(badge => {
            const repo = badge.getAttribute('data-repo');
            const info = data[repo];
            if (!info) return;
            const star = badge.querySelector('.star-count');
            const fork = badge.querySelector('.fork-count');
            if (star) star.textContent = info.stargazers_count ?? info.stars;
            if (fork) fork.textContent = info.forks_count ?? info.forks;
        });
    }

    async function fetchGitHubStats() {
        const badges = document.querySelectorAll('.status-tag.stats');
        if (!badges.length) return;

        // Fresh cache — skip API call entirely
        const fresh = getFreshCache();
        if (fresh) {
            applyStats(fresh);
            return;
        }

        // Stale cache — show it while fetching in background
        const stale = getStaleCache();
        if (stale) applyStats(stale);

        // Fetch only when cache is missing or expired
        const repos = [...new Set(Array.from(badges).map(b => b.getAttribute('data-repo')).filter(Boolean))];
        const results = await Promise.allSettled(
            repos.map(repo =>
                fetch(`https://api.github.com/repos/${repo}`)
                    .then(r => r.ok ? r.json() : Promise.reject(r.status))
            )
        );

        const data = {};
        results.forEach((res, i) => {
            if (res.status === 'fulfilled') data[repos[i]] = res.value;
        });

        if (Object.keys(data).length) {
            setCachedStats(data);
            applyStats(data);
        }
    }

    fetchGitHubStats();

    // Scroll-Triggered Fade-In Reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .skills-category, .research-card, .timeline-item').forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });
})();
