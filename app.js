document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CLIENT-SIDE SPA ROUTER
       ========================================================================== */
    const navItemsDesktop = document.querySelectorAll('#main-nav-desktop .nav-item');
    const navItemsMobile = document.querySelectorAll('#main-nav-mobile .mobile-nav-item');
    const spaPages = document.querySelectorAll('.spa-page');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');

    function navigateToPage(targetId) {
        if (targetId === 'pricing') {
            targetId = 'services';
            setTimeout(() => {
                const elTarget = document.getElementById('pricing');
                if (elTarget) {
                    elTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }

        // Find if targetId exists as a page section
        let targetPage = document.getElementById(`page-${targetId}`);
        if (!targetPage) {
            targetId = 'home';
            targetPage = document.getElementById(`page-${targetId}`);
        }
        if (!targetPage) return;

        // Update URL hash
        if (window.location.hash !== `#${targetId}`) {
            window.location.hash = targetId;
        }

        // Close mobile nav menu if open
        if (mobileMenu.classList.contains('open')) {
            toggleMobileMenu();
        }

        // Deactivate all sections and activate target page
        spaPages.forEach(page => {
            page.classList.remove('active');
            if (page !== targetPage) {
                page.querySelectorAll('video').forEach(v => {
                    try { v.pause(); } catch(e) {}
                });
                page.querySelectorAll('iframe.macbook-screen-content').forEach(f => {
                    try {
                        f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
                    } catch(e) {}
                });
            }
        });
        targetPage.classList.add('active');

        // Play videos and YouTube iframes on the newly active page
        targetPage.querySelectorAll('video').forEach(v => {
            v.muted = true;
            v.playbackRate = 2.0;
            if (!v.classList.contains('hero-macbook-video') || v.classList.contains('active')) {
                const playPromise = v.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            }
        });
        targetPage.querySelectorAll('iframe.macbook-screen-content').forEach(f => {
            try {
                f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
                f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [2] }), '*');
            } catch(e) {}
        });

        // Update active class on desktop navigation items
        navItemsDesktop.forEach(item => {
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update active class on mobile navigation items
        navItemsMobile.forEach(item => {
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Scroll to top of window with smooth animation (unless pricing was requested)
        if (window.location.hash !== '#pricing') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Router Listener for URL Hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        navigateToPage(hash);
    });

    // Initialize SPA navigation
    const initialHash = window.location.hash.replace('#', '') || 'home';
    navigateToPage(initialHash);

    // Global delegation for hash-based SPA routing links and in-page smooth scroll
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            const href = anchor.getAttribute('href');
            if (href.startsWith('#')) {
                const target = href.replace('#', '');
                if (target === 'pricing') {
                    e.preventDefault();
                    navigateToPage('services');
                    setTimeout(() => {
                        const elTarget = document.getElementById('pricing');
                        if (elTarget) {
                            elTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 250);
                    return;
                }
                const pageTarget = document.getElementById(`page-${target}`);
                if (pageTarget) {
                    e.preventDefault();
                    navigateToPage(target);
                } else {
                    const elTarget = document.getElementById(target);
                    if (elTarget) {
                        e.preventDefault();
                        elTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    });


    /* ==========================================================================
       2. MOBILE MENU & HEADER EFFECTS
       ========================================================================== */
    const siteHeader = document.getElementById('site-header');

    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            mobileMenu.classList.remove('open');
            menuToggleBtn.classList.remove('open');
            // Reset hamburger bars
            document.querySelector('.bar-1').style.transform = 'none';
            document.querySelector('.bar-2').style.opacity = '1';
            document.querySelector('.bar-3').style.transform = 'none';
        } else {
            mobileMenu.classList.add('open');
            menuToggleBtn.classList.add('open');
            // Animate hamburger to X
            document.querySelector('.bar-1').style.transform = 'translateY(8px) rotate(45deg)';
            document.querySelector('.bar-2').style.opacity = '0';
            document.querySelector('.bar-3').style.transform = 'translateY(-8px) rotate(-45deg)';
        }
    }

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', toggleMobileMenu);
    }

    const mobileCtaBtn = document.getElementById('mobile-cta-btn');
    if (mobileCtaBtn) {
        mobileCtaBtn.addEventListener('click', () => {
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    }

    // Scroll listener for sticky header background opacity
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    });


    /* ==========================================================================
       3. INTERACTIVE CLUB SOLUTION MATCHER TABS (SERVICES PAGE)
       ========================================================================== */
    const matcherTabBtns = document.querySelectorAll('.matcher-tab-btn');
    const matcherPanes = document.querySelectorAll('.matcher-pane');

    if (matcherTabBtns.length > 0) {
        matcherTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const sport = btn.getAttribute('data-sport');
                if (!sport) return;

                matcherTabBtns.forEach(b => b.classList.remove('active'));
                matcherPanes.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const targetPane = document.getElementById(`matcher-pane-${sport}`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    // Main Contact Form (Integrated with Web3Forms)
    const mainContactForm = document.getElementById('main-contact-form');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');
    const contactSuccess = document.getElementById('contact-success');
    const resetContactBtn = document.getElementById('reset-contact-btn');
    const noteInput = document.getElementById('c-note');
    const noteCounter = document.getElementById('c-note-counter');

    // Web3Forms API Key
    const WEB3FORMS_ACCESS_KEY = '7df46c2e-37f1-4796-bdef-219840e575fe';

    if (noteInput && noteCounter) {
        noteInput.addEventListener('input', () => {
            noteCounter.textContent = `${noteInput.value.length} / 1000`;
        });
    }

    if (mainContactForm) {
        mainContactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if key is configured
            if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
                alert('Please configure your Web3Forms Access Key in app.js to receive inquiries on your email!');
                return;
            }

            const originalBtnText = contactSubmitBtn ? contactSubmitBtn.textContent : 'Send Inquiries';
            if (contactSubmitBtn) {
                contactSubmitBtn.disabled = true;
                contactSubmitBtn.textContent = 'Sending Inquiry...';
            }

            try {
                const formData = new FormData(mainContactForm);
                formData.append('access_key', WEB3FORMS_ACCESS_KEY);
                formData.append('subject', 'New Sports Club Inquiry - WebXHere Studio');
                formData.append('from_name', 'WebXHere Studio Website');

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    contactSuccess.classList.add('show');
                    mainContactForm.reset();
                    if (noteCounter) noteCounter.textContent = '0 / 1000';
                } else {
                    alert('Submission failed: ' + (result.message || 'Please try again.'));
                }
            } catch (err) {
                console.error('Contact form submission error:', err);
                alert('Network error while sending inquiry. Please check your internet connection.');
            } finally {
                if (contactSubmitBtn) {
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.textContent = originalBtnText;
                }
            }
        });
    }

    if (resetContactBtn) {
        resetContactBtn.addEventListener('click', () => {
            contactSuccess.classList.remove('show');
            if (mainContactForm) mainContactForm.reset();
            if (noteCounter) noteCounter.textContent = '0 / 1000';
        });
    }


    /* ==========================================================================
       10. FAQ ACCORDION INTERACTIVES
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = question.nextElementSibling;
            
            const isOpen = faqItem.classList.contains('open');
            
            // Close FAQ items in the same container
            const container = question.closest('.faq-accordion-container') || document;
            container.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
                const ans = item.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = '0px';
            });

            if (!isOpen) {
                faqItem.classList.add('open');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });

    /* ==========================================================================
       11. HERO SCREEN PREVIEW SWITCHER & LAPTOP MOCKUP CONTROLLER
       ========================================================================== */
    const heroTabBtns = document.querySelectorAll('.hero-tab-btn');
    const heroMockupScreen = document.getElementById('hero-macbook-screen');
    const heroVideos = {
        chess: document.getElementById('hero-vid-chess') || document.getElementById('hero-yt-chess'),
        tennis: document.getElementById('hero-vid-tennis') || document.getElementById('hero-yt-tennis'),
        badminton: document.getElementById('hero-vid-badminton') || document.getElementById('hero-yt-badminton')
    };

    function sendYtCommand(iframe, func, args) {
        if (!iframe || !iframe.contentWindow) return;
        try {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: func,
                args: args || []
            }), '*');
        } catch (e) {}
    }

    if (heroTabBtns.length > 0) {
        heroTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;
                
                const dashboard = btn.getAttribute('data-dashboard');
                const targetMedia = heroVideos[dashboard];
                
                if (targetMedia) {
                    // Switch active tab styling
                    heroTabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Adjust hero screen aspect ratio attribute for calibrated ratio
                    if (heroMockupScreen) {
                        heroMockupScreen.setAttribute('data-active', dashboard);
                    }

                    // Switch active video/media smoothly
                    Object.keys(heroVideos).forEach(key => {
                        const media = heroVideos[key];
                        if (media) {
                            if (key === dashboard) {
                                media.classList.add('active');
                                if (media.tagName === 'VIDEO') {
                                    media.muted = true;
                                    media.playbackRate = 2.0;
                                    if (key === 'chess' && media.currentTime < 5.5) {
                                        media.currentTime = 5.5;
                                    }
                                    const p = media.play();
                                    if (p !== undefined) p.catch(() => {});
                                } else {
                                    sendYtCommand(media, 'playVideo');
                                    sendYtCommand(media, 'setPlaybackRate', [2]);
                                }
                            } else {
                                media.classList.remove('active');
                                if (media.tagName === 'VIDEO') {
                                    try { media.pause(); } catch(e) {}
                                } else {
                                    sendYtCommand(media, 'pauseVideo');
                                }
                            }
                        }
                    });
                }
            });
        });
    }

    // Configure 2.0x video playback speed and chess start time skipping (starts directly from 6th sec)
    function setupVideoPlayback() {
        document.querySelectorAll('video').forEach(vid => {
            vid.muted = true;
            vid.playbackRate = 2.0;
            vid.addEventListener('play', () => { vid.playbackRate = 2.0; });
            vid.addEventListener('loadedmetadata', () => { vid.playbackRate = 2.0; });
            vid.addEventListener('ratechange', () => {
                if (vid.playbackRate !== 2.0) vid.playbackRate = 2.0;
            });
        });

        // Chess video: skip first 5.5s so direct 6th second is shown, and loop back to 5.5s
        const chessVideos = document.querySelectorAll('video[data-dashboard="chess"], video.chess-start-video, #hero-vid-chess');
        chessVideos.forEach(vid => {
            const setChessTime = () => {
                if (vid.currentTime < 5.5) vid.currentTime = 5.5;
            };
            vid.addEventListener('loadedmetadata', setChessTime);
            vid.addEventListener('timeupdate', () => {
                if (vid.currentTime < 5.2) {
                    vid.currentTime = 5.5;
                }
            });
            if (vid.readyState >= 1) {
                setChessTime();
            }
        });
    }

    // Auto-initialize and play visible mockups on page load
    window.addEventListener('load', () => {
        setupVideoPlayback();
        document.querySelectorAll('video.macbook-screen-content').forEach(v => {
            v.muted = true;
            v.playbackRate = 2.0;
            if (!v.classList.contains('hero-macbook-video') || v.classList.contains('active')) {
                const p = v.play();
                if (p !== undefined) p.catch(() => {});
            }
        });
        document.querySelectorAll('iframe.macbook-screen-content').forEach(f => {
            sendYtCommand(f, 'setPlaybackRate', [2]);
        });
    });

    // Viewport IntersectionObserver to play/pause videos & iframes for performance
    const allScreenMedia = document.querySelectorAll('.macbook-screen-content');
    if ('IntersectionObserver' in window && allScreenMedia.length > 0) {
        const mediaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const media = entry.target;
                const isHeroTab = media.classList.contains('hero-macbook-video');
                const isHeroActive = media.classList.contains('active');

                if (entry.isIntersecting) {
                    // Only resume if it's not an inactive hero tab
                    if (!isHeroTab || isHeroActive) {
                        if (media.tagName === 'VIDEO') {
                            media.muted = true;
                            media.playbackRate = 2.0;
                            const p = media.play();
                            if (p !== undefined) p.catch(() => {});
                        } else {
                            sendYtCommand(media, 'playVideo');
                            sendYtCommand(media, 'setPlaybackRate', [2]);
                        }
                    }
                } else {
                    if (media.tagName === 'VIDEO') {
                        try { media.pause(); } catch(e) {}
                    } else {
                        sendYtCommand(media, 'pauseVideo');
                    }
                }
            });
        }, { threshold: 0.15 });

        allScreenMedia.forEach(m => mediaObserver.observe(m));
    }

    /* ==========================================================================
       14. VIRTUAL CLUB ADMINISTRATOR HUD SIMULATOR
       ========================================================================== */
    const adminFeedItems = document.querySelectorAll('.admin-feed-list .feed-item');
    if (adminFeedItems.length > 0) {
        let activeIdx = 0;
        setInterval(() => {
            adminFeedItems.forEach((item, idx) => {
                if (idx === activeIdx) {
                    item.style.borderColor = 'rgba(120, 176, 244, 0.45)';
                    item.style.background = 'rgba(0, 110, 255, 0.08)';
                } else {
                    item.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    item.style.background = 'rgba(255, 255, 255, 0.02)';
                }
            });
            activeIdx = (activeIdx + 1) % adminFeedItems.length;
        }, 3200);
    }

});
