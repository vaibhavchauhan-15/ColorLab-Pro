// URL State Management for Save/Share functionality

/**
 * Encode palette state to URL parameters
 * @param {Object} state - Current app state
 * @returns {string} - URL encoded state
 */
export const encodeStateToURL = (state) => {
    const { activeTab, solidColors, gradientColors } = state;
    
    const stateObj = {
        tab: activeTab,
        solid: solidColors.map(c => c.value),
        gradient: gradientColors.map(c => c.value)
    };
    
    const encoded = btoa(JSON.stringify(stateObj));
    return encoded;
};

/**
 * Decode URL parameters to palette state
 * @param {string} encoded - URL encoded state
 * @returns {Object|null} - Decoded state or null if invalid
 */
export const decodeStateFromURL = (encoded) => {
    try {
        const decoded = atob(encoded);
        const state = JSON.parse(decoded);
        
        // Validate state structure
        if (!state.tab || !Array.isArray(state.solid) || !Array.isArray(state.gradient)) {
            return null;
        }
        
        return {
            activeTab: state.tab,
            solidColors: state.solid.map((value, index) => ({
                id: String(index + 1),
                value
            })),
            gradientColors: state.gradient.map((value, index) => ({
                id: String(index + 1),
                value
            }))
        };
    } catch (error) {
        console.error('Error decoding state from URL:', error);
        return null;
    }
};

/**
 * Save state to URL
 * @param {Object} state - Current app state
 */
export const saveStateToURL = (state) => {
    const encoded = encodeStateToURL(state);
    const url = new URL(window.location);
    url.searchParams.set('palette', encoded);
    window.history.pushState({}, '', url);
};

/**
 * Load state from URL
 * @returns {Object|null} - Decoded state or null
 */
export const loadStateFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('palette');
    
    if (!encoded) {
        return null;
    }
    
    return decodeStateFromURL(encoded);
};

/**
 * Generate shareable link
 * @param {Object} state - Current app state
 * @returns {string} - Shareable URL
 */
export const generateShareableLink = (state) => {
    const encoded = encodeStateToURL(state);
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('palette', encoded);
    return url.toString();
};

/**
 * Save to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

/**
 * Load from localStorage
 * @param {string} key - Storage key
 * @returns {any|null} - Stored value or null
 */
export const loadFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
};

/**
 * Get recent palettes from localStorage
 * @param {number} limit - Maximum number of palettes to return
 * @returns {Array} - Array of recent palettes
 */
export const getRecentPalettes = (limit = 5) => {
    const recent = loadFromLocalStorage('recent_palettes') || [];
    return recent.slice(0, limit);
};

/**
 * Save palette to recent history
 * @param {Object} palette - Palette to save
 */
export const saveToRecentPalettes = (palette) => {
    const recent = loadFromLocalStorage('recent_palettes') || [];
    
    // Add timestamp
    const paletteWithTime = {
        ...palette,
        timestamp: Date.now()
    };
    
    // Remove duplicates and add to beginning
    const filtered = recent.filter(p => 
        JSON.stringify(p.solidColors) !== JSON.stringify(palette.solidColors)
    );
    
    filtered.unshift(paletteWithTime);
    
    // Keep only last 10
    const limited = filtered.slice(0, 10);
    
    saveToLocalStorage('recent_palettes', limited);
};
