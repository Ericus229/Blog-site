// Set up navigation behavior
const nav = document.querySelector('nav');
const navMenu = nav ? nav.querySelector('ul') : null;

if (nav && navMenu) {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.type = 'button';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    nav.insertBefore(menuToggle, navMenu);

    menuToggle.addEventListener('click', function() {
        const isOpen = nav.classList.toggle('mobile-open');
        this.setAttribute('aria-expanded', isOpen.toString());
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('mobile-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.classList.remove('mobile-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

const searchBar = document.createElement('div');
searchBar.className = 'search-bar';
searchBar.innerHTML = '<button type="button" class="search-toggle-btn" aria-label="Open search" aria-expanded="false"><i class="fas fa-search" aria-hidden="true"></i></button><div class="search-field-wrap"><label for="search-input" style="display: none;">Search articles</label><input type="text" id="search-input" placeholder="Search articles..."></div>';
nav.appendChild(searchBar);

// Add dark mode toggle button
const darkModeToggle = document.createElement('button');
darkModeToggle.className = 'dark-mode-toggle';
darkModeToggle.textContent = 'Toggle Dark Mode';
darkModeToggle.setAttribute('aria-pressed', 'false');
nav.appendChild(darkModeToggle);

// Add back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '&#8679;'; // Up arrow
backToTopBtn.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopBtn);

const searchToggleBtn = document.querySelector('.search-toggle-btn');
const searchInput = document.getElementById('search-input');
const blogArticles = document.querySelectorAll('.blog-feed article');

function filterBlogArticles(query) {
    const normalizedQuery = query.toLowerCase();
    blogArticles.forEach(article => {
        const titleElement = article.querySelector('h2');
        const title = titleElement ? titleElement.textContent.toLowerCase() : '';
        article.style.display = title.includes(normalizedQuery) ? 'block' : 'none';
    });
}

if (searchToggleBtn && searchInput) {
    searchToggleBtn.addEventListener('click', function() {
        const isOpen = searchBar.classList.toggle('open');
        this.setAttribute('aria-expanded', isOpen.toString());

        if (isOpen) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('input', function() {
        filterBlogArticles(this.value);
    });

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            searchBar.classList.remove('open');
            searchToggleBtn.setAttribute('aria-expanded', 'false');
            this.blur();
        }
    });
}

// Dark mode toggle
darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isPressed = document.body.classList.contains('dark-mode');
    this.setAttribute('aria-pressed', isPressed.toString());
});

// Back to top functionality
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Resource search functionality
const resourceSearch = document.getElementById('resource-search');
if (resourceSearch) {
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceSearch.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        resourceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            if (title.includes(query) || desc.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Share functionality
const facebookShare = document.getElementById('facebook-share');
const whatsappShare = document.getElementById('whatsapp-share');
const linkedinShare = document.getElementById('linkedin-share');

if (facebookShare) {
    const url = encodeURIComponent(window.location.href);
    facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    whatsappShare.href = `https://wa.me/?text=${url}`;
    linkedinShare.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
}

// Hero background slideshow
const heroSection = document.querySelector('.hero');
const images = [
    'images/BingWallpaper.jpg',
    'images/pexels-alaritammsalu-36078146.jpg',
    'images/pexels-droosmo-2982449.jpg',
    'images/pexels-hujason-29461071.jpg',
    'images/pexels-kayode-balogun-169877002-12091126.jpg',

    // Add more images as needed
];
let currentImageIndex = 0;

function changeBackground() {
    heroSection.style.backgroundImage = `url('${images[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

// Set initial background
changeBackground();

// Change background every 10 seconds
setInterval(changeBackground, 10000);

// Logo motion animation every 10 seconds
const logoImg = document.querySelector('.logo img');
if (logoImg) {
    setInterval(function() {
        logoImg.classList.add('logo-bounce');
        // Remove the class after animation completes so it can be triggered again
        setTimeout(function() {
            logoImg.classList.remove('logo-bounce');
        }, 600);
    }, 10000);
}