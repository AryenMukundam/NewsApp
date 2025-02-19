const url = 'https://real-time-news-data.p.rapidapi.com/topic-news-by-section?topic=TECHNOLOGY&section=CAQiSkNCQVNNUW9JTDIwdk1EZGpNWFlTQldWdUxVZENHZ0pKVENJT0NBUWFDZ29JTDIwdk1ETnliSFFxQ2hJSUwyMHZNRE55YkhRb0FBKi4IACoqCAoiJENCQVNGUW9JTDIwdk1EZGpNWFlTQldWdUxVZENHZ0pKVENnQVABUAE&limit=500&country=US&lang=en';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '46d46dbb3emsh499426d771b5c10p1cd16cjsna8e2919b8b20',
    'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
  }
};

let currentCategory = 'news';
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

async function fetchNews() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    loader.style.display = "none";
    displayArticles(result.data);
  } catch (error) {
    loader.style.display = "none";
    console.error("Error fetching news:", error);
  }
}

function displayArticles(articles) {
  const contentContainer = document.getElementById("content-container");
  contentContainer.innerHTML = '';
  articles.forEach(article => {
    const articleElement = document.createElement("div");
    articleElement.classList.add("article");

    const isBookmarked = bookmarks.some(bookmark => bookmark.title === article.title);

    articleElement.innerHTML = `
      <img src="${article.photo_url}" alt="${article.title}">
      <h3>${article.title}</h3>
      <p>${article.snippet}</p>
      <button onclick="window.open('${article.link}', '_blank')">Read More</button>
      <button onclick="bookmarkArticle('${article.title}', '${article.link}', '${article.photo_url}')" ${isBookmarked ? 'disabled' : ''}>Bookmark</button>
      ${isBookmarked ? `<button class="remove" onclick="removeBookmark('${article.title}')">Remove Bookmark</button>` : ''}
    `;
    contentContainer.appendChild(articleElement);
  });
}

function changeTab(category) {
  currentCategory = category;
  if (category === 'news') {
    location.reload();
  } else if (category === 'bookmarks') {
    displayBookmarks();
  }
}

function bookmarkArticle(title, link, photoUrl) {
  if (bookmarks.some(bookmark => bookmark.title === title)) {
    return;
  }

  const bookmark = { title, link, photoUrl };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  alert("Article Bookmarked!");
  if (currentCategory === 'bookmarks') {
    displayBookmarks();
  }
}

function displayBookmarks() {
  const contentContainer = document.getElementById("content-container");
  contentContainer.innerHTML = '';
  if (bookmarks.length === 0) {
    contentContainer.innerHTML = '<p>No bookmarks yet!</p>';
  } else {
    bookmarks.forEach((bookmark, index) => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("article");
      articleElement.innerHTML = `
        <img src="${bookmark.photoUrl}" alt="${bookmark.title}">
        <h3>${bookmark.title}</h3>
        <button onclick="window.open('${bookmark.link}', '_blank')">Read More</button>
        <button class="remove" onclick="removeBookmark(${index})">Remove</button>
      `;
      contentContainer.appendChild(articleElement);
    });
  }
}

function removeBookmark(titleOrIndex) {
  if (typeof titleOrIndex === 'string') {
    bookmarks = bookmarks.filter(bookmark => bookmark.title !== titleOrIndex);
  } else {
    bookmarks.splice(titleOrIndex, 1);
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  displayBookmarks();
}

window.onload = function () {
  if (currentCategory === 'news') {
    fetchNews();
  } else {
    displayBookmarks();
  }
};
