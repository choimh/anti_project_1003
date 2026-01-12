// Main Application Logic

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const addBookBtn = document.getElementById('addBookBtn');
const booksGrid = document.getElementById('booksGrid');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const noResults = document.getElementById('noResults');
const totalBooksEl = document.getElementById('totalBooks');
const searchResultsEl = document.getElementById('searchResults');

// Modal Elements
const bookModal = document.getElementById('bookModal');
const modalTitle = document.getElementById('modalTitle');
const bookForm = document.getElementById('bookForm');
const bookIdInput = document.getElementById('bookId');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const deleteBookBtn = document.getElementById('deleteBookBtn');

// Toast Element
const toast = document.getElementById('toast');

// State
let allBooks = [];
let searchTimeout = null;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    initSupabase();
    await loadBooks();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);

    // Modal
    addBookBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', () => closeBookModal());
    cancelBtn.addEventListener('click', () => closeBookModal());
    bookModal.querySelector('.modal-overlay').addEventListener('click', () => closeBookModal());

    // Form
    bookForm.addEventListener('submit', handleFormSubmit);
    deleteBookBtn.addEventListener('click', handleDelete);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookModal.classList.contains('active')) {
            closeBookModal();
        }
    });
}

// Load Books
async function loadBooks() {
    showLoading();

    const { data, error } = await getBooks();

    if (error) {
        showToast('책을 불러오는데 실패했습니다: ' + error.message, 'error');
        hideLoading();
        return;
    }

    allBooks = data || [];
    totalBooksEl.textContent = allBooks.length;
    renderBooks(allBooks);
    hideLoading();
}

// Render Books
function renderBooks(books) {
    booksGrid.innerHTML = '';

    if (books.length === 0) {
        if (searchInput.value.trim()) {
            noResults.style.display = 'block';
            emptyState.style.display = 'none';
        } else {
            emptyState.style.display = 'block';
            noResults.style.display = 'none';
        }
        return;
    }

    emptyState.style.display = 'none';
    noResults.style.display = 'none';

    books.forEach(book => {
        const card = createBookCard(book);
        booksGrid.appendChild(card);
    });
}

// Create Book Card
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.onclick = () => openModal(book);

    const coverHtml = book.cover_url
        ? `<img src="${escapeHtml(book.cover_url)}" alt="${escapeHtml(book.title)}" class="book-cover" onerror="this.outerHTML='<div class=\\'book-cover-placeholder\\'>📚</div>'">`
        : '<div class="book-cover-placeholder">📚</div>';

    const metaTags = [];
    if (book.published_year) metaTags.push(`<span class="book-tag">${book.published_year}</span>`);
    if (book.publisher) metaTags.push(`<span class="book-tag">${escapeHtml(book.publisher)}</span>`);

    card.innerHTML = `
        ${coverHtml}
        <h3 class="book-title">${escapeHtml(book.title)}</h3>
        <p class="book-author">${escapeHtml(book.author)}</p>
        ${metaTags.length > 0 ? `<div class="book-meta">${metaTags.join('')}</div>` : ''}
    `;

    return card;
}

// Search Handler
function handleSearch(e) {
    const query = e.target.value.trim();

    clearSearch.style.display = query ? 'block' : 'none';

    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        if (query.length >= 2) {
            const { data, error } = await searchBooks(query);
            if (!error) {
                renderBooks(data || []);
                searchResultsEl.textContent = (data || []).length;
            }
        } else if (query.length === 0) {
            renderBooks(allBooks);
            searchResultsEl.textContent = '-';
        }
    }, 300);
}

// Clear Search
function clearSearchInput() {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    renderBooks(allBooks);
    searchResultsEl.textContent = '-';
}

// Modal Functions
function openModal(book = null) {
    bookForm.reset();
    bookIdInput.value = '';

    if (book) {
        modalTitle.textContent = '책 정보 수정';
        bookIdInput.value = book.id;
        document.getElementById('bookTitle').value = book.title || '';
        document.getElementById('bookAuthor').value = book.author || '';
        document.getElementById('bookIsbn').value = book.isbn || '';
        document.getElementById('bookYear').value = book.published_year || '';
        document.getElementById('bookPublisher').value = book.publisher || '';
        document.getElementById('bookCover').value = book.cover_url || '';
        document.getElementById('bookDescription').value = book.description || '';
        deleteBookBtn.style.display = 'block';
    } else {
        modalTitle.textContent = '새 책 추가';
        deleteBookBtn.style.display = 'none';
    }

    bookModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookModal() {
    bookModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Form Submit Handler
async function handleFormSubmit(e) {
    e.preventDefault();

    const bookData = {
        title: document.getElementById('bookTitle').value.trim(),
        author: document.getElementById('bookAuthor').value.trim(),
        isbn: document.getElementById('bookIsbn').value.trim() || null,
        published_year: document.getElementById('bookYear').value ? parseInt(document.getElementById('bookYear').value) : null,
        publisher: document.getElementById('bookPublisher').value.trim() || null,
        cover_url: document.getElementById('bookCover').value.trim() || null,
        description: document.getElementById('bookDescription').value.trim() || null
    };

    const bookId = bookIdInput.value;

    if (bookId) {
        // Update
        const { data, error } = await updateBook(bookId, bookData);
        if (error) {
            showToast('수정 실패: ' + error.message, 'error');
            return;
        }
        showToast('책이 수정되었습니다', 'success');
    } else {
        // Create
        const { data, error } = await createBook(bookData);
        if (error) {
            showToast('추가 실패: ' + error.message, 'error');
            return;
        }
        showToast('새 책이 추가되었습니다', 'success');
    }

    closeBookModal();
    await loadBooks();

    // If was searching, re-search
    if (searchInput.value.trim().length >= 2) {
        const { data } = await searchBooks(searchInput.value.trim());
        renderBooks(data || []);
        searchResultsEl.textContent = (data || []).length;
    }
}

// Delete Handler
async function handleDelete() {
    const bookId = bookIdInput.value;
    if (!bookId) return;

    if (!confirm('정말로 이 책을 삭제하시겠습니까?')) return;

    const { error } = await deleteBook(bookId);
    if (error) {
        showToast('삭제 실패: ' + error.message, 'error');
        return;
    }

    showToast('책이 삭제되었습니다', 'success');
    closeBookModal();
    await loadBooks();
}

// UI Helpers
function showLoading() {
    loadingState.style.display = 'block';
    booksGrid.style.display = 'none';
    emptyState.style.display = 'none';
    noResults.style.display = 'none';
}

function hideLoading() {
    loadingState.style.display = 'none';
    booksGrid.style.display = 'grid';
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
