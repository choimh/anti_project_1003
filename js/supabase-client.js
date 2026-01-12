// Supabase Client Initialization

let supabase = null;

function initSupabase() {
    if (!validateConfig()) {
        return null;
    }

    try {
        supabase = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        console.log('✅ Supabase client initialized');
        return supabase;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return null;
    }
}

// Book CRUD Operations

async function getBooks() {
    if (!supabase) return { data: [], error: 'Supabase not initialized' };

    const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

    return { data, error };
}

async function searchBooks(query) {
    if (!supabase) return { data: [], error: 'Supabase not initialized' };

    const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .order('created_at', { ascending: false });

    return { data, error };
}

async function getBookById(id) {
    if (!supabase) return { data: null, error: 'Supabase not initialized' };

    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

    return { data, error };
}

async function createBook(book) {
    if (!supabase) return { data: null, error: 'Supabase not initialized' };

    const { data, error } = await supabase
        .from('books')
        .insert([book])
        .select()
        .single();

    return { data, error };
}

async function updateBook(id, updates) {
    if (!supabase) return { data: null, error: 'Supabase not initialized' };

    const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
}

async function deleteBook(id) {
    if (!supabase) return { error: 'Supabase not initialized' };

    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

    return { error };
}
