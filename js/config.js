// Supabase Configuration
// Replace these values with your Supabase project credentials

const SUPABASE_CONFIG = {
    // Your Supabase project URL
    // Example: 'https://xxxxxxxxxxxx.supabase.co'
    url: 'YOUR_SUPABASE_URL',
    
    // Your Supabase anon/public key
    // Example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

// Validate configuration
function validateConfig() {
    if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL' || 
        SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
        console.error('⚠️ Please configure your Supabase credentials in js/config.js');
        return false;
    }
    return true;
}
