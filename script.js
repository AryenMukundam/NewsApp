const API_KEY = 'a5a09ad050984faab337132fe6c9627e';
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

const newsContainer = document.getElementById('news-container');
const bookmarkBtn = document.getElementById('bookmark-btn');
const bookmarksPanel = document.getElementById('bookmarks-panel');
const closeBookmarksBtn = document.getElementById('close-bookmarks');
const categoryButtons = document.querySelectorAll('.categories button');

let currentNews = [];
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

bookmarkBtn.addEventListener('click', () => bookmarksPanel.classList.toggle('open'));
closeBookmarksBtn.addEventListener('click', () => bookmarksPanel.classList.remove('open'));

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        fetchNewsByCategory(button.dataset.category);
    });
});

async function fetchNews(params = {}) {
    try {
        const queryParams = new URLSearchParams({
            apiKey: API_KEY,
            country: 'us',
            ...params
        });

        const response = await fetch(`${BASE_URL}?${queryParams}`);
        const data = await response.json();

        if (data.status === 'ok' && data.articles) {
            currentNews = data.articles;
            displayNews(currentNews);
        } else {
            displayError('No articles available.');
        }
    } catch (error) {
        displayError('Error loading news.');
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = articles.map((article, index) => `
        <div class="news-card">
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}" onerror="this.src='placeholder.jpg'">
            <div class="news-content">
                <h2>${article.title}</h2>
                <p>${article.description || 'No description available'}</p>
                <div class="news-actions">
                    <button onclick="openArticle('${article.url}')">Read</button>
                    <button onclick="toggleBookmark(${index})">${isBookmarked(article) ? 'Remove' : 'Save'}</button>
                </div>
            </div>
        </div>
    `).join('');
}

function displayBookmarks() {
    const bookmarkedArticles = document.getElementById('bookmarked-articles');
    bookmarkedArticles.innerHTML = bookmarks.length ? bookmarks.map((article, index) => `
        <div class="bookmarked-item">
            <h3>${article.title}</h3>
            <div class="news-actions">
                <button onclick="openArticle('${article.url}')">Read</button>
                <button onclick="removeBookmark(${index})">Remove</button>
            </div>
        </div>
    `).join('') : '<p>No saved articles</p>';
}

function fetchNewsByCategory(category) {
    fetchNews(category === 'all' ? {} : { category });
}

function toggleBookmark(index) {
    const article = currentNews[index];
    const isAlreadyBookmarked = isBookmarked(article);
    
    if (isAlreadyBookmarked) {
        bookmarks = bookmarks.filter(bookmark => bookmark.url !== article.url);
        alert("Article removed!")
    } else {
        bookmarks.push(article);
        alert("Article bookmarked!")
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayNews(currentNews);
    displayBookmarks();
}

function isBookmarked(article) {
    return bookmarks.some(bookmark => bookmark.url === article.url);
}

function removeBookmark(index) {
    alert("Bookmark Removed!")
    bookmarks.splice(index, 1);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks();
}

function openArticle(url) {
    window.open(url, '_blank');
}

function displayError(message) {
    newsContainer.innerHTML = `<div class="error"><p>${message}</p></div>`;
}

fetchNews();

displayBookmarks();
