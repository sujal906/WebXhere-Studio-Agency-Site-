/**
 * ============================================================================
 *  WEBXHERE STUDIO — Ultimate Enterprise AI Concierge
 *  Version 3.5 | World-Class AI Suite for Sports Club Websites
 * ============================================================================
 *  Features & Polish:
 *   • Smart intent classifier & domain-specific knowledge graph
 *   • Persistent multi-session Chat History Drawer (localStorage)
 *   • Zero-blocking Glassmorphism Confirmation Modals (No native popups)
 *   • Sleek floating In-Widget Toast Notification system
 *   • Natural Text-to-Speech (Speaker) with variable speed (1x, 1.25x, 1.5x)
 *   • Live 3-Bar Audio Waveform visualization
 *   • Speech-to-Text (Microphone) with pulsing acoustic aura
 *   • 1-Click Message Copy with dynamic checkmark feedback
 *   • Formatted Transcript Export (.txt file download)
 *   • Dynamic contextual follow-up chips
 *   • Synthesized Web Audio sound effects (send, receive, action)
 *   • Full mobile responsive design with safe-area insets
 * ============================================================================
 */

(function () {
    'use strict';

    // ========================================================================
    //  1. INJECT ULTIMATE STYLES
    // ========================================================================
    const CHATBOT_CSS = `
    /* ---- Root Design Tokens ---- */
    :root {
        --cb-primary: #3b82f6;
        --cb-primary-hover: #2563eb;
        --cb-primary-glow: rgba(59, 130, 246, 0.4);
        --cb-bg-dark: #080c16;
        --cb-bg-card: rgba(13, 18, 32, 0.95);
        --cb-bg-msg-bot: rgba(22, 30, 52, 0.9);
        --cb-bg-msg-user: linear-gradient(135deg, #2563eb, #1d4ed8);
        --cb-text: #e2e8f0;
        --cb-text-dim: #94a3b8;
        --cb-text-bright: #ffffff;
        --cb-border: rgba(255, 255, 255, 0.1);
        --cb-border-active: rgba(59, 130, 246, 0.55);
        --cb-radius: 18px;
        --cb-radius-sm: 10px;
        --cb-shadow: 0 28px 70px rgba(0, 0, 0, 0.65), 0 0 50px rgba(59, 130, 246, 0.12);
        --cb-transition: cubic-bezier(0.16, 1, 0.3, 1);
        --cb-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* ---- Floating Action Toggle Button ---- */
    #wxh-chatbot-toggle {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
        transition: transform 0.25s var(--cb-transition), box-shadow 0.25s var(--cb-transition);
        outline: none;
        line-height: 0;
        -webkit-tap-highlight-color: transparent;
    }
    #wxh-chatbot-toggle:hover {
        transform: scale(1.06);
        box-shadow: 0 10px 32px rgba(37, 99, 235, 0.55);
    }
    #wxh-chatbot-toggle.open {
        transform: rotate(90deg) scale(1);
    }
    #wxh-chatbot-toggle .wxh-icon-chat,
    #wxh-chatbot-toggle .wxh-icon-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        pointer-events: none;
        line-height: 0;
        margin: 0;
        padding: 0;
    }
    #wxh-chatbot-toggle .wxh-icon-chat svg {
        width: 28px;
        height: 28px;
        fill: #ffffff;
        display: block;
    }
    #wxh-chatbot-toggle .wxh-icon-close svg {
        width: 18px;
        height: 18px;
        fill: white;
        display: block;
    }
    #wxh-chatbot-toggle .wxh-icon-close {
        display: none;
    }
    #wxh-chatbot-toggle.open .wxh-icon-chat {
        display: none;
    }
    #wxh-chatbot-toggle.open .wxh-icon-close {
        display: flex;
    }

    /* Unread Notification Badge */
    #wxh-chatbot-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #ef4444;
        color: white;
        font-size: 10.5px;
        font-weight: 700;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: var(--cb-font);
        border: 2px solid var(--cb-bg-dark);
        animation: wxh-badge-pop 0.4s var(--cb-transition);
        box-shadow: 0 2px 10px rgba(239, 68, 68, 0.6);
    }
    #wxh-chatbot-badge.show {
        display: flex;
    }

    @keyframes wxh-badge-pop {
        0% { transform: scale(0); }
        60% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }

    /* ---- Main Chat Window ---- */
    #wxh-chatbot-window {
        position: fixed;
        bottom: 100px;
        right: 24px;
        z-index: 99998;
        width: 420px;
        max-width: calc(100vw - 32px);
        height: 610px;
        max-height: calc(100vh - 130px);
        background: var(--cb-bg-card);
        backdrop-filter: blur(24px) saturate(1.5);
        -webkit-backdrop-filter: blur(24px) saturate(1.5);
        border-radius: var(--cb-radius);
        border: 1px solid var(--cb-border);
        box-shadow: var(--cb-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: var(--cb-font);
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.96);
        transition: all 0.4s var(--cb-transition);
    }
    #wxh-chatbot-window.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
    }

    /* ---- Floating Toast Notifications ---- */
    .wxh-toast {
        position: absolute;
        top: 66px;
        left: 50%;
        transform: translateX(-50%) translateY(-15px);
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid var(--cb-border-active);
        border-radius: 20px;
        padding: 6px 14px;
        color: #f1f5f9;
        font-size: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 30;
        white-space: nowrap;
        pointer-events: none;
    }
    .wxh-toast.show {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }

    /* ---- Custom Modal Dialog ---- */
    .wxh-modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.25s ease;
    }
    .wxh-modal-backdrop.show {
        opacity: 1;
        visibility: visible;
    }
    .wxh-modal-box {
        background: #0f172a;
        border: 1px solid var(--cb-border);
        border-radius: 16px;
        padding: 22px;
        width: 100%;
        max-width: 320px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        text-align: center;
        transform: scale(0.92);
        transition: transform 0.25s var(--cb-transition);
    }
    .wxh-modal-backdrop.show .wxh-modal-box {
        transform: scale(1);
    }
    .wxh-modal-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
    }
    .wxh-modal-icon svg {
        width: 22px;
        height: 22px;
        fill: currentColor;
    }
    .wxh-modal-title {
        font-size: 15px;
        font-weight: 700;
        color: var(--cb-text-bright);
        margin-bottom: 6px;
    }
    .wxh-modal-desc {
        font-size: 12.5px;
        color: var(--cb-text-dim);
        line-height: 1.5;
        margin-bottom: 18px;
    }
    .wxh-modal-actions {
        display: flex;
        gap: 10px;
    }
    .wxh-modal-btn {
        flex: 1;
        padding: 9px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
    }
    .wxh-modal-cancel {
        background: rgba(255, 255, 255, 0.08);
        color: var(--cb-text-dim);
    }
    .wxh-modal-cancel:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white;
    }
    .wxh-modal-confirm {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
    }
    .wxh-modal-confirm:hover {
        opacity: 0.92;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    }

    /* ---- Header Toolbar ---- */
    .wxh-chat-header {
        padding: 13px 16px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.16), rgba(29, 78, 216, 0.06));
        border-bottom: 1px solid var(--cb-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-shrink: 0;
        position: relative;
        z-index: 5;
    }
    .wxh-chat-header-left {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
    }
    .wxh-chat-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }
    .wxh-avatar-monogram {
        font-family: var(--cb-font);
        font-weight: 800;
        font-size: 15px;
        color: #ffffff;
        letter-spacing: -0.5px;
        user-select: none;
    }
    .wxh-chat-avatar svg {
        width: 20px;
        height: 20px;
        fill: white;
        display: block;
    }
    .wxh-chat-avatar::after {
        content: '';
        position: absolute;
        bottom: 1px;
        right: 1px;
        width: 9px;
        height: 9px;
        background: #22c55e;
        border-radius: 50%;
        border: 2px solid var(--cb-bg-card);
    }
    .wxh-chat-header-info {
        flex: 1;
        min-width: 0;
    }
    .wxh-chat-header-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--cb-text-bright);
        line-height: 1.25;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .wxh-chat-header-status {
        font-size: 11px;
        color: #22c55e;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 1px;
    }
    .wxh-chat-header-status::before {
        content: '';
        width: 5px;
        height: 5px;
        background: #22c55e;
        border-radius: 50%;
        animation: wxh-status-blink 2s ease-in-out infinite;
    }

    /* Header Action Toolbar */
    .wxh-chat-header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
    }
    .wxh-header-btn {
        background: rgba(255, 255, 255, 0.10);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 8px;
        width: 30px;
        height: 30px;
        padding: 0;
        cursor: pointer;
        color: #e2e8f0;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        position: relative;
    }
    .wxh-header-btn:hover {
        background: rgba(255, 255, 255, 0.20);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.30);
        transform: translateY(-1px);
    }
    .wxh-header-btn.active {
        background: rgba(59, 130, 246, 0.28);
        color: #60a5fa;
        border-color: rgba(59, 130, 246, 0.6);
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.35);
    }
    .wxh-header-btn.danger:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        border-color: rgba(239, 68, 68, 0.45);
    }
    .wxh-header-btn svg,
    .wxh-voice-icon-on svg,
    .wxh-voice-icon-off svg {
        width: 15px;
        height: 15px;
        fill: currentColor;
        display: block;
    }
    .wxh-voice-icon-on,
    .wxh-voice-icon-off {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 15px;
        height: 15px;
        line-height: 0;
    }

    /* Tooltips */
    .wxh-header-btn[data-tooltip]::after {
        content: attr(data-tooltip);
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%) translateY(4px);
        background: #0b1120;
        color: #f1f5f9;
        font-size: 11px;
        font-weight: 500;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: all 0.2s ease;
        z-index: 100;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
    }
    .wxh-header-btn[data-tooltip]:hover::after {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }
    .wxh-header-btn:last-child[data-tooltip]::after,
    .wxh-header-btn:nth-last-child(2)[data-tooltip]::after {
        left: auto;
        right: 0;
        transform: translateY(4px);
    }
    .wxh-header-btn:last-child[data-tooltip]:hover::after,
    .wxh-header-btn:nth-last-child(2)[data-tooltip]:hover::after {
        transform: translateY(0);
    }

    /* Header Dropdown Menu */
    .wxh-more-menu-container {
        position: relative;
        display: inline-flex;
    }
    .wxh-dropdown-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: rgba(13, 18, 32, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 10px;
        padding: 6px;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: 100;
        display: none;
        min-width: 175px;
        flex-direction: column;
        gap: 2px;
    }
    .wxh-dropdown-menu.show {
        display: flex;
        animation: wxh-dropdown-fade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes wxh-dropdown-fade {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .wxh-dropdown-item {
        background: transparent;
        border: none;
        color: #cbd5e1;
        font-family: var(--cb-font);
        font-size: 12px;
        font-weight: 500;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        text-align: left;
        transition: all 0.15s ease;
    }
    .wxh-dropdown-item:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
    }
    .wxh-dropdown-item.danger:hover {
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
    }
    .wxh-dropdown-item svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
        fill: currentColor;
    }
    .wxh-close-btn {
        background: rgba(255, 255, 255, 0.10);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 8px;
        padding: 6px;
        cursor: pointer;
        color: #e2e8f0;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
    }
    .wxh-close-btn:hover {
        background: rgba(255, 255, 255, 0.20);
        border-color: rgba(255, 255, 255, 0.30);
        color: #ffffff;
    }

    /* Mic Button Tooltip */
    .wxh-chat-mic-btn[data-tooltip]::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%) translateY(-4px);
        background: #0b1120;
        color: #f1f5f9;
        font-size: 11px;
        font-weight: 500;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: all 0.2s ease;
        z-index: 100;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
    }
    .wxh-chat-mic-btn[data-tooltip]:hover::after {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }

    /* ---- History Drawer / Sidebar ---- */
    .wxh-history-drawer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0b1120;
        z-index: 20;
        display: flex;
        flex-direction: column;
        transform: translateX(-100%);
        transition: transform 0.35s var(--cb-transition);
        border-right: 1px solid var(--cb-border);
    }
    .wxh-history-drawer.open {
        transform: translateX(0);
    }
    .wxh-drawer-header {
        padding: 13px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--cb-border);
        background: rgba(15, 23, 42, 0.75);
    }
    .wxh-drawer-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14.5px;
        font-weight: 600;
        color: var(--cb-text-bright);
    }
    .wxh-drawer-title svg {
        width: 17px;
        height: 17px;
        fill: #60a5fa;
    }
    .wxh-drawer-actions {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .wxh-drawer-new-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 6px 11px;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .wxh-drawer-new-btn:hover {
        opacity: 0.92;
        transform: translateY(-1px);
    }
    .wxh-drawer-new-btn svg {
        width: 13px;
        height: 13px;
        fill: white;
    }
    .wxh-drawer-close-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--cb-border);
        color: var(--cb-text-dim);
        border-radius: 8px;
        padding: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .wxh-drawer-close-btn:hover {
        color: white;
        background: rgba(255, 255, 255, 0.12);
    }
    .wxh-drawer-close-btn svg {
        width: 15px;
        height: 15px;
        fill: currentColor;
    }
    .wxh-drawer-search {
        padding: 9px 14px;
        border-bottom: 1px solid var(--cb-border);
        background: rgba(15, 23, 42, 0.45);
    }
    .wxh-drawer-search input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--cb-border);
        border-radius: 8px;
        padding: 7px 11px;
        color: var(--cb-text-bright);
        font-size: 12px;
        outline: none;
    }
    .wxh-drawer-search input:focus {
        border-color: var(--cb-border-active);
    }
    .wxh-history-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .wxh-history-item {
        background: rgba(30, 41, 59, 0.45);
        border: 1px solid var(--cb-border);
        border-radius: 10px;
        padding: 10px 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 4px;
        position: relative;
    }
    .wxh-history-item:hover {
        background: rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.45);
        transform: translateY(-1px);
    }
    .wxh-history-item.active {
        background: rgba(59, 130, 246, 0.22);
        border-color: rgba(59, 130, 246, 0.65);
    }
    .wxh-history-item-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
    }
    .wxh-history-item-title {
        font-size: 12.5px;
        font-weight: 600;
        color: var(--cb-text-bright);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
    }
    .wxh-history-item-del {
        background: none;
        border: none;
        color: var(--cb-text-dim);
        cursor: pointer;
        padding: 2px;
        display: none;
        border-radius: 4px;
        transition: all 0.2s;
    }
    .wxh-history-item:hover .wxh-history-item-del {
        display: flex;
    }
    @media (max-width: 640px) or (hover: none) {
        .wxh-history-item .wxh-history-item-del {
            display: flex !important;
            opacity: 0.75;
        }
    }
    .wxh-history-item-del:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.15);
    }
    .wxh-history-item-del svg {
        width: 13px;
        height: 13px;
        fill: currentColor;
    }
    .wxh-history-item-meta {
        font-size: 11px;
        color: var(--cb-text-dim);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .wxh-history-empty {
        text-align: center;
        padding: 40px 20px;
        color: var(--cb-text-dim);
        font-size: 13px;
        line-height: 1.6;
    }
    .wxh-drawer-footer {
        padding: 12px 16px;
        border-top: 1px solid var(--cb-border);
        background: rgba(15, 23, 42, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .wxh-drawer-clear-all-btn {
        background: none;
        border: 1px dashed rgba(239, 68, 68, 0.4);
        color: #f87171;
        border-radius: 8px;
        padding: 7px 14px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
    }
    .wxh-drawer-clear-all-btn:hover {
        background: rgba(239, 68, 68, 0.16);
        border-color: #ef4444;
    }
    .wxh-drawer-clear-all-btn svg {
        width: 14px;
        height: 14px;
        fill: currentColor;
    }

    /* ---- Messages Area ---- */
    .wxh-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
    .wxh-chat-messages::-webkit-scrollbar {
        width: 5px;
    }
    .wxh-chat-messages::-webkit-scrollbar-track {
        background: transparent;
    }
    .wxh-chat-messages::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12);
        border-radius: 10px;
    }

    /* Message Bubbles */
    .wxh-msg {
        max-width: 88%;
        animation: wxh-msg-in 0.35s var(--cb-transition);
        position: relative;
    }
    .wxh-msg.bot {
        align-self: flex-start;
    }
    .wxh-msg.user {
        align-self: flex-end;
    }
    .wxh-msg-header-tag {
        font-size: 10.5px;
        font-weight: 600;
        color: var(--cb-text-dim);
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .wxh-msg.user .wxh-msg-header-tag {
        justify-content: flex-end;
        color: #93c5fd;
    }
    .wxh-msg-bubble {
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 13.5px;
        line-height: 1.6;
        color: var(--cb-text);
        word-wrap: break-word;
    }
    .wxh-msg.bot .wxh-msg-bubble {
        background: var(--cb-bg-msg-bot);
        border: 1px solid var(--cb-border);
        border-bottom-left-radius: 4px;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
    }
    .wxh-msg.user .wxh-msg-bubble {
        background: var(--cb-bg-msg-user);
        color: white;
        border-bottom-right-radius: 4px;
        box-shadow: 0 4px 18px rgba(37, 99, 235, 0.35);
    }
    .wxh-msg-bubble strong {
        color: var(--cb-text-bright);
        font-weight: 600;
    }
    .wxh-msg-bubble a {
        color: #93c5fd;
        text-decoration: underline;
        text-underline-offset: 2px;
    }
    .wxh-msg-bubble a:hover {
        color: #bfdbfe;
    }
    .wxh-msg-bubble ul, .wxh-msg-bubble ol {
        margin: 6px 0;
        padding-left: 18px;
    }
    .wxh-msg-bubble li {
        margin-bottom: 4px;
    }
    code.wxh-inline-code {
        background: rgba(0, 0, 0, 0.3);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #93c5fd;
    }

    /* Message Footer & Tools */
    .wxh-msg-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 5px;
        padding: 0 4px;
        gap: 8px;
    }
    .wxh-msg.user .wxh-msg-footer {
        flex-direction: row-reverse;
    }
    .wxh-msg-time {
        font-size: 10.5px;
        color: var(--cb-text-dim);
        opacity: 0.75;
    }
    .wxh-msg-tools {
        display: flex;
        align-items: center;
        gap: 5px;
        opacity: 0.85;
        transition: opacity 0.2s;
    }
    .wxh-msg:hover .wxh-msg-tools {
        opacity: 1;
    }
    .wxh-msg-tool-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 4px 7px;
        cursor: pointer;
        color: var(--cb-text-dim);
        font-size: 11px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s;
        line-height: 1;
        outline: none;
    }
    .wxh-msg-tool-btn:hover {
        background: rgba(59, 130, 246, 0.22);
        color: #93c5fd;
        border-color: rgba(59, 130, 246, 0.45);
    }
    .wxh-msg-tool-btn.copied {
        background: rgba(34, 197, 94, 0.25);
        color: #4ade80;
        border-color: rgba(34, 197, 94, 0.5);
    }
    .wxh-msg-tool-btn.speaking {
        background: rgba(59, 130, 246, 0.3);
        color: #60a5fa;
        border-color: #3b82f6;
        animation: wxh-pulse-speaking 1.4s infinite;
    }
    .wxh-msg-tool-btn svg {
        width: 12px;
        height: 12px;
        fill: currentColor;
    }
    @keyframes wxh-pulse-speaking {
        0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
        50% { box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.6); }
    }

    /* Live Animated Sound Wave Bars */
    .wxh-sound-waves {
        display: none;
        align-items: center;
        gap: 2px;
        height: 12px;
    }
    .wxh-msg-tool-btn.speaking .wxh-sound-waves {
        display: inline-flex;
    }
    .wxh-msg-tool-btn.speaking .wxh-speaker-icon {
        display: none;
    }
    .wxh-sound-waves span {
        width: 2px;
        height: 4px;
        background: currentColor;
        border-radius: 1px;
        animation: wxh-wave 0.8s ease-in-out infinite alternate;
    }
    .wxh-sound-waves span:nth-child(2) { animation-delay: 0.2s; }
    .wxh-sound-waves span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes wxh-wave {
        0% { height: 3px; }
        100% { height: 11px; }
    }

    /* Action Buttons inside bot messages */
    .wxh-msg-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
    }
    .wxh-msg-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 7px 14px;
        background: rgba(59, 130, 246, 0.14);
        border: 1px solid rgba(59, 130, 246, 0.28);
        border-radius: 20px;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        font-family: var(--cb-font);
    }
    .wxh-msg-action-btn:hover {
        background: rgba(59, 130, 246, 0.25);
        border-color: rgba(59, 130, 246, 0.6);
        color: #dbeafe;
        transform: translateY(-1px);
    }
    .wxh-msg-action-btn svg {
        width: 13px;
        height: 13px;
        fill: currentColor;
    }

    @keyframes wxh-msg-in {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    /* ---- Typing Indicator ---- */
    .wxh-typing {
        display: none;
        align-self: flex-start;
        padding: 12px 18px;
        background: var(--cb-bg-msg-bot);
        border: 1px solid var(--cb-border);
        border-radius: 15px;
        border-bottom-left-radius: 4px;
        gap: 5px;
        align-items: center;
    }
    .wxh-typing.show {
        display: flex;
    }
    .wxh-typing-dot {
        width: 7px;
        height: 7px;
        background: var(--cb-text-dim);
        border-radius: 50%;
        animation: wxh-typing-bounce 1.4s ease-in-out infinite;
    }
    .wxh-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .wxh-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes wxh-typing-bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
    }

    /* ---- Quick Replies ---- */
    .wxh-quick-replies {
        padding: 8px 16px 4px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        flex-shrink: 0;
        max-height: 95px;
        overflow-y: auto;
    }
    .wxh-quick-replies:empty {
        display: none;
        padding: 0;
    }
    .wxh-qr-chip {
        padding: 7px 14px;
        background: rgba(59, 130, 246, 0.09);
        border: 1px solid rgba(59, 130, 246, 0.22);
        border-radius: 20px;
        color: #93c5fd;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s;
        white-space: nowrap;
        font-family: var(--cb-font);
    }
    .wxh-qr-chip:hover {
        background: rgba(59, 130, 246, 0.22);
        border-color: rgba(59, 130, 246, 0.5);
        color: #dbeafe;
        transform: translateY(-1px);
    }

    /* ---- Input Area with Voice Mic ---- */
    .wxh-chat-input-area {
        padding: 12px 16px 14px;
        border-top: 1px solid var(--cb-border);
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        background: rgba(10, 14, 26, 0.65);
    }
    .wxh-chat-input {
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--cb-border);
        border-radius: 12px;
        padding: 10px 14px;
        color: var(--cb-text-bright);
        font-size: 13.5px;
        font-family: var(--cb-font);
        outline: none;
        transition: border-color 0.2s;
        resize: none;
        line-height: 1.4;
    }
    .wxh-chat-input::placeholder {
        color: var(--cb-text-dim);
    }
    .wxh-chat-input:focus {
        border-color: var(--cb-border-active);
    }

    /* Mic Button */
    .wxh-chat-mic-btn {
        width: 38px;
        height: 38px;
        border-radius: 11px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--cb-border);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--cb-text-dim);
        transition: all 0.25s;
        position: relative;
    }
    .wxh-chat-mic-btn:hover {
        background: rgba(59, 130, 246, 0.2);
        color: #93c5fd;
        border-color: rgba(59, 130, 246, 0.4);
    }
    .wxh-chat-mic-btn.listening {
        background: rgba(239, 68, 68, 0.25);
        color: #ef4444;
        border-color: #ef4444;
        animation: wxh-mic-pulse 1.4s infinite;
    }
    .wxh-chat-mic-btn svg {
        width: 17px;
        height: 17px;
        fill: currentColor;
    }
    @keyframes wxh-mic-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
        50% { box-shadow: 0 0 12px 3px rgba(239, 68, 68, 0.7); }
    }

    /* Send Button */
    .wxh-chat-send-btn {
        width: 38px;
        height: 38px;
        border-radius: 11px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.25s;
    }
    .wxh-chat-send-btn:hover {
        transform: scale(1.06);
        box-shadow: 0 4px 16px rgba(59, 130, 246, 0.5);
    }
    .wxh-chat-send-btn:active {
        transform: scale(0.96);
    }
    .wxh-chat-send-btn svg {
        width: 17px;
        height: 17px;
        fill: white;
    }

    /* ---- Footer Status ---- */
    .wxh-chat-footer {
        padding: 7px 14px;
        font-size: 11px;
        color: var(--cb-text-dim);
        font-family: var(--cb-font);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(10, 14, 26, 0.7);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .wxh-chat-powered {
        opacity: 0.65;
        letter-spacing: 0.02em;
    }

    /* ---- Mobile Responsive ---- */
    @media (max-width: 480px) {
        #wxh-chatbot-window {
            bottom: 0;
            right: 0;
            width: 100vw;
            max-width: 100vw;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
        }
        #wxh-chatbot-window.open {
            border-radius: 0;
        }
        #wxh-chatbot-toggle {
            bottom: 16px;
            right: 16px;
            width: 50px;
            height: 50px;
        }
        #wxh-chatbot-toggle.open {
            display: none;
        }
        .wxh-chat-header {
            padding: 12px 14px;
            padding-top: max(12px, env(safe-area-inset-top));
        }
        .wxh-chat-input-area {
            padding-bottom: max(12px, env(safe-area-inset-bottom));
        }
    }

    /* ---- Welcome Prompt (Pre-chat) ---- */
    #wxh-chatbot-welcome {
        position: fixed;
        bottom: 96px;
        right: 24px;
        z-index: 99997;
        background: var(--cb-bg-card);
        backdrop-filter: blur(16px);
        border: 1px solid var(--cb-border);
        border-radius: 14px;
        padding: 14px 18px;
        max-width: 280px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        opacity: 0;
        visibility: hidden;
        transform: translateY(8px) scale(0.96);
        transition: all 0.35s var(--cb-transition);
        font-family: var(--cb-font);
        cursor: pointer;
    }
    #wxh-chatbot-welcome.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
    }
    .wxh-welcome-text {
        font-size: 13px;
        color: var(--cb-text);
        line-height: 1.5;
    }
    .wxh-welcome-text strong {
        color: var(--cb-text-bright);
    }
    .wxh-welcome-dismiss {
        position: absolute;
        top: 6px;
        right: 8px;
        background: none;
        border: none;
        color: var(--cb-text-dim);
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        padding: 2px;
    }

    @media (max-width: 480px) {
        #wxh-chatbot-welcome {
            right: 16px;
            bottom: 80px;
            max-width: calc(100vw - 90px);
        }
    }
    `;

    // Inject CSS
    const styleEl = document.createElement('style');
    styleEl.id = 'wxh-chatbot-styles';
    styleEl.textContent = CHATBOT_CSS;
    document.head.appendChild(styleEl);


    // ========================================================================
    //  2. BUILD DOM ELEMENTS & ADVANCED TOOLBAR
    // ========================================================================

    // SVG Icons
    const ICON_CHAT = `<svg viewBox="0 -1.5 24 24" width="28" height="28" fill="white"><path d="M12 2a1.5 1.5 0 0 1 1.5 1.5V4h1.5A5.5 5.5 0 0 1 20.5 9.5v2.25a3.25 3.25 0 0 1-1.25 2.56A5.5 5.5 0 0 1 14.5 19h-5a5.5 5.5 0 0 1-4.75-4.69A3.25 3.25 0 0 1 3.5 11.75V9.5A5.5 5.5 0 0 1 9 4h1.5V3.5A1.5 1.5 0 0 1 12 2zm-3.5 8a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm7 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm-5.5 5a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4z"/></svg>`;
    const ICON_CLOSE = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
    const ICON_SEND = `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
    const ICON_BOT = `<svg viewBox="0 -1.5 24 24" width="20" height="20" fill="white"><path d="M12 2a1.5 1.5 0 0 1 1.5 1.5V4h1.5A5.5 5.5 0 0 1 20.5 9.5v2.25a3.25 3.25 0 0 1-1.25 2.56A5.5 5.5 0 0 1 14.5 19h-5a5.5 5.5 0 0 1-4.75-4.69A3.25 3.25 0 0 1 3.5 11.75V9.5A5.5 5.5 0 0 1 9 4h1.5V3.5A1.5 1.5 0 0 1 12 2zm-3.5 8a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm7 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm-5.5 5a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4z"/></svg>`;
    const ICON_TRASH = `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;
    const ICON_ARROW = `<svg viewBox="0 0 24 24" width="12" height="12"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" fill="currentColor"/></svg>`;
    const ICON_SPEAKER = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    const ICON_SPEAKER_MUTED = `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
    const ICON_HISTORY = `<svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`;
    const ICON_MIC = `<svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>`;
    const ICON_COPY = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
    const ICON_CHECK = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
    const ICON_DOWNLOAD = `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
    const ICON_PLUS = `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
    const ICON_USER = `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
    const ICON_WARN = `<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;

    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'wxh-chatbot-toggle';
    toggleBtn.setAttribute('aria-label', 'Open Chat');
    toggleBtn.innerHTML = `<span class="wxh-icon-chat">${ICON_CHAT}</span><span class="wxh-icon-close">${ICON_CLOSE}</span>`;
    document.body.appendChild(toggleBtn);

    // Chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'wxh-chatbot-window';
    chatWindow.innerHTML = `
        <!-- In-Widget Toast Notification -->
        <div class="wxh-toast" id="wxh-toast">
            <span class="wxh-toast-msg">Notification</span>
        </div>

        <!-- In-Widget Confirmation Modal -->
        <div class="wxh-modal-backdrop" id="wxh-modal">
            <div class="wxh-modal-box">
                <div class="wxh-modal-icon">${ICON_WARN}</div>
                <div class="wxh-modal-title" id="wxh-modal-title">Clear Conversation?</div>
                <div class="wxh-modal-desc" id="wxh-modal-desc">Are you sure you want to clear your messages? This action cannot be undone.</div>
                <div class="wxh-modal-actions">
                    <button class="wxh-modal-btn wxh-modal-cancel" id="wxh-modal-cancel">Cancel</button>
                    <button class="wxh-modal-btn wxh-modal-confirm" id="wxh-modal-confirm">Delete</button>
                </div>
            </div>
        </div>

        <!-- Header -->
        <div class="wxh-chat-header">
            <div class="wxh-chat-header-left">
                <div class="wxh-chat-avatar">${ICON_BOT}</div>
                <div class="wxh-chat-header-info">
                    <div class="wxh-chat-header-name">WebXHere Concierge</div>
                    <div class="wxh-chat-header-status">Typically replies instantly</div>
                </div>
            </div>
            <div class="wxh-chat-header-actions">
                <button class="wxh-header-btn" id="wxh-btn-voice" data-tooltip="Auto-Voice Read Aloud" title="Auto Voice Read Aloud">
                    <span class="wxh-voice-icon-on">${ICON_SPEAKER}</span>
                    <span class="wxh-voice-icon-off" style="display:none;">${ICON_SPEAKER_MUTED}</span>
                </button>
                <button class="wxh-header-btn" id="wxh-btn-history" data-tooltip="Chat History" title="View Saved Chats">
                    ${ICON_HISTORY}
                </button>
                <div class="wxh-more-menu-container">
                    <button class="wxh-header-btn" id="wxh-btn-more" data-tooltip="More Options" title="More Options">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                    </button>
                    <div class="wxh-dropdown-menu" id="wxh-dropdown-menu">
                        <button class="wxh-dropdown-item" id="wxh-btn-export">
                            ${ICON_DOWNLOAD}
                            <span>Export Conversation</span>
                        </button>
                        <button class="wxh-dropdown-item danger" id="wxh-btn-clear">
                            ${ICON_TRASH}
                            <span>Clear Current Chat</span>
                        </button>
                    </div>
                </div>
                <button class="wxh-header-btn wxh-close-btn" id="wxh-btn-close-header" title="Close Chat">${ICON_CLOSE}</button>
            </div>
        </div>

        <!-- History Drawer -->
        <div class="wxh-history-drawer" id="wxh-history-drawer">
            <div class="wxh-drawer-header">
                <div class="wxh-drawer-title">
                    ${ICON_HISTORY}
                    <span>Chat History</span>
                </div>
                <div class="wxh-drawer-actions">
                    <button class="wxh-drawer-new-btn" id="wxh-drawer-new-btn">
                        ${ICON_PLUS} New Chat
                    </button>
                    <button class="wxh-drawer-close-btn" id="wxh-drawer-close-btn">
                        ${ICON_CLOSE}
                    </button>
                </div>
            </div>
            <div class="wxh-drawer-search">
                <input type="text" id="wxh-history-search" placeholder="Search conversations..." />
            </div>
            <div class="wxh-history-list" id="wxh-history-list"></div>
            <div class="wxh-drawer-footer">
                <button class="wxh-drawer-clear-all-btn" id="wxh-drawer-clear-all-btn">
                    ${ICON_TRASH} Delete All History
                </button>
            </div>
        </div>

        <!-- Messages Area -->
        <div class="wxh-chat-messages" id="wxh-messages"></div>

        <!-- Typing Indicator -->
        <div class="wxh-typing" id="wxh-typing">
            <div class="wxh-typing-dot"></div>
            <div class="wxh-typing-dot"></div>
            <div class="wxh-typing-dot"></div>
        </div>

        <!-- Quick Reply Chips -->
        <div class="wxh-quick-replies" id="wxh-quick-replies"></div>

        <!-- Input Area with Voice Mic -->
        <div class="wxh-chat-input-area">
            <input type="text" class="wxh-chat-input" id="wxh-input" placeholder="Ask anything about our club services..." autocomplete="off" />
            <button class="wxh-chat-mic-btn" id="wxh-mic-btn" data-tooltip="Speak to AI" title="Voice Input (Speech-to-Text)" aria-label="Voice Input">
                ${ICON_MIC}
            </button>
            <button class="wxh-chat-send-btn" id="wxh-send-btn" aria-label="Send">${ICON_SEND}</button>
        </div>

        <!-- Footer Info -->
        <div class="wxh-chat-footer">
            <span class="wxh-chat-powered">WebXHere Studio Concierge</span>
        </div>
    `;
    document.body.appendChild(chatWindow);

    // References
    const messagesEl = document.getElementById('wxh-messages');
    const typingEl = document.getElementById('wxh-typing');
    const quickRepliesEl = document.getElementById('wxh-quick-replies');
    const inputEl = document.getElementById('wxh-input');
    const sendBtn = document.getElementById('wxh-send-btn');
    const micBtn = document.getElementById('wxh-mic-btn');
    const mobileCloseBtn = document.getElementById('wxh-btn-close-header');
    const toastEl = document.getElementById('wxh-toast');
    const toastMsgEl = toastEl.querySelector('.wxh-toast-msg');

    // Header buttons & menus
    const voiceToggleBtn = document.getElementById('wxh-btn-voice');
    const voiceIconOn = voiceToggleBtn ? voiceToggleBtn.querySelector('.wxh-voice-icon-on') : null;
    const voiceIconOff = voiceToggleBtn ? voiceToggleBtn.querySelector('.wxh-voice-icon-off') : null;
    const historyToggleBtn = document.getElementById('wxh-btn-history');
    const exportBtn = document.getElementById('wxh-btn-export');
    const clearBtn = document.getElementById('wxh-btn-clear');
    const moreMenuBtn = document.getElementById('wxh-btn-more');
    const dropdownMenu = document.getElementById('wxh-dropdown-menu');
    const speedPill = document.getElementById('wxh-speed-pill');
    const speedVal = document.getElementById('wxh-speed-val');

    // More options dropdown toggle handler
    if (moreMenuBtn && dropdownMenu) {
        moreMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!moreMenuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Modal elements
    const modalBackdrop = document.getElementById('wxh-modal');
    const modalTitle = document.getElementById('wxh-modal-title');
    const modalDesc = document.getElementById('wxh-modal-desc');
    const modalCancel = document.getElementById('wxh-modal-cancel');
    const modalConfirm = document.getElementById('wxh-modal-confirm');
    let onModalConfirmCallback = null;

    // History drawer elements
    const historyDrawer = document.getElementById('wxh-history-drawer');
    const drawerCloseBtn = document.getElementById('wxh-drawer-close-btn');
    const drawerNewBtn = document.getElementById('wxh-drawer-new-btn');
    const drawerClearAllBtn = document.getElementById('wxh-drawer-clear-all-btn');
    const historyListEl = document.getElementById('wxh-history-list');
    const historySearchInput = document.getElementById('wxh-history-search');

    // App State
    let isOpen = false;
    let isVoiceAutoSpeak = false;
    let speechRate = 1.0;
    const speechRates = [1.0, 1.25, 1.5];
    let currentSpeakingBtn = null;
    let activeSession = null;
    let allSessions = [];

    const STORAGE_KEY = 'wxh_chat_sessions_v3';
    const VOICE_PREF_KEY = 'wxh_voice_autospeak';
    const SPEED_PREF_KEY = 'wxh_voice_speed';

    // Load saved preferences
    try {
        isVoiceAutoSpeak = localStorage.getItem(VOICE_PREF_KEY) === 'true';
        updateVoiceButtonUI();
        const savedSpeed = parseFloat(localStorage.getItem(SPEED_PREF_KEY));
        if (savedSpeed && speechRates.includes(savedSpeed)) {
            speechRate = savedSpeed;
            if (speedVal) speedVal.textContent = speechRate.toFixed(1) + 'x';
        }
    } catch (e) {}

    // Toast Helper
    let toastTimeout = null;
    function showToast(msg) {
        toastMsgEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2600);
    }

    // Modal Helper
    function openModal(title, desc, confirmLabel, onConfirm) {
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalConfirm.textContent = confirmLabel || 'Delete';
        onModalConfirmCallback = onConfirm;
        modalBackdrop.classList.add('show');
    }

    function closeModal() {
        modalBackdrop.classList.remove('show');
        onModalConfirmCallback = null;
    }

    modalCancel.addEventListener('click', closeModal);
    modalConfirm.addEventListener('click', () => {
        if (onModalConfirmCallback) onModalConfirmCallback();
        closeModal();
    });

    // Load saved sessions from localStorage
    function loadSessionsFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                allSessions = JSON.parse(raw);
            } else {
                allSessions = [];
            }
        } catch (e) {
            allSessions = [];
        }
    }

    function saveSessionsToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allSessions));
        } catch (e) {}
    }

    loadSessionsFromStorage();

    // ========================================================================
//  3. KNOWLEDGE BASE & INTENTS
    // ========================================================================

    function getTimeGreeting() {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    }

    // Intent definitions with keywords, patterns, and responses
    const INTENTS = [
        // ---- HOW ARE YOU (Human Conversational) ----
        {
            id: 'how_are_you',
            keywords: [
                'how are you', 'how are you doing', 'how r u', 'how do you do', 'how is it going', 'hows it going', 'how it going',
                'how is your day', 'hows your day', 'whats up', 'what\'s up', 'wassup',
                'kaise ho', 'kya haal hai', 'kaisa chal raha hai', 'kya chal raha hai', 'aap kaise ho', 'tum kaise ho', 'sab theek'
            ],
            response: () => `I'm doing great, thank you so much for asking! 😊\n\nI'm right here and excited to help you explore digital solutions for your sports academy or club.\n\nHow are you doing today? Are you looking to upgrade an existing website, or build a brand new member portal and court booking platform?`,
            chips: ['I\'m doing great!', 'I need a new club website', 'What services do you offer?', 'How much does it cost?']
        },

        // ---- USER SAYS THEY ARE GOOD / FINE ----
        {
            id: 'user_good',
            keywords: [
                'i am good', 'im good', 'i am fine', 'im fine', 'doing good', 'doing well', 'i am doing good', 'i am doing well',
                'great', 'all good', 'all well', 'pretty good', 'not bad',
                'badhiya', 'mast', 'theek hu', 'badhiya hu', 'mast hu', 'sab badhiya', 'sab theek hai'
            ],
            response: () => `Awesome, really glad to hear that! 🙌\n\nHow can I assist your club today? Whether you run a **Chess Academy**, a **Tennis & Padel Club**, or a **Badminton Center**, I can walk you through our custom features, share pricing details, or show you live case studies.\n\nWhat would you like to explore?`,
            chips: ['What services do you offer?', 'How much does it cost?', 'Show me case studies', 'Book a strategy call']
        },

        // ---- GREETINGS ----
        {
            id: 'greeting',
            keywords: ['hi', 'hello', 'hey', 'hola', 'sup', 'yo', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'namaste', 'hii', 'hiii', 'heyy', 'helloo'],
            response: () => `Hello! 👋 ${getTimeGreeting()}! Great to connect with you. I am your **WebXHere AI Concierge**.\n\nHow are you doing today? I can help you explore our custom sports club websites, automated court scheduling, pricing, or live demos.\n\nWhat can I help you with?`,
            chips: ['I am doing good!', 'What services do you offer?', 'How much does it cost?', 'Show me live demos', 'Book a free call']
        },

        // ---- USER WANTS TO BUILD A WEBSITE ----
        {
            id: 'build_website',
            keywords: [
                'i want a website', 'need a website', 'build a website', 'make a website', 'create a website',
                'website banwani hai', 'website banana hai', 'mujhe website banani hai', 'mujhe website banwani hai',
                'new website', 'redesign website', 'hire you', 'start project', 'develop a website', 'build platform'
            ],
            response: () => `That's wonderful! We would love to engineer a high-performance digital platform for your club. 🚀\n\nHere's how we work with you:\n1. **Purpose-Built Sports Architecture** — Fast, mobile-first design with coach bios, program showcases, and local SEO.\n2. **Operating Engine** — Real-time court & table scheduling, recurring Stripe dues, and live tournament draws.\n3. **14-Day Delivery Guarantee** — Production-ready launch in two weeks, or we work for free until completed.\n4. **0% Revenue Cut** — 100% of all member payments go directly into your Stripe account.\n\nWhich sport or discipline does your academy focus on?`,
            chips: ['Chess Academy', 'Tennis & Padel Club', 'Badminton Center', 'Multi-Sport Facility', 'Talk to Sujal']
        },

        // ---- BOT IDENTITY / WHO ARE YOU ----
        {
            id: 'bot_identity',
            keywords: [
                'who are you', 'what is your name', 'whats your name', 'your name', 'are you human', 'are you a robot',
                'are you real', 'are you ai', 'who made you', 'who created you', 'aap kaun ho', 'tum kaun ho'
            ],
            response: () => `I am the **WebXHere AI Concierge**! 🤖\n\nI was created and trained by **Sujal Prajapati** (Founder & Lead Engineer of WebXHere Studio). I specialize in sports web architecture, court reservation engines, and tournament management.\n\nWhile I'm an AI available 24/7, Sujal and our engineering team are also available for direct 1-on-1 strategy sessions whenever you'd like to speak with a human!\n\nHow can I help you today?`,
            chips: ['What can you do?', 'Who is Sujal?', 'What services do you offer?', 'Talk to a human']
        },

        // ---- WHAT CAN YOU DO / CAPABILITIES ----
        {
            id: 'capabilities',
            keywords: [
                'what can you do', 'what are your features', 'what can i ask', 'capabilities', 'help me with',
                'kya kar sakte ho', 'tum kya kar sakte ho'
            ],
            response: () => `I can help you with anything related to modernizing your sports club's digital presence! For instance:\n\n• **Platform Features** — Ask about visual court pegboards, FIDE/USCF rating sync, or Stripe recurring dues\n• **Pricing & Turnkey Packages** — Learn about our transparent project investment and 0% commission\n• **14-Day Launch Process** — Understand our timeline and guarantees\n• **Live Case Studies** — Explore our production deployments for Chess, Tennis, and Badminton\n• **Book a Consultation** — Schedule a direct 30-minute discovery call with our engineering team\n\nWhat would you like to dive into?`,
            chips: ['Show me pricing', 'Explore live demos', 'Chess features', 'Tennis booking', 'Book a free call']
        },

        // ---- CAN YOU HELP ME / HELP ----
        {
            id: 'help',
            keywords: [
                'can you help me', 'help me', 'i need help', 'help', 'kya tum meri madad kar sakte ho', 'help chahiye', 'support'
            ],
            response: () => `Of course! I'm here to help with whatever you need. 😊\n\nTell me a little about your club:\n• Are you looking for a website for **Chess**, **Tennis**, or **Badminton**?\n• Do you need **online court reservations**, **member dues via Stripe**, or **tournament brackets**?\n• Or would you like to know our **pricing and 14-day delivery timeline**?`,
            chips: ['Chess academy features', 'Tennis court booking', 'Badminton features', 'Pricing & packages']
        },

        // ---- TALK TO HUMAN / CONTACT REAL PERSON ----
        {
            id: 'human_contact',
            keywords: [
                'talk to human', 'talk to person', 'real person', 'human', 'speak to someone', 'agent',
                'sujal se baat', 'call me', 'phone number', 'contact number', 'human agent', 'talk to a human'
            ],
            response: () => `I'd be glad to connect you directly with a human! 🤝\n\nYou can book a direct 1-on-1 strategy call with our founder and lead engineer, **Sujal Prajapati**. He'll review your club's exact operational requirements, share tailored screen walkthroughs, and provide a clear 14-day launch roadmap.\n\n📅 **Calendly:** 30-minute free discovery call\n📧 **Email:** hello@webxhere.studio`,
            chips: ['Book 30-min strategy call', 'What services do you offer?', 'Show me pricing'],
            actions: [
                { label: '📅 Book Strategy Call with Sujal', url: 'https://calendly.com/sujalprajapati7217/30min' },
                { label: '📧 Email Us', url: 'mailto:hello@webxhere.studio' }
            ]
        },

        // ---- COMPLIMENTS & APPRECIATION ----
        {
            id: 'compliments',
            keywords: [
                'you are good', 'you are smart', 'smart bot', 'good bot', 'awesome', 'cool', 'nice bot',
                'great job', 'impressive', 'zabardast', 'badiya', 'bohot acche', 'very good', 'love this'
            ],
            response: () => `Thank you so much! That really brightens my day! 😊 Our team at WebXHere Studio put a lot of passion into crafting an assistant that feels thoughtful, fast, and knowledgeable.\n\nIs there anything specific I can help you with for your sports club or academy today?`,
            chips: ['What services do you offer?', 'How much does it cost?', 'Show me case studies', 'Book a call']
        },

        // ---- JOKES & SPORTS SMALLTALK ----
        {
            id: 'jokes_smalltalk',
            keywords: ['joke', 'tell me a joke', 'funny', 'humor', 'laugh', 'do you play sports', 'khelte ho'],
            response: () => `Here's a quick one for you: 😄\n\n*Why did the tennis player never change a lightbulb?*\n*Because they were too busy trying to ace the serve!* 🎾\n\nSports are truly in our DNA here. Sujal and the engineering team are active competitive athletes in Chess, Tennis, and Badminton, which is why our software fits real clubs so well. What sport does your club specialize in?`,
            chips: ['Chess', 'Tennis', 'Badminton', 'Tell me about pricing']
        },

        // ---- ABOUT / WHO ARE YOU ----
        {
            id: 'about',
            keywords: ['who are you', 'what is webxhere', 'what do you do', 'tell me about', 'about webxhere', 'about your company', 'your company', 'what company', 'agency', 'studio', 'who is this', 'kya karte ho', 'kon ho'],
            response: () => `**WebXHere Studio** is an engineering agency founded by competitive athletes and software engineers.\n\n**Our Mission:** Empower sports academies with premium digital tools that streamline administration and accelerate membership growth.\n\n**Our Vision:** To be the premier digital infrastructure partner for sports clubs nationwide.\n\nWe specialize exclusively in sports systems — from automated Swiss pairing engines and court reservation pegboards to member subscription management.\n\n**Key Metrics:**\n• 100+ Sports Pages Engineered\n• 14-Day Average Launch Guarantee\n• 100% Mobile Optimized (sub-500ms load times)\n• 15+ Admin Hours Saved weekly per club`,
            chips: ['What services do you offer?', 'Who is the founder?', 'Why choose WebXHere?', 'Book a free call']
        },

        // ---- FOUNDER ----
        {
            id: 'founder',
            keywords: ['founder', 'who founded', 'ceo', 'owner', 'sujal', 'who created', 'who made', 'team', 'who built', 'creator'],
            response: () => `**Sujal Prajapati** is the Founder & Lead Engineer of WebXHere Studio.\n\n*"Sports clubs deserve to look just as sleek, modern, and trustworthy as the premier tech companies we rely on every day."*\n\n**Background:**\n• Active competitive player in Chess, Tennis & Badminton\n• Architecture: High-Performance Vanilla JS + CSS (Single Page Architecture)\n• Engineering: Hand-crafted interfaces with guaranteed sub-500ms response times\n• Combines deep athletics domain expertise with modern software engineering`,
            chips: ['What services do you offer?', 'Why choose WebXHere?', 'Book a call with Sujal']
        },

        // ---- SERVICES (General) ----
        {
            id: 'services',
            keywords: ['services', 'what do you offer', 'service', 'features', 'what can you do', 'what you build', 'offer', 'capabilities', 'solutions', 'kya offer', 'kya karte'],
            response: () => `We deliver a complete **3-Tier Club Architecture** — Build, Operate, Scale:\n\n**Level 01 — BUILD (Brand & Digital Presence)**\n• Modern club showcase & responsive architecture\n• Coach profiles, academy programs & media highlights\n• Local sports SEO & discovery optimization\n• Sub-500ms lightning page performance\n\n**Level 02 — OPERATE (Automated Club Operations)**\n• Online membership subscriptions via Stripe\n• Real-time court & table reservation engines\n• Clinic registrations & live tournament brackets\n• Member self-service portals with bank-grade encryption\n\n**Level 03 — SCALE (AI Concierge & Growth)**\n• 24/7 AI Club Concierge for instant inquiry resolution\n• AI Voice agent integration for phone scheduling\n• Free trial funnels & automated member alerts\n• Zero commission on all membership dues`,
            chips: ['Tell me about pricing', 'Chess club features', 'Tennis club features', 'Badminton features', 'Book a free call']
        },

        // ---- PRICING ----
        {
            id: 'pricing',
            keywords: ['pricing', 'price', 'cost', 'how much', 'rates', 'budget', 'fee', 'charge', 'expensive', 'affordable', 'kitna', 'paisa', 'package', 'plan', 'packages', 'plans', 'quote', 'estimate'],
            response: () => `Our commercial framework is built around total transparency:\n\n**Turnkey Investment:** Fixed, transparent project proposals customized for your club's discipline (Chess, Tennis, Badminton, or Multi-Sport).\n\n**Guarantees on Every Deployment:**\n• **0% Revenue Cut** — You retain 100% of member dues and court fees\n• **14-Day Delivery Guarantee** — Or we work without charge until complete\n• **Zero-Downtime Migration** — Flawless transition from your existing website\n• **30-Day Hypercare** — Dedicated post-launch adjustments and staff training\n\n**Direct Ownership:**\n• Payments flow directly into your own Stripe account\n• No vendor lock-in or recurring transaction fees\n\nWould you like to schedule a quick 30-minute discovery call to receive an exact quote?`,
            chips: ['Book a free strategy call', 'What guarantees do you offer?', 'How does the 14-day process work?'],
            actions: [
                { label: 'Schedule Strategy Call', url: 'https://calendly.com/sujalprajapati7217/30min' }
            ]
        },

        // ---- PROCESS / TIMELINE ----
        {
            id: 'process',
            keywords: ['process', 'timeline', 'how long', 'how does it work', '14 day', '14-day', 'turnaround', 'launch', 'delivery', 'workflow', 'steps', 'timeline', 'time take', 'kitna time', 'kab tak', 'duration'],
            response: () => `Our **14-Day Launch Methodology** is engineered for speed without compromising quality:\n\n**Phase 1 — Discovery & Alignment (Day 1)**\nAnalyze your target market, competitors, operational hurdles, and establish project milestones.\n\n**Phase 2 — Architecture & Wireframing (Days 2-3)**\nMap member portals, tournament funnels, court booking rules, and integration schemas.\n\n**Phase 3 — UI Engineering & Integration (Days 4-10)**\nBuild responsive layouts, integrate Stripe billing, and calibrate custom sports logic.\n\n**Phase 4 — Quality Assurance & Launch (Days 11-14)**\nDomain routing, automated testing, local SEO configuration, and live 1-on-1 staff training.\n\n**Commercial Guarantee:** If we do not deploy within 14 days, we work without charge until completed.`,
            chips: ['What\'s included in every package?', 'Book a discovery call', 'Show me case studies']
        },

        // ---- CHESS-SPECIFIC ----
        {
            id: 'chess',
            keywords: ['chess', 'chess club', 'chess academy', 'uscf', 'fide', 'tournament', 'pairing', 'pgn', 'swiss', 'round robin', 'bracket', 'chess rating', 'chess website'],
            response: () => `**Chess Academy Blueprint — Specialized Features:**\n\n**FIDE & USCF Rating Synchronization**\nInstant rating lookups and verified tournament entry for all enrolled members.\n\n**Swiss & Round-Robin Pairing Engine**\nBuchholz tiebreaks, automated round publishing, and live board displays.\n\n**Interactive PGN Viewer & Daily Puzzles**\nEngage students with embedded game analysis and daily tactical challenges.\n\n**Automated Tuition Invoicing**\nSemester & camp payments via Stripe with recurring billing.\n\n**Operational Results:**\n• 14.5+ administrative hours saved weekly\n• 100% pairing accuracy with zero manual errors\n• Camp registration slots fill up rapidly online\n\nExplore our live Chess deployment:`,
            chips: ['View Chess Demo Site', 'How much does it cost?', 'Book a free call', 'Tennis features'],
            actions: [
                { label: 'Explore Royal Knights Chess Club', url: 'https://royalknigthschessclub.vercel.app/' }
            ]
        },

        // ---- TENNIS-SPECIFIC ----
        {
            id: 'tennis',
            keywords: ['tennis', 'tennis club', 'court booking', 'court reservation', 'padel', 'utr', 'racquet', 'tennis website', 'court schedule'],
            response: () => `**Tennis & Padel Club Blueprint — Specialized Features:**\n\n**Multi-Surface Visual Court Pegboard**\nReal-time booking across Clay, Hard, Grass, and Padel surfaces with dynamic lighting fee calculation.\n\n**1-Click Weather Alert Broadcast**\nInstant SMS notifications to all booked court holders during weather interruptions.\n\n**UTR & Club Ladder Rankings**\nUniversal Tennis Rating sync and dynamic competitive ladder rankings.\n\n**Clinic & Private Lesson Split-Billing**\nAutomated payment distribution between club management and coaching staff.\n\n**Operational Results:**\n• 94% average court capacity utilization\n• Court bookings completed in under 10 seconds\n• Replaced manual phone bookings entirely\n\nExplore our live Tennis deployment:`,
            chips: ['View Tennis Demo Site', 'How much does it cost?', 'Book a free call', 'Chess features'],
            actions: [
                { label: 'Explore Ace Reserve Tennis Club', url: 'https://acereversetennisclub.vercel.app/' }
            ]
        },

        // ---- BADMINTON-SPECIFIC ----
        {
            id: 'badminton',
            keywords: ['badminton', 'badminton center', 'shuttlecock', 'badminton club', 'drop-in', 'stringing', 'badminton website'],
            response: () => `**Badminton Center Blueprint — Specialized Features:**\n\n**Digital Drop-In Pegboard with Display Board**\nFair 15-minute rotation queue and self-check-in for open play sessions.\n\n**Dynamic Peak & Off-Peak Pricing**\nAutomated hourly pricing rules based on prime-time court demand.\n\n**Racket Stringing CRM**\nTension specs, string selections, order status tracking, and automated pickup SMS.\n\n**Shuttlecock Punch-Pass & QR Check-ins**\nContactless admission and digital multi-session passes.\n\n**Operational Results:**\n• 40% faster front desk intake\n• 2.4x increase in stringing service revenue\n• 15+ front-desk hours saved weekly`,
            chips: ['How much does it cost?', 'Book a free call', 'Chess features', 'Tennis features']
        },

        // ---- MULTI-SPORT ----
        {
            id: 'multisport',
            keywords: ['multi-sport', 'multi sport', 'facility', 'athletic complex', 'gym', 'sports complex', 'all sports', 'multiple sports'],
            response: () => `🏟️ **Multi-Sport Facility Blueprint:**\n\n**Unified Family All-Access Passes**\nSingle pass across tennis, turf, gym, and camps.\n\n**Multi-Zone Resource Management**\nPrevents double-bookings across all facility zones.\n\n**24/7 AI Receptionist & Call Concierge**\nHandles membership tours and sales inquiries automatically.\n\n**Digital Liability E-Waivers**\nAuto-attached to member records — 100% paperless.\n\n📊 **Impact:**\n• **35+ hours/week** admin workload saved\n• **100% paperless** waiver compliance`,
            chips: ['Book a free strategy call', 'How much does it cost?', 'View case studies']
        },

        // ---- CASE STUDIES / PORTFOLIO ----
        {
            id: 'portfolio',
            keywords: ['case study', 'case studies', 'portfolio', 'demo', 'examples', 'sample', 'work', 'showcase', 'previous work', 'past work', 'website examples', 'show me', 'dikhao'],
            response: () => `Here are our **live case studies** — real sports club websites we've built:\n\n**♟️ Royal Knights Chess Club**\n*Chess Academy & Tournament Hub*\nDigital platform with tournament schedules, program registrations, and interactive training resources.\n\n**🎾 Ace Reserve — Miami, FL**\n*Tennis Club • 3200 Grand Ave, Coconut Grove*\nVisual court bookings, member dashboards, coaching schedules, and event registration.\n\n**🏸 Elite Badminton Arena — Aurora, IL**\n*Badminton Center*\nAutomated ticket registrations, youth training camps, and live ladder league standings.\n\nClick below to explore the live demos! 👇`,
            chips: ['Book a free call', 'How much does it cost?', 'What services do you offer?'],
            actions: [
                { label: '♟️ Royal Knights Chess', url: 'https://royalknigthschessclub.vercel.app/' },
                { label: '🎾 Ace Reserve Tennis', url: 'https://acereversetennisclub.vercel.app/' }
            ]
        },

        // ---- CONTACT ----
        {
            id: 'contact',
            keywords: ['contact', 'email', 'phone', 'reach', 'call', 'talk', 'meet', 'schedule', 'book', 'consultation', 'calendly', 'appointment', 'connect', 'sampark'],
            response: () => `Here's how to reach the **WebXHere Studio** team:\n\n📧 **Email:** hello@webxhere.studio\n📅 **Free Strategy Call:** Book a 30-minute no-obligation consultation\n🌎 **Service Area:** Serving sports clubs across the United States\n\nThe best way to get started is with a **free 30-minute strategy call** where we'll:\n• Analyze your club's needs\n• Show relevant demos\n• Provide a custom quote\n• Map out your 14-day launch plan`,
            chips: ['What services do you offer?', 'How much does it cost?', 'Tell me about the process'],
            actions: [
                { label: '📅 Book Free Strategy Call', url: 'https://calendly.com/sujalprajapati7217/30min' },
                { label: '📧 Email Us', url: 'mailto:hello@webxhere.studio' }
            ]
        },

        // ---- WHY CHOOSE / COMPARISON ----
        {
            id: 'why_choose',
            keywords: ['why choose', 'why webxhere', 'advantage', 'different', 'unique', 'better', 'vs', 'compared', 'competition', 'competitors', 'wordpress', 'squarespace', 'wix', 'generic', 'special'],
            response: () => `**The WebXHere Unfair Advantage** — here's how we compare:\n\n| | Traditional Agency | **WebXHere** |\n|---|---|---|\n| ⏱️ Turnaround | 3-6 months at \\$150/hr | **14 Days Guaranteed** |\n| 🔧 Software | Fragile WordPress plugins | **Custom Native Sports Engine** |\n| 💰 Fees | 2%-5% transaction cuts | **0% Commission** |\n| 🤖 Operations | Manual spreadsheets | **24/7 AI Concierge** |\n| 🛟 Support | Generic forum tickets | **30-Day Hypercare + 1-on-1 Training** |\n\n**3 Core Engineering Principles:**\n1. 🎯 **Sports-First UX** — Built for registrations, bookings & brackets (not generic templates)\n2. ⚡ **Zero-Bulk Engineering** — Pure SPA, vanilla JS, sub-500ms loads\n3. 🔒 **Secured Operations** — PCI-DSS compliant, direct Stripe`,
            chips: ['What services do you offer?', 'Show me case studies', 'Book a free call']
        },

        // ---- FAQ: PAYMENT/STRIPE ----
        {
            id: 'payment',
            keywords: ['payment', 'stripe', 'pay', 'membership dues', 'dues', 'apple pay', 'google pay', 'transaction', 'billing', 'invoice', 'subscription', 'commission', 'revenue cut'],
            response: () => `💳 **Payments & Billing — What You Need to Know:**\n\nYes! We integrate **direct payment processing** into your club website:\n\n• **Stripe Connect** — Direct deposits to YOUR account\n• **Apple Pay & Google Pay** — Mobile-friendly checkout\n• **ACH Direct** — Bank transfers supported\n• **Recurring Billing** — Automated monthly/annual membership dues\n• **Tournament & Event Fees** — One-time payments for registrations\n\n🚫 **ZERO Platform Commission:**\nUnlike other platforms that take 2%-5% cuts, WebXHere charges **0% transaction fee**. 100% of your revenue goes straight to your Stripe account.\n\n💡 Example volumes we support: \\$18.4k+/month automated dues processing.`,
            chips: ['How much does it cost?', 'What about security?', 'Book a free call']
        },

        // ---- FAQ: DOMAIN/EMAIL ----
        {
            id: 'domain',
            keywords: ['domain', 'email', 'custom domain', 'dns', 'hosting', 'website address', 'club email', 'google workspace', 'migration'],
            response: () => `🌐 **Domain & Email Migration — Seamless Transition:**\n\nYes, you can **100% keep your existing:**\n• ✅ Custom domain (e.g., yourclub.com)\n• ✅ Google Workspace / Microsoft 365 club emails\n• ✅ Phone forwarding & numbers\n\nWe handle all **DNS record cutovers** with **zero downtime**. Your members won't experience any interruption during the switch.\n\n🛡️ **Zero-Downtime Migration Guarantee** — We transfer member rosters, court data, and domains without interrupting club operations.`,
            chips: ['How long does it take?', 'What about security?', 'Book a free call']
        },

        // ---- FAQ: CMS / UPDATES ----
        {
            id: 'cms',
            keywords: ['cms', 'content management', 'update', 'edit', 'manage', 'change content', 'coding knowledge', 'front desk', 'staff', 'modify', 'no code', 'no coding'],
            response: () => `📝 **Easy Content Management — No Coding Required!**\n\nAbsolutely NO coding knowledge needed! We deliver a **beginner-friendly visual CMS** where your staff can:\n\n• ✏️ Add clinics & events\n• 👤 Update coach bios & photos\n• 🏆 Post tournament draws & results\n• ⏰ Adjust court/table hours\n• 📰 Publish news & blog posts\n\n⚡ Everything can be updated in **under 60 seconds** from any phone or laptop. We also provide **1-on-1 staff onboarding video training** during the 30-day hypercare period.`,
            chips: ['What about security?', 'How much does it cost?', 'Book a free call']
        },

        // ---- FAQ: OWNERSHIP ----
        {
            id: 'ownership',
            keywords: ['own', 'ownership', 'code ownership', 'who owns', 'vendor lock', 'lock-in', 'source code', 'my website'],
            response: () => `✅ **100% Client Ownership — Zero Vendor Lock-In:**\n\nYou own **everything**:\n• 📁 Full website source code\n• 🖼️ All media assets\n• 👥 Customer database\n• 📄 Complete documentation\n\nAll source files are **fully transferred** upon delivery. There's absolutely zero vendor lock-in — you can host it anywhere, modify it, or hand it to another developer. It's YOUR property.`,
            chips: ['What services do you offer?', 'How much does it cost?', 'Book a free call']
        },

        // ---- FAQ: SECURITY ----
        {
            id: 'security',
            keywords: ['security', 'secure', 'ssl', 'safe', 'protect', 'pci', 'compliance', 'data', 'privacy'],
            response: () => `🔒 **Security & Performance — Enterprise-Grade:**\n\n• **Bank-Grade SSL** — Encrypted connections for all data\n• **PCI-DSS Compliant** — Secure payment processing standards\n• **Clean SPA Architecture** — No vulnerable third-party plugins\n• **Sub-500ms Load Times** — 95+ PageSpeed scores\n• **Automated E-Waivers** — Digitally signed and stored\n• **Direct Stripe Integration** — No middleman touching payment data`,
            chips: ['Tell me about payments', 'What services do you offer?', 'Book a free call']
        },

        // ---- INTEGRATIONS ----
        {
            id: 'integrations',
            keywords: ['integration', 'integrate', 'api', 'connect', 'zapier', 'twilio', 'mailchimp', 'google calendar', 'outlook', 'whatsapp', 'sms', 'tools'],
            response: () => `🔌 **Native Integrations Ecosystem:**\n\n**Payments:**\n• Stripe Connect, Apple Pay, Google Pay, ACH Direct\n\n**Sports & Ratings:**\n• USCF API, FIDE Sync, UTR, Lichess/Chess.com broadcasts\n\n**Scheduling:**\n• CourtReserve, ClubAutomation, Google Calendar, Outlook, iCal\n\n**Communication:**\n• Twilio SMS, WhatsApp Business API, Mailchimp, Zapier Webhooks\n\nAll integrations are **natively built** — no flimsy third-party plugins that break on updates.`,
            chips: ['What services do you offer?', 'How much does it cost?', 'Book a free call']
        },

        // ---- AI CHATBOT / VOICE ----
        {
            id: 'ai_features',
            keywords: ['ai', 'chatbot', 'voice agent', 'artificial intelligence', 'automation', 'concierge', 'bot', 'automated'],
            response: () => `🤖 **AI-Powered Features We Build for Your Club:**\n\n**24/7 AI Club Concierge (Chat)**\nAn AI assistant on your website that answers member questions, explains programs, qualifies leads, and facilitates bookings — even at 2 AM.\n\n**AI Voice Agent (Phone)**\nAutonomous voice agent that handles inbound phone calls, answers FAQs, qualifies trial leads, and texts booking links.\n\n**AI SEO & Metadata**\nAI-assisted local SEO schema and sports metadata to rank high in Google searches.\n\n**Business Automation**\nWorkflow automation connecting inquiries → registrations → confirmations → reminders across all tools.\n\n**Automated Alerts**\nSMS & WhatsApp notifications for bookings, weather rainouts, and event reminders.`,
            chips: ['How much does it cost?', 'Show me case studies', 'Book a free call']
        },

        // ---- TESTIMONIALS ----
        {
            id: 'testimonials',
            keywords: ['testimonial', 'review', 'feedback', 'client', 'what clients say', 'success story', 'results'],
            response: () => `⭐ **What Our Clients Say (All 5/5 Stars):**\n\n🎾 **Marcus Vance** — *Ridgeview Tennis Club*\n*"Court bookings went from endless phone calls to 100% automated. Members picked it up on day one."*\n\n♟️ **Sarah Jenkins** — *Metro Youth Chess Academy*\n*"Tournament slots filled up within 48 hours. Parents love the effortless mobile sign-ups."*\n\n🏸 **Kevin Zhang** — *Bay Badminton Center*\n*"The live court booking calendar saved our front desk 15 hours every week."*\n\n🏋️ **Linda Martinez** — *Horizon Sports Complex*\n*"Within two weeks, clinic inquiries doubled. The speed and mobile experience built instant credibility."*\n\n**Elizabeth Miller** — *Apex Racquet Club*\n*"We stopped chasing monthly dues manually. Recurring Stripe setup works reliably."*`,
            chips: ['Show me case studies', 'Book a free call', 'What services do you offer?']
        },

        // ---- BOOKING SYSTEM ----
        {
            id: 'booking',
            keywords: ['booking', 'book court', 'reserve', 'reservation', 'schedule court', 'court booking', 'table booking', 'book a court'],
            response: () => `📅 **Online Booking Systems We Build:**\n\nOur booking system is purpose-built for sports clubs:\n\n• **Visual Court/Table Grid** — Real-time availability at a glance\n• **1-Tap Mobile Booking** — Members book in under 10 seconds\n• **Integrated Payments** — Pay at booking via Stripe/Apple Pay\n• **Dynamic Pricing** — Peak/off-peak hourly rates\n• **Automated Confirmations** — Email + SMS booking confirmations\n• **Weather Rainout Alerts** — 1-click mass SMS to affected bookers\n• **Multi-Surface Support** — Clay, Hard, Grass, Padel courts\n\n📊 Our clients see **94% court capacity utilization** with automated bookings.`,
            chips: ['How much does it cost?', 'View Tennis Demo', 'Book a free call']
        },

        // ---- MEMBERSHIP ----
        {
            id: 'membership',
            keywords: ['membership', 'member', 'registration', 'sign up', 'join', 'enroll', 'enrollment', 'member portal', 'dashboard'],
            response: () => `👥 **Membership Management System:**\n\n• **Digital Registration** — Online sign-up with instant account creation\n• **Member Dashboards** — Personal portals showing bookings, dues, history\n• **Automated Renewals** — Recurring Stripe billing (monthly/annual)\n• **Self-Service Portals** — Members manage their own profiles & bookings\n• **Family Accounts** — Linked profiles for families\n• **Trial Lesson Funnels** — Convert visitors to paid members\n\n💰 **0% Commission** — All membership dues go directly to your Stripe account. No platform cuts, ever.`,
            chips: ['Tell me about payments', 'How much does it cost?', 'Book a free call']
        },

        // ---- THANK YOU ----
        {
            id: 'thanks',
            keywords: ['thank', 'thanks', 'thank you', 'appreciate', 'helpful', 'great', 'awesome', 'perfect', 'nice', 'wonderful', 'shukriya', 'dhanyavad'],
            response: () => `You're welcome! 😊 I'm glad I could help!\n\nIf you're ready to take the next step, here are your options:\n\n📅 **Book a free 30-min strategy call** — Get a custom quote\n📧 **Email us** at hello@webxhere.studio\n🌐 **Browse our demos** to see live examples\n\nFeel free to ask me anything else anytime! 🙌`,
            chips: ['Book a free call', 'Show me demos', 'Email the team'],
            actions: [
                { label: '📅 Book Strategy Call', url: 'https://calendly.com/sujalprajapati7217/30min' }
            ]
        },

        // ---- GOODBYE ----
        {
            id: 'goodbye',
            keywords: ['bye', 'goodbye', 'see you', 'later', 'quit', 'exit', 'close', 'end'],
            response: () => `Goodbye! 👋 It was great chatting with you!\n\nRemember, we're always here when you're ready to take your sports club digital. Don't hesitate to come back!\n\n📧 hello@webxhere.studio\n📅 Free strategy call anytime at Calendly`,
            chips: ['Actually, one more question', 'Book a free call']
        },

        // ---- GUARANTEE ----
        {
            id: 'guarantee',
            keywords: ['guarantee', 'guarantees', 'warranty', 'promise', 'refund', 'risk', 'what if'],
            response: () => `🛡️ **Our 4 Iron-Clad Guarantees:**\n\n1. **0% Revenue Cut Guarantee**\nFull revenue ownership — all dues deposit directly to your account.\n\n2. **14-Day Delivery Guarantee**\nProduction-ready launch in 14 days, or we work for **FREE** until completed.\n\n3. **Zero-Downtime Migration Guarantee**\nMember rosters, court data, and domains transfer without interrupting club play.\n\n4. **30-Day Hypercare Guarantee**\n30 days of free post-launch adjustments + 1-on-1 staff onboarding video training.\n\nWe put our money where our mouth is! 💪`,
            chips: ['How much does it cost?', 'Book a free call', 'What services do you offer?']
        },

        // ---- SEO / MARKETING ----
        {
            id: 'seo',
            keywords: ['seo', 'google', 'search engine', 'ranking', 'marketing', 'visibility', 'traffic', 'leads', 'lead generation'],
            response: () => `📈 **SEO & Lead Generation:**\n\n**AI SEO & Local Discovery**\n• AI-assisted local SEO schema\n• Sports-specific metadata markup\n• Structured content for Google rankings\n• Local map pack optimization\n\n**Lead Generation Systems**\n• High-converting inquiry forms\n• Trial lesson funnels\n• Automated lead qualification\n• Traffic → Member conversion flows\n\n**Performance Metrics:**\n• Sub-500ms load times (Google loves fast sites!)\n• 95+ PageSpeed scores\n• Mobile-first indexing optimized\n\nOur clients see **doubled clinic inquiries** within 2 weeks of launch.`,
            chips: ['What services do you offer?', 'How much does it cost?', 'Book a free call']
        },

        // ---- EVENT / TOURNAMENT ----
        {
            id: 'events',
            keywords: ['event', 'tournament', 'clinic', 'camp', 'registration', 'rsvp', 'sign up', 'bracket'],
            response: () => `🏆 **Event & Tournament Systems:**\n\n**Event Registration**\n• End-to-end clinic sign-ups & camp management\n• RSVP tracking with digital confirmations\n• Automated schedule publishing\n\n**Tournament Systems**\n• Landing pages with brackets (Swiss, Round Robin, Single/Double Elimination)\n• Real-time results & live pairing boards\n• USCF/FIDE rating integration for chess\n• Automated round publishing\n• Buchholz tiebreak calculation\n\n📊 **Results:** Tournament slots fill up within 48 hours, and operations run 2x smoother with digital management.`,
            chips: ['Chess club features', 'Tennis club features', 'Book a free call']
        },
    ];

    // ---- FALLBACK (Natural, human-like AI assistance) ----
    const FALLBACK_RESPONSE = {
        text: `I hear you! As an AI concierge specializing in sports club architecture and operations, I want to make sure you get the exact right answer.\n\nCould you tell me a little more about what you need? For example, I can help you with:\n• **Club Platform Features** — Court reservations, FIDE rating sync, or member portals\n• **Pricing & Timeline** — Fixed turnkey packages and our 14-day launch guarantee\n• **Live Case Studies** — Production sites for Chess, Tennis, and Badminton\n• **Direct Consultation** — Booking a 1-on-1 strategy call with our lead engineer\n\nWhat would you like to explore?`,
        chips: ['What services do you offer?', 'How much does it cost?', 'Show me case studies', 'Book a strategy call'],
        actions: [
            { label: '📅 Book 1-on-1 Strategy Call', url: 'https://calendly.com/sujalprajapati7217/30min' },
            { label: '📧 Email Us Directly', url: 'mailto:hello@webxhere.studio' }
        ]
    };


    // ========================================================================
    //  4. INTENT CLASSIFICATION ENGINE
    // ========================================================================

    function normalizeText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function classifyIntent(userMessage) {
        const normalized = normalizeText(userMessage);
        const words = normalized.split(' ');
        let bestMatch = null;
        let bestScore = 0;

        for (const intent of INTENTS) {
            let score = 0;

            for (const keyword of intent.keywords) {
                const kw = keyword.toLowerCase();
                // Exact full message match (highest priority)
                if (normalized === kw) {
                    score += kw.split(' ').length * 4 + 6;
                } else if (normalized.includes(kw)) {
                    // Exact phrase match
                    score += kw.split(' ').length * 4;
                }
                // Individual word match
                const kwWords = kw.split(' ');
                for (const kwWord of kwWords) {
                    if (words.includes(kwWord)) {
                        score += 1;
                    }
                    // Fuzzy starts-with match
                    for (const w of words) {
                        if (w.length >= 3 && kwWord.startsWith(w)) {
                            score += 0.5;
                        }
                        if (w.length >= 3 && w.startsWith(kwWord)) {
                            score += 0.5;
                        }
                    }
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = intent;
            }
        }

        // Require minimum score threshold
        return bestScore >= 1.5 ? bestMatch : null;
    }


    // ========================================================================
    
    // ========================================================================
    
    // ========================================================================
    //  5. ADVANCED CHAT ENGINE & MULTI-FEATURE SUITE
    // ========================================================================

    function formatTime(dateObj) {
        const d = dateObj ? new Date(dateObj) : new Date();
        let hours = d.getHours();
        const mins = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${mins} ${ampm}`;
    }

    // Web Audio Subtle Sound Effects
    let audioCtx = null;
    function playChatSound(type) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'send') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(560, now);
                osc.frequency.exponentialRampToValueAtTime(840, now + 0.07);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
                osc.start(now);
                osc.stop(now + 0.07);
            } else if (type === 'receive') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(820, now);
                osc.frequency.exponentialRampToValueAtTime(620, now + 0.1);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        } catch (e) {}
    }

    // Text-to-Speech (Speaker) Engine
    function stopSpeech() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        if (currentSpeakingBtn) {
            currentSpeakingBtn.classList.remove('speaking');
            currentSpeakingBtn = null;
        }
    }

    function speakText(rawText, triggerBtn) {
        if (!('speechSynthesis' in window)) {
            showToast('Text-to-speech not supported in this browser.');
            return;
        }

        // Toggle off if currently speaking
        if (currentSpeakingBtn === triggerBtn && window.speechSynthesis.speaking) {
            stopSpeech();
            showToast('Voice paused 🔇');
            return;
        }

        stopSpeech();

        // Strip markdown and emojis for clean natural voice reading
        const cleanText = rawText
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/&bull;/g, '')
            .replace(/[🤖👋🏗️💰♟️🎾🏸📋📞⬇️💡⚡🎯✓]/g, '')
            .trim();

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = speechRate;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Jenny')));
        if (preferredVoice) utterance.voice = preferredVoice;

        if (triggerBtn) {
            triggerBtn.classList.add('speaking');
            currentSpeakingBtn = triggerBtn;
        }

        utterance.onend = () => {
            if (triggerBtn) triggerBtn.classList.remove('speaking');
            if (currentSpeakingBtn === triggerBtn) currentSpeakingBtn = null;
        };

        utterance.onerror = () => {
            if (triggerBtn) triggerBtn.classList.remove('speaking');
            if (currentSpeakingBtn === triggerBtn) currentSpeakingBtn = null;
        };

        window.speechSynthesis.speak(utterance);
    }

    function updateVoiceButtonUI() {
        if (isVoiceAutoSpeak) {
            voiceToggleBtn.classList.add('active');
            voiceIconOn.style.display = 'inline-flex';
            voiceIconOff.style.display = 'none';
            voiceToggleBtn.setAttribute('data-tooltip', 'Auto-Voice: ON');
        } else {
            voiceToggleBtn.classList.remove('active');
            voiceIconOn.style.display = 'none';
            voiceIconOff.style.display = 'inline-flex';
            voiceToggleBtn.setAttribute('data-tooltip', 'Auto-Voice: OFF');
        }
    }

    // Speech-to-Text (Microphone) Engine
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let speechRecognizer = null;
    let isMicActive = false;

    if (SpeechRecognition) {
        try {
            speechRecognizer = new SpeechRecognition();
            speechRecognizer.continuous = false;
            speechRecognizer.interimResults = true;
            speechRecognizer.lang = 'en-US';

            speechRecognizer.onstart = () => {
                isMicActive = true;
                micBtn.classList.add('listening');
                inputEl.placeholder = 'Listening... Speak now';
                showToast('Listening... Speak now 🎙️');
            };

            speechRecognizer.onresult = (e) => {
                let speechResult = '';
                for (let i = e.resultIndex; i < e.results.length; ++i) {
                    speechResult += e.results[i][0].transcript;
                }
                inputEl.value = speechResult;
            };

            speechRecognizer.onerror = (e) => {
                stopMic();
                if (e.error !== 'no-speech') {
                    showToast('Microphone error: ' + e.error);
                }
            };

            speechRecognizer.onend = () => {
                stopMic();
                if (inputEl.value.trim()) {
                    setTimeout(() => {
                        handleUserMessage(inputEl.value);
                    }, 400);
                }
            };
        } catch (e) {}
    }

    function startMic() {
        if (!speechRecognizer) {
            showToast('Voice input requires Chrome, Edge or Safari.');
            return;
        }
        stopSpeech();
        try {
            speechRecognizer.start();
        } catch (e) {
            stopMic();
        }
    }

    function stopMic() {
        isMicActive = false;
        micBtn.classList.remove('listening');
        inputEl.placeholder = 'Ask anything about our club services...';
        try {
            if (speechRecognizer) speechRecognizer.stop();
        } catch (e) {}
    }

    // Render Message with Copy, Speaker, and User/Bot Header Tags
    function addMessage(text, sender, actions, savedTime) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `wxh-msg ${sender}`;

        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^\`]+)`/g, '<code class="wxh-inline-code">$1</code>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '&bull; ')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        let actionsHtml = '';
        if (actions && actions.length > 0) {
            actionsHtml = '<div class="wxh-msg-actions">' +
                actions.map(a => {
                    if (a.url) {
                        return `<a href="${a.url}" target="_blank" rel="noopener" class="wxh-msg-action-btn">${a.label} ${ICON_ARROW}</a>`;
                    }
                    return `<button class="wxh-msg-action-btn" data-action="${a.action || ''}">${a.label}</button>`;
                }).join('') +
                '</div>';
        }

        const timeStr = savedTime || formatTime();
        const headerTag = sender === 'user' ? 
            `<div class="wxh-msg-header-tag"><span>You</span></div>` :
            `<div class="wxh-msg-header-tag"><span>AI Concierge</span></div>`;

        // Footer tools (Copy + Speaker for bot, Copy for user)
        let toolsHtml = `
            <div class="wxh-msg-tools">
                <button class="wxh-msg-tool-btn wxh-tool-copy" title="Copy message" aria-label="Copy message">
                    <span class="wxh-copy-icon">${ICON_COPY}</span>
                </button>
        `;

        if (sender === 'bot') {
            toolsHtml += `
                <button class="wxh-msg-tool-btn wxh-tool-speak" title="Listen / Read aloud" aria-label="Listen">
                    <span class="wxh-speaker-icon">${ICON_SPEAKER}</span>
                    <span class="wxh-sound-waves"><span></span><span></span><span></span></span>
                </button>
            `;
        }

        toolsHtml += `</div>`;

        msgDiv.innerHTML = `
            ${headerTag}
            <div class="wxh-msg-bubble">${html}${actionsHtml}</div>
            <div class="wxh-msg-footer">
                <span class="wxh-msg-time">${timeStr}</span>
                ${toolsHtml}
            </div>
        `;

        // Copy Button Event
        const copyBtn = msgDiv.querySelector('.wxh-tool-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const plainText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/\[(.*?)\]\(.*?\)/g, '$1');
                navigator.clipboard.writeText(plainText).then(() => {
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = `${ICON_CHECK} <span>Copied!</span>`;
                    showToast('Message copied to clipboard ✓');
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = `<span class="wxh-copy-icon">${ICON_COPY}</span>`;
                    }, 2000);
                }).catch(() => {});
            });
        }

        // Speaker Button Event (Bot only)
        const speakBtn = msgDiv.querySelector('.wxh-tool-speak');
        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                speakText(text, speakBtn);
            });
        }

        messagesEl.appendChild(msgDiv);
        scrollToBottom();

        // Persist message in active session
        if (!savedTime && activeSession) {
            activeSession.messages.push({
                text,
                sender,
                actions: actions || [],
                time: timeStr
            });
            if (sender === 'user' && (!activeSession.title || activeSession.title === 'New Conversation')) {
                activeSession.title = text.length > 36 ? text.substring(0, 36) + '...' : text;
            }
            activeSession.updatedAt = Date.now();
            saveSessionsToStorage();
        }

        // Auto-play sound & auto-speech
        if (!savedTime) {
            playChatSound(sender === 'user' ? 'send' : 'receive');
            if (sender === 'bot' && isVoiceAutoSpeak) {
                setTimeout(() => {
                    if (speakBtn) speakText(text, speakBtn);
                }, 200);
            }
        }
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
        requestAnimationFrame(() => {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        });
    }

    function showTyping() {
        typingEl.classList.add('show');
        messagesEl.appendChild(typingEl);
        scrollToBottom();
    }

    function hideTyping() {
        typingEl.classList.remove('show');
    }

    function setQuickReplies(chips) {
        quickRepliesEl.innerHTML = '';
        if (!chips || chips.length === 0) return;

        chips.forEach(label => {
            const chip = document.createElement('button');
            chip.className = 'wxh-qr-chip';
            chip.textContent = label;
            chip.addEventListener('click', () => {
                handleUserMessage(label);
            });
            quickRepliesEl.appendChild(chip);
        });
    }

    function handleUserMessage(text) {
        if (!text || !text.trim()) return;

        ensureActiveSession();

        // Add user message
        addMessage(text.trim(), 'user');
        inputEl.value = '';
        quickRepliesEl.innerHTML = '';

        const baseDelay = 550;
        const randomExtra = Math.random() * 550;

        showTyping();

        setTimeout(() => {
            hideTyping();

            const intent = classifyIntent(text);

            if (intent) {
                const responseText = intent.response();
                addMessage(responseText, 'bot', intent.actions || []);
                setQuickReplies(intent.chips || []);
            } else {
                addMessage(FALLBACK_RESPONSE.text, 'bot', FALLBACK_RESPONSE.actions);
                setQuickReplies(FALLBACK_RESPONSE.chips);
            }
        }, baseDelay + randomExtra);
    }

    function sendWelcomeMessage() {
        const greeting = getTimeGreeting();
        const welcomeText = `${greeting}! Welcome to **WebXHere Studio**. I am your concierge for sports club digital platforms and web architecture.

How can I assist your academy or club today?
• **Club Platform Features** — Automated court scheduling, FIDE/Elo rating sync, live tournament brackets
• **Investment & Packages** — Transparent turnkey pricing with 0% commission on member dues
• **Interactive Showcase** — Walkthroughs of our Chess, Tennis, and Badminton deployments
• **Discovery Consultation** — Schedule a direct strategy call with our engineering team

Select a topic below or type any question.`;

        if (window.location.search.includes("open_chat")) {
            addMessage(welcomeText, 'bot');
            setQuickReplies(['What services do you offer?', 'How much does it cost?', 'Show me demos', 'Book a free call', 'Why choose WebXHere?']);
            requestAnimationFrame(() => { if (messagesEl.children.length <= 1) messagesEl.scrollTop = 0; });
            return;
        }

        setTimeout(() => {
            showTyping();
            setTimeout(() => {
                hideTyping();
                addMessage(welcomeText, 'bot');
                setQuickReplies(['What services do you offer?', 'How much does it cost?', 'Show me demos', 'Book a free call', 'Why choose WebXHere?']);
                requestAnimationFrame(() => { if (messagesEl.children.length <= 1) messagesEl.scrollTop = 0; });
            }, 500);
        }, 200);
    }

    // ========================================================================
    //  6. CHAT HISTORY DRAWER & SESSION MANAGEMENT
    // ========================================================================

    function createNewSession() {
        stopSpeech();
        const newSession = {
            id: 'session_' + Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            title: 'New Conversation',
            messages: []
        };
        allSessions.unshift(newSession);
        activeSession = newSession;
        saveSessionsToStorage();

        messagesEl.innerHTML = '';
        quickRepliesEl.innerHTML = '';
        sendWelcomeMessage();
        closeHistoryDrawer();
        showToast('Started new conversation ✨');
    }

    function ensureActiveSession() {
        if (!activeSession) {
            if (allSessions.length > 0) {
                activeSession = allSessions[0];
            } else {
                activeSession = {
                    id: 'session_' + Date.now(),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    title: 'New Conversation',
                    messages: []
                };
                allSessions.unshift(activeSession);
                saveSessionsToStorage();
            }
        }
    }

    function switchSession(sessionId) {
        stopSpeech();
        const found = allSessions.find(s => s.id === sessionId);
        if (!found) return;

        activeSession = found;
        messagesEl.innerHTML = '';
        quickRepliesEl.innerHTML = '';

        if (found.messages.length === 0) {
            sendWelcomeMessage();
        } else {
            found.messages.forEach(m => {
                addMessage(m.text, m.sender, m.actions, m.time);
            });
            setQuickReplies(['What services do you offer?', 'How much does it cost?', 'Show me demos', 'Book a free call']);
        }

        closeHistoryDrawer();
        showToast('Switched to saved conversation');
    }

    function deleteSession(sessionId, e) {
        if (e) e.stopPropagation();
        openModal(
            'Delete Conversation?',
            'This conversation will be permanently removed from your history.',
            'Delete',
            () => {
                allSessions = allSessions.filter(s => s.id !== sessionId);
                saveSessionsToStorage();

                if (activeSession && activeSession.id === sessionId) {
                    if (allSessions.length > 0) {
                        switchSession(allSessions[0].id);
                    } else {
                        createNewSession();
                    }
                }
                renderHistoryDrawer();
                showToast('Conversation deleted 🗑️');
            }
        );
    }

    function clearAllHistory() {
        openModal(
            'Delete All History?',
            'All your saved chat conversations will be wiped out permanently.',
            'Delete All',
            () => {
                allSessions = [];
                saveSessionsToStorage();
                createNewSession();
                renderHistoryDrawer();
                showToast('All chat history deleted 🗑️');
            }
        );
    }

    function renderHistoryDrawer(filterText) {
        historyListEl.innerHTML = '';
        const search = (filterText || '').toLowerCase().trim();

        const filtered = allSessions.filter(s => {
            if (!search) return true;
            if (s.title && s.title.toLowerCase().includes(search)) return true;
            return s.messages && s.messages.some(m => m.text && m.text.toLowerCase().includes(search));
        });

        if (filtered.length === 0) {
            historyListEl.innerHTML = `
                <div class="wxh-history-empty">
                    <span>${search ? 'No matching conversations found.' : 'No saved chat history yet. Every conversation is automatically archived here!'}</span>
                </div>
            `;
            return;
        }

        filtered.forEach(session => {
            const item = document.createElement('div');
            item.className = 'wxh-history-item' + (activeSession && activeSession.id === session.id ? ' active' : '');
            
            const dateStr = new Date(session.updatedAt || session.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const count = session.messages ? session.messages.length : 0;

            item.innerHTML = `
                <div class="wxh-history-item-top">
                    <span class="wxh-history-item-title">${session.title || 'Conversation'}</span>
                    <button class="wxh-history-item-del" title="Delete conversation">${ICON_TRASH}</button>
                </div>
                <div class="wxh-history-item-meta">
                    <span>${dateStr}</span>
                    <span>${count} msg${count === 1 ? '' : 's'}</span>
                </div>
            `;

            item.addEventListener('click', () => switchSession(session.id));
            const delBtn = item.querySelector('.wxh-history-item-del');
            delBtn.addEventListener('click', (e) => deleteSession(session.id, e));

            historyListEl.appendChild(item);
        });
    }

    function openHistoryDrawer() {
        renderHistoryDrawer();
        historyDrawer.classList.add('open');
        setTimeout(() => historySearchInput.focus(), 200);
    }

    function closeHistoryDrawer() {
        historyDrawer.classList.remove('open');
    }

    // Export Chat Transcript
    function exportChat() {
        if (!activeSession || !activeSession.messages || activeSession.messages.length === 0) {
            showToast('No messages in this chat to export!');
            return;
        }

        const lines = [
            '==================================================================',
            '  WEBXHERE STUDIO — AI Assistant Conversation Transcript',
            `  Date: ${new Date().toLocaleString()}`,
            `  Session: ${activeSession.title || 'Chat'}`,
            '  Website: https://webxhere.studio',
            '==================================================================\n'
        ];

        activeSession.messages.forEach(m => {
            const who = m.sender === 'user' ? 'YOU' : 'WEBXHERE AI';
            lines.push(`[${m.time || '12:00 PM'}] ${who}:`);
            lines.push(m.text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/\[(.*?)\]\(.*?\)/g, '$1') + '\n');
        });

        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `WebXHere_Chat_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Transcript downloaded 📥');
    }

    // Clear Current Active Conversation
    function clearCurrentChat() {
        openModal(
            'Clear Current Conversation?',
            'This will clear all messages in the current session. A fresh welcome message will be started.',
            'Clear Now',
            () => {
                stopSpeech();
                if (activeSession) {
                    activeSession.messages = [];
                    activeSession.title = 'New Conversation';
                    activeSession.updatedAt = Date.now();
                    saveSessionsToStorage();
                }
                messagesEl.innerHTML = '';
                quickRepliesEl.innerHTML = '';
                sendWelcomeMessage();
                showToast('Chat cleared 🧹');
            }
        );
    }


    // ========================================================================
    //  7. EVENT LISTENERS & LIFECYCLE INITIALIZATION
    // ========================================================================

    function toggleChat() {
        isOpen = !isOpen;

        if (isOpen) {
            chatWindow.classList.add('open');
            toggleBtn.classList.add('open');

            ensureActiveSession();

            // If empty session, send welcome greeting
            if (activeSession.messages.length === 0 && messagesEl.children.length === 0) {
                sendWelcomeMessage();
            } else if (messagesEl.children.length === 0) {
                activeSession.messages.forEach(m => {
                    addMessage(m.text, m.sender, m.actions, m.time);
                });
                setQuickReplies(['What services do you offer?', 'How much does it cost?', 'Show me demos', 'Book a free call']);
            }

            setTimeout(() => inputEl.focus(), 400);
        } else {
            chatWindow.classList.remove('open');
            toggleBtn.classList.remove('open');
            closeHistoryDrawer();
            closeModal();
            stopSpeech();
            stopMic();
        }
    }

    // Toggle button click
    toggleBtn.addEventListener('click', toggleChat);

    // Send button
    sendBtn.addEventListener('click', () => {
        handleUserMessage(inputEl.value);
    });

    // Enter key
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage(inputEl.value);
        }
    });

    // Microphone Voice Input Button
    micBtn.addEventListener('click', () => {
        if (isMicActive) {
            stopMic();
        } else {
            startMic();
        }
    });

    // Voice Auto-Speak Toggle in Header
    voiceToggleBtn.addEventListener('click', () => {
        isVoiceAutoSpeak = !isVoiceAutoSpeak;
        try {
            localStorage.setItem(VOICE_PREF_KEY, isVoiceAutoSpeak.toString());
        } catch (e) {}
        updateVoiceButtonUI();
        if (isVoiceAutoSpeak) {
            showToast('Auto-Voice Assistant Active 🔊');
        } else {
            stopSpeech();
            showToast('Auto-Voice Assistant Muted 🔇');
        }
    });

    // Voice Speed Pill Toggle (if present)
    if (speedPill && speedVal) {
        speedPill.addEventListener('click', () => {
            const nextIdx = (speechRates.indexOf(speechRate) + 1) % speechRates.length;
            speechRate = speechRates[nextIdx];
            speedVal.textContent = speechRate.toFixed(1) + 'x';
            try {
                localStorage.setItem(SPEED_PREF_KEY, speechRate.toString());
            } catch (e) {}
            showToast('Voice Speed: ' + speechRate.toFixed(1) + 'x ⚡');
        });
    }

    // History Toggle Button in Header
    historyToggleBtn.addEventListener('click', () => {
        if (historyDrawer.classList.contains('open')) {
            closeHistoryDrawer();
        } else {
            openHistoryDrawer();
        }
    });

    drawerCloseBtn.addEventListener('click', closeHistoryDrawer);
    drawerNewBtn.addEventListener('click', createNewSession);
    drawerClearAllBtn.addEventListener('click', clearAllHistory);

    historySearchInput.addEventListener('input', () => {
        renderHistoryDrawer(historySearchInput.value);
    });

    // Export Chat Button
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            dropdownMenu?.classList.remove('show');
            exportChat();
        });
    }

    // Clear Button in Header
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            dropdownMenu?.classList.remove('show');
            clearCurrentChat();
        });
    }

    // Header close
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', toggleChat);
    }


    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            if (modalBackdrop.classList.contains('show')) {
                closeModal();
            } else if (historyDrawer.classList.contains('open')) {
                closeHistoryDrawer();
            } else {
                toggleChat();
            }
        }
    });

    if (window.location.search.includes("open_chat")) { setTimeout(toggleChat, 50); }
console.log('WebXHere Studio AI Concierge v3.5 initialized.');
})();
