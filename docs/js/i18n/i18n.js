/**
 * i18n - Internationalization System
 * Simple multi-language support without external dependencies
 */

class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.fallbackLanguage = 'en';
    }

    /**
     * Initialize i18n with language preference
     */
    async init(language = null) {
        // Try to get language from localStorage or browser
        this.currentLanguage = language ||
            localStorage.getItem('ancient-tycoon-language') ||
            (navigator.language.startsWith('zh') ? 'zh-CN' : 'en');

        // Load translation files
        await this.loadTranslations(this.currentLanguage);
        await this.loadTranslations(this.fallbackLanguage);

        // Apply translations to current page
        this.updatePageTranslations();
    }

    /**
     * Load translation file for a language
     */
    async loadTranslations(language) {
        try {
            const response = await fetch(`js/i18n/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${language} translations`);
            }
            this.translations[language] = await response.json();
            console.log(`✅ Loaded ${language} translations`);
        } catch (error) {
            console.error(`❌ Error loading ${language} translations:`, error);
        }
    }

    /**
     * Get translated string by key path (e.g., "menu.title")
     * Supports interpolation: t("messages.playerTurn", { player: "Alice" })
     */
    t(keyPath, params = {}) {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLanguage];

        // Navigate through nested object
        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                value = undefined;
                break;
            }
        }

        // Fallback to English if not found
        if (value === undefined) {
            value = this.translations[this.fallbackLanguage];
            for (const key of keys) {
                if (value && typeof value === 'object') {
                    value = value[key];
                } else {
                    value = keyPath; // Return key if not found
                    break;
                }
            }
        }

        // Interpolate parameters
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            value = value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
                return params[key] !== undefined ? params[key] : match;
            });
        }

        return value;
    }

    /**
     * Change current language
     */
    async setLanguage(language) {
        if (this.currentLanguage === language) return;

        // Load translations if not already loaded
        if (!this.translations[language]) {
            await this.loadTranslations(language);
        }

        this.currentLanguage = language;
        localStorage.setItem('ancient-tycoon-language', language);

        // Update all translations on page
        this.updatePageTranslations();

        // Dispatch event for other components to react
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language }
        }));
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Update all elements with data-i18n attribute
     */
    updatePageTranslations() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Update text content
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update elements with data-i18n-html (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });

        // Update page title
        document.title = this.t('menu.title') + ' - ' + this.t('menu.subtitle');
    }

    /**
     * Get all available languages
     */
    getAvailableLanguages() {
        return ['en', 'zh-CN'];
    }

    /**
     * Get language display name
     */
    getLanguageName(language) {
        const names = {
            'en': 'English',
            'zh-CN': '简体中文'
        };
        return names[language] || language;
    }
}

// Create global i18n instance
const i18n = new I18n();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}
