// URL sanitization script
(function() {
    // Get the current URL and path
    const currentUrl = window.location.href;
    const path = window.location.pathname;
    
    // Check if URL ends with a quote character
    if (currentUrl.match(/['"`]$/)) {
        console.log('Detected URL with trailing quote, redirecting to sanitized URL');
        
        // Create sanitized URL
        const sanitizedUrl = currentUrl.replace(/['"`]$/, '');
        
        // Redirect to the sanitized URL
        window.location.replace(sanitizedUrl);
    }
    
    // Check if path contains quotes anywhere
    if (path.includes("'") || path.includes('"') || path.includes('`')) {
        console.log('Detected path with quotes, redirecting to sanitized path');
        
        // Create sanitized path
        const sanitizedPath = path.replace(/['"`]/g, '');
        
        // Construct the full sanitized URL
        const baseUrl = window.location.origin;
        const search = window.location.search;
        const hash = window.location.hash;
        const sanitizedUrl = `${baseUrl}${sanitizedPath}${search}${hash}`;
        
        // Redirect to the sanitized URL
        window.location.replace(sanitizedUrl);
    }
})();