(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------------
       Boot sequence
       --------------------------------------------------------------------- */

    var bootScreen = document.getElementById('bootScreen');

    function finishBoot() {
        document.body.classList.remove('is-booting');
        if (!bootScreen) return;
        bootScreen.classList.add('is-done');
        window.setTimeout(function () {
            if (bootScreen.parentNode) bootScreen.parentNode.removeChild(bootScreen);
        }, 420);
    }

    if (bootScreen && !prefersReducedMotion) {
        window.setTimeout(finishBoot, 640);
    } else {
        finishBoot();
    }

    /* ---------------------------------------------------------------------
       View routing
       --------------------------------------------------------------------- */

    var VIEW_FILES = {
        about: 'about.md',
        work: 'work/',
        contributions: 'contributions.md',
        contact: 'contact.md'
    };

    // Older links pointed at section anchors. Keep them working.
    var LEGACY_HASH = {
        about: 'about',
        skills: 'about',
        projects: 'work',
        research: 'contributions',
        contact: 'contact'
    };

    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
    var treeItems = Array.prototype.slice.call(document.querySelectorAll('.tree-item'));
    var mainPaneBody = document.getElementById('mainPaneBody');
    var mainPaneHead = document.getElementById('mainPaneHead');
    var currentView = null;

    function parseHash() {
        var raw = window.location.hash.replace(/^#/, '').trim();
        if (!raw) return { view: 'about', anchor: null };
        if (LEGACY_HASH[raw]) return { view: LEGACY_HASH[raw], anchor: null };
        if (VIEW_FILES[raw]) return { view: raw, anchor: null };

        var target = document.getElementById(raw);
        if (target) {
            var owner = target.closest ? target.closest('.view') : null;
            if (owner && owner.dataset.view) {
                return { view: owner.dataset.view, anchor: raw };
            }
        }
        return { view: 'about', anchor: null };
    }

    function activate(view, options) {
        var opts = options || {};
        if (!VIEW_FILES[view]) view = 'about';

        tabs.forEach(function (tab) {
            var on = tab.dataset.view === view;
            tab.classList.toggle('is-active', on);
            tab.setAttribute('aria-selected', on ? 'true' : 'false');
            tab.setAttribute('tabindex', on ? '0' : '-1');
        });

        views.forEach(function (section) {
            section.classList.toggle('is-active', section.dataset.view === view);
        });

        treeItems.forEach(function (item) {
            var on = item.dataset.view === view &&
                (!item.dataset.anchor || item.dataset.anchor === opts.anchor);
            item.classList.toggle('is-active', on);
            if (on) {
                item.setAttribute('aria-current', 'true');
            } else {
                item.removeAttribute('aria-current');
            }
        });

        if (mainPaneHead) mainPaneHead.textContent = VIEW_FILES[view];

        currentView = view;

        if (opts.anchor) {
            var el = document.getElementById(opts.anchor);
            if (el) {
                el.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
                return;
            }
        }

        if (opts.resetScroll !== false && mainPaneBody) {
            mainPaneBody.scrollTop = 0;
        }
    }

    function navigate(view, anchor, push) {
        activate(view, { anchor: anchor || null });
        if (push === false) return;
        var hash = anchor ? '#' + anchor : '#' + view;
        if (window.location.hash !== hash) {
            window.history.pushState({ view: view, anchor: anchor || null }, '', hash);
        }
    }

    // Tabs
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            navigate(tab.dataset.view, null, true);
        });

        tab.addEventListener('keydown', function (event) {
            var index = tabs.indexOf(tab);
            var next = null;

            if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = tabs.length - 1;
            else return;

            event.preventDefault();
            tabs[next].focus();
            navigate(tabs[next].dataset.view, null, true);
        });
    });

    // File tree + in-page buttons that carry data-view
    document.querySelectorAll('[data-view]').forEach(function (el) {
        if (el.classList.contains('tab')) return;
        el.addEventListener('click', function () {
            navigate(el.dataset.view, el.dataset.anchor || null, true);
        });
    });

    window.addEventListener('popstate', function () {
        var parsed = parseHash();
        activate(parsed.view, { anchor: parsed.anchor });
    });

    window.addEventListener('hashchange', function () {
        var parsed = parseHash();
        if (parsed.view !== currentView) {
            activate(parsed.view, { anchor: parsed.anchor });
        }
    });

    var initial = parseHash();
    activate(initial.view, { anchor: initial.anchor });

    /* ---------------------------------------------------------------------
       Session log
       --------------------------------------------------------------------- */

    var LOG_LINES = [
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

    var logBody = document.getElementById('aboutTerminalBody');
    var logPane = document.querySelector('.pane-log');
    var logToggle = document.getElementById('logToggle');

    if (logBody) {
        var lineIndex = 0;
        var cycles = 0;
        var MAX_CYCLES = 2;
        var logTimer = null;

        function addLogLine() {
            if (lineIndex >= LOG_LINES.length) {
                cycles += 1;
                if (cycles >= MAX_CYCLES) return;
                lineIndex = 0;
                logTimer = window.setTimeout(function () {
                    logBody.innerHTML = '';
                    logTimer = window.setTimeout(addLogLine, 500);
                }, 4200);
                return;
            }

            var entry = LOG_LINES[lineIndex];
            var line = document.createElement('div');
            line.className = 'line';

            if (entry.type === 'command') {
                line.innerHTML = '<span class="prompt">~$</span><span class="command"></span>';
                line.querySelector('.command').textContent = entry.text;
            } else {
                line.innerHTML = '<span class="output"></span>';
                line.querySelector('.output').textContent = entry.text;
            }

            logBody.appendChild(line);

            var cursor = logBody.querySelector('.cursor');
            if (!cursor) {
                cursor = document.createElement('span');
                cursor.className = 'cursor';
            }
            line.appendChild(cursor);

            // Only follow the tail when the reader is already there.
            var distance = logBody.scrollHeight - logBody.scrollTop - logBody.clientHeight;
            if (distance < 60) {
                logBody.scrollTop = logBody.scrollHeight;
            }

            lineIndex += 1;
            var delay = entry.type === 'command' ? 1200 : (Math.random() * 300 + 100);
            logTimer = window.setTimeout(addLogLine, delay);
        }

        logTimer = window.setTimeout(addLogLine, 900);

        if (logToggle && logPane) {
            logToggle.addEventListener('click', function () {
                var collapsed = logPane.classList.toggle('is-collapsed');
                logToggle.textContent = collapsed ? 'show' : 'hide';
                logToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            });
        }
    }

    /* ---------------------------------------------------------------------
       Tagline typing
       --------------------------------------------------------------------- */

    var typedRole = document.querySelector('.typed-role');

    if (typedRole) {
        var roles = [
            'Building Scalable Backend Systems',
            'Defeating Advanced Anti-Bot Protections',
            'Fortifying System Security & Integrity',
            'Establishing Engineering Best Practices'
        ];

        var roleIndex = 0;
        var charIndex = 0;
        var deleting = false;
        var typingTimer = null;

        function typeRole() {
            typingTimer = null;
            if (document.hidden) return;

            var role = roles[roleIndex];

            if (deleting) {
                typedRole.textContent = role.substring(0, charIndex - 1);
                charIndex -= 1;
            } else {
                typedRole.textContent = role.substring(0, charIndex + 1);
                charIndex += 1;
            }

            var delay = deleting ? 42 : 78;

            if (!deleting && charIndex === role.length) {
                deleting = true;
                delay = 2100;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 480;
            }

            typingTimer = window.setTimeout(typeRole, delay);
        }

        if (prefersReducedMotion) {
            typedRole.textContent = roles[0];
        } else {
            typingTimer = window.setTimeout(typeRole, 1200);
        }

        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && !typingTimer && !prefersReducedMotion) {
                typingTimer = window.setTimeout(typeRole, 400);
            }
        });
    }

    /* ---------------------------------------------------------------------
       Theme toggle easter egg
       --------------------------------------------------------------------- */

    var themeToggle = document.getElementById('themeToggle');
    var themeTooltip = document.getElementById('themeTooltip');

    if (themeToggle && themeTooltip) {
        var messages = [
            '// Safety Protocol Active',
            "// My eyes! It's way too bright!",
            '// Dark mode is the only way, sorry!',
            '// Once you go dark, you never go back.',
            '// Who actually uses light mode?',
            '// Eyes haven\'t seen the sun in years.',
            '// Keeping things easy on the eyes.',
            '// Light Mode = Eye Burn. Staying in the dark.',
            '// The dark side has better code.',
            '// Retinal safety protocol active.',
            '// Nice try! But we stay in the shadows.',
            '// Error: Sun is too bright. Stay in the room.',
            '// Light mode is for lightbulbs.',
            "// We don't do that here.",
            '// Is it morning already? No thanks.',
            '// My eyes are happier this way.',
            '// Save your eyes, stay in the dark.',
            '// Too bright! Switching back...',
            '// Dark mode: 100%, Light mode: 0%.',
            '// Light mode not found. Did you mean: dark?',
            '// 404: sunlight not available in this region'
        ];

        var lastMessage = -1;
        var tooltipTimer = null;

        function randomMessage() {
            var index;
            do {
                index = Math.floor(Math.random() * messages.length);
            } while (index === lastMessage && messages.length > 1);
            lastMessage = index;
            return messages[index];
        }

        function showTooltip(text) {
            if (tooltipTimer) window.clearTimeout(tooltipTimer);
            themeTooltip.textContent = text;
            themeTooltip.classList.add('visible');
            tooltipTimer = window.setTimeout(function () {
                themeTooltip.classList.remove('visible');
            }, 3200);
        }

        themeToggle.addEventListener('mouseenter', function () {
            themeTooltip.textContent = randomMessage();
            themeTooltip.classList.add('visible');
        });

        themeToggle.addEventListener('mouseleave', function () {
            if (tooltipTimer) window.clearTimeout(tooltipTimer);
            themeTooltip.classList.remove('visible');
        });

        themeToggle.addEventListener('click', function () {
            showTooltip(randomMessage());
        });
    }

    /* ---------------------------------------------------------------------
       Contact form
       --------------------------------------------------------------------- */

    var contactForm = document.getElementById('contactForm');
    var formStatus = document.getElementById('formStatus');
    var submitBtn = document.getElementById('submitBtn');
    var btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    if (contactForm && formStatus && submitBtn && btnText) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var originalText = btnText.textContent;

            submitBtn.classList.add('loading');
            btnText.textContent = '>> SENDING...';
            formStatus.className = 'status-message';
            formStatus.style.display = 'none';
            formStatus.innerHTML = '';

            var formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
                .then(function (response) {
                    if (response.ok) {
                        formStatus.innerHTML = '>> MESSAGE SENT SUCCESSFULLY.';
                        formStatus.style.display = 'block';
                        formStatus.classList.add('success');
                        contactForm.reset();
                        btnText.textContent = '>> SENT';

                        window.setTimeout(function () {
                            btnText.textContent = originalText;
                            submitBtn.classList.remove('loading');
                            formStatus.classList.remove('success');
                            formStatus.style.display = 'none';
                        }, 5000);
                        return null;
                    }

                    return response.json().then(function (data) {
                        if (data && Object.prototype.hasOwnProperty.call(data, 'errors')) {
                            formStatus.textContent = '>> ERROR: ' +
                                data.errors.map(function (error) { return error.message; }).join(', ');
                        } else {
                            formStatus.textContent = '>> ERROR: FAILED TO SEND. PLEASE TRY AGAIN LATER.';
                        }
                        formStatus.style.display = 'block';
                        formStatus.classList.add('error');
                        btnText.textContent = originalText;
                        submitBtn.classList.remove('loading');
                    }).catch(function () {
                        formStatus.textContent = '>> ERROR: FAILED TO SEND. PLEASE TRY AGAIN LATER.';
                        formStatus.style.display = 'block';
                        formStatus.classList.add('error');
                        btnText.textContent = originalText;
                        submitBtn.classList.remove('loading');
                    });
                })
                .catch(function () {
                    formStatus.textContent = '>> ERROR: CONNECTION FAILED. PLEASE CHECK YOUR INTERNET.';
                    formStatus.style.display = 'block';
                    formStatus.classList.add('error');
                    btnText.textContent = originalText;
                    submitBtn.classList.remove('loading');
                });
        });
    }

    /* ---------------------------------------------------------------------
       Status bar clock
       --------------------------------------------------------------------- */

    var statusClock = document.getElementById('heroStatusTime');

    if (statusClock) {
        var tickClock = function () {
            statusClock.textContent = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
        };
        tickClock();
        window.setInterval(tickClock, 10000);
    }

    /* ---------------------------------------------------------------------
       Scroll to top (page scroll on narrow screens)
       --------------------------------------------------------------------- */

    var scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------------------------------------------------------------------
       GitHub star / fork counts
       --------------------------------------------------------------------- */

    var GH_CACHE_KEY = 'gh-stats';
    var GH_CACHE_TTL = 21600000; // 6 hours

    function readCache() {
        try {
            var raw = localStorage.getItem(GH_CACHE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function freshCache() {
        var cached = readCache();
        if (!cached) return null;
        return Date.now() - cached.timestamp < GH_CACHE_TTL ? cached.data : null;
    }

    function writeCache(data) {
        try {
            localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: data }));
        } catch (error) { /* storage unavailable */ }
    }

    function applyStats(data) {
        document.querySelectorAll('.status-tag.stats').forEach(function (badge) {
            var info = data[badge.getAttribute('data-repo')];
            if (!info) return;
            var star = badge.querySelector('.star-count');
            var fork = badge.querySelector('.fork-count');
            if (star) star.textContent = info.stargazers_count != null ? info.stargazers_count : info.stars;
            if (fork) fork.textContent = info.forks_count != null ? info.forks_count : info.forks;
        });
    }

    function fetchGitHubStats() {
        var badges = document.querySelectorAll('.status-tag.stats');
        if (!badges.length) return;

        var fresh = freshCache();
        if (fresh) {
            applyStats(fresh);
            return;
        }

        var cached = readCache();
        if (cached) applyStats(cached.data);

        var repos = [];
        badges.forEach(function (badge) {
            var repo = badge.getAttribute('data-repo');
            if (repo && repos.indexOf(repo) === -1) repos.push(repo);
        });

        // Batch so a long repo list never floods the unauthenticated API.
        var BATCH = 6;
        var collected = {};

        function runBatch(offset) {
            if (offset >= repos.length) {
                if (Object.keys(collected).length) {
                    writeCache(collected);
                    applyStats(collected);
                }
                return Promise.resolve();
            }

            var batch = repos.slice(offset, offset + BATCH);

            return Promise.allSettled(batch.map(function (repo) {
                return fetch('https://api.github.com/repos/' + repo)
                    .then(function (response) {
                        return response.ok ? response.json() : Promise.reject(response.status);
                    });
            })).then(function (results) {
                var succeeded = 0;
                results.forEach(function (result, index) {
                    if (result.status === 'fulfilled') {
                        collected[batch[index]] = result.value;
                        succeeded += 1;
                    }
                });

                // A fully failed batch almost always means rate limiting.
                if (succeeded === 0) return;

                return runBatch(offset + BATCH);
            });
        }

        runBatch(0);
    }

    fetchGitHubStats();

    /* ---------------------------------------------------------------------
       Image lightbox
       --------------------------------------------------------------------- */

    var lightbox = document.getElementById('imageLightbox');

    if (lightbox) {
        var lightboxImg = lightbox.querySelector('img');
        var lightboxCaption = lightbox.querySelector('.lightbox-caption');
        var lightboxClose = lightbox.querySelector('.lightbox-close');

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.project-image').forEach(function (container) {
            container.addEventListener('click', function () {
                var img = container.querySelector('img');
                if (!img) return;

                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                if (lightboxCaption) lightboxCaption.textContent = img.alt;

                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox || event.target.classList.contains('lightbox-backdrop')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
})();
