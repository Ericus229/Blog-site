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

    const menuSearchItem = document.createElement('li');
    menuSearchItem.className = 'menu-search-item';
    menuSearchItem.innerHTML = '<button type="button" class="menu-search-btn" aria-label="Open search from menu"><i class="fas fa-search" aria-hidden="true"></i> Search</button>';
    navMenu.appendChild(menuSearchItem);

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
searchBar.innerHTML = '<button type="button" class="search-toggle-btn" aria-label="Open search" aria-expanded="false"><i class="fas fa-search" aria-hidden="true"></i></button><div class="search-field-wrap"><label for="search-input" style="display: none;">Search articles</label><input type="text" id="search-input" placeholder="Search articles..."><ul id="search-suggestions" class="search-suggestions" role="listbox" aria-label="Article suggestions"></ul></div>';
nav.appendChild(searchBar);

// Add back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '&#8679;'; // Up arrow
backToTopBtn.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopBtn);

const searchToggleBtn = document.querySelector('.search-toggle-btn');
const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');
const menuSearchBtn = document.querySelector('.menu-search-btn');
const blogArticles = document.querySelectorAll('.blog-feed article');

const fallbackArticles = [
    {
        title: 'UDS Applications Now Open for 2026/2027 Academic Year',
        url: 'University Update.html#uds-admissions-2026-2027'
    },
    {
        title: 'UCC Admissions Portal Open for 2026/2027 Undergraduate Applications',
        url: 'University Update.html#ucc-admissions-2026-2027'
    },
    {
        title: '8,200 New Education Jobs Open as GES Recruitment Drive Begins',
        url: 'GES update.html#new-teacher-recruitment-2026'
    },
    {
        title: 'Priority for Rural Service: Why Willingness to Serve in Deprived Areas Could Boost Your Chances',
        url: 'GES update.html#new-teacher-recruitment-2026'
    }
];

function getSearchableArticles() {
    const entries = [];
    const seen = new Set();

    document.querySelectorAll('.blog-feed article').forEach(function(article) {
        const titleEl = article.querySelector('h2');
        const linkEl = article.querySelector('a[href*="update"], a[href*="Update"], a[href]');
        if (!titleEl || !linkEl) {
            return;
        }

        const title = titleEl.textContent.trim();
        const url = linkEl.getAttribute('href');
        const key = `${title}|${url}`;
        if (!seen.has(key)) {
            seen.add(key);
            entries.push({ title, url });
        }
    });

    document.querySelectorAll('.sidebar a, .related-posts a').forEach(function(link) {
        const title = link.textContent.trim();
        const url = link.getAttribute('href');
        if (!title || !url) {
            return;
        }

        const key = `${title}|${url}`;
        if (!seen.has(key)) {
            seen.add(key);
            entries.push({ title, url });
        }
    });

    fallbackArticles.forEach(function(item) {
        const key = `${item.title}|${item.url}`;
        if (!seen.has(key)) {
            seen.add(key);
            entries.push(item);
        }
    });

    return entries;
}

const searchableArticles = getSearchableArticles();

function filterBlogArticles(query) {
    const normalizedQuery = query.toLowerCase();
    blogArticles.forEach(article => {
        const titleElement = article.querySelector('h2');
        const title = titleElement ? titleElement.textContent.toLowerCase() : '';
        article.style.display = title.includes(normalizedQuery) ? 'block' : 'none';
    });
}

function hideSuggestions() {
    if (!searchSuggestions) {
        return;
    }

    searchSuggestions.innerHTML = '';
    searchSuggestions.classList.remove('show');
}

function renderSearchSuggestions(query) {
    if (!searchSuggestions) {
        return;
    }

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
        hideSuggestions();
        return;
    }

    const matches = searchableArticles
        .filter(function(item) {
            return item.title.toLowerCase().includes(normalizedQuery);
        })
        .slice(0, 6);

    if (matches.length === 0) {
        hideSuggestions();
        return;
    }

    searchSuggestions.innerHTML = '';
    matches.forEach(function(item) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.title;
        link.setAttribute('role', 'option');
        listItem.appendChild(link);
        searchSuggestions.appendChild(listItem);
    });
    searchSuggestions.classList.add('show');
}

if (searchToggleBtn && searchInput) {
    searchToggleBtn.addEventListener('click', function() {
        const isOpen = searchBar.classList.toggle('open');
        this.setAttribute('aria-expanded', isOpen.toString());

        if (isOpen) {
            searchInput.focus();
        } else {
            hideSuggestions();
        }
    });

    searchInput.addEventListener('input', function() {
        filterBlogArticles(this.value);
        renderSearchSuggestions(this.value);
    });

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            searchBar.classList.remove('open');
            searchToggleBtn.setAttribute('aria-expanded', 'false');
            hideSuggestions();
            this.blur();
        }

        if (event.key === 'Enter' && searchSuggestions && searchSuggestions.firstElementChild) {
            const firstSuggestion = searchSuggestions.firstElementChild.querySelector('a');
            if (firstSuggestion) {
                window.location.href = firstSuggestion.getAttribute('href');
            }
        }
    });

    document.addEventListener('click', function(event) {
        if (!searchBar.contains(event.target)) {
            hideSuggestions();
        }
    });

    if (menuSearchBtn && nav) {
        menuSearchBtn.addEventListener('click', function() {
            searchBar.classList.add('open');
            searchToggleBtn.setAttribute('aria-expanded', 'true');
            searchInput.focus();
            nav.classList.remove('mobile-open');

            const menuToggleBtn = nav.querySelector('.menu-toggle');
            if (menuToggleBtn) {
                menuToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

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
    const suggestionsList = document.createElement('ul');
    suggestionsList.className = 'resource-suggestions';
    suggestionsList.setAttribute('role', 'listbox');
    suggestionsList.setAttribute('aria-label', 'Resource suggestions');
    resourceSearch.insertAdjacentElement('afterend', suggestionsList);

    const nestedResourceEntries = [
        {
            title: 'Kindergarten - Term one lesson plan',
            searchText: 'kindergarten kg term one lesson plan',
            href: 'Teaching resources.html#kg-term1',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'Kindergarten - Term two lesson plan',
            searchText: 'kindergarten kg term two lesson plan',
            href: 'Teaching resources.html#kg-term2',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'Kindergarten - Term three lesson plan',
            searchText: 'kindergarten kg term three lesson plan',
            href: 'Teaching resources.html#kg-term3',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'Lower Primary - Term one lesson plan',
            searchText: 'lower primary lp term one lesson plan',
            href: 'Teaching resources.html#lp-term1',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'Lower Primary - Term two lesson plan',
            searchText: 'lower primary lp term two lesson plan',
            href: 'Teaching resources.html#lp-term2',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'Lower Primary - Term three lesson plan',
            searchText: 'lower primary lp term three lesson plan',
            href: 'Teaching resources.html#lp-term3',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'Upper Primary - Term one lesson plan',
            searchText: 'upper primary up term one lesson plan',
            href: 'Teaching resources.html#up-term1',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'Upper Primary - Term two lesson plan',
            searchText: 'upper primary up term two lesson plan',
            href: 'Teaching resources.html#up-term2',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'Upper Primary - Term three lesson plan',
            searchText: 'upper primary up term three lesson plan',
            href: 'Teaching resources.html#up-term3',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'JHS - Term one lesson plan',
            searchText: 'jhs term one lesson plan',
            href: 'Teaching resources.html#jhs-term1',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'JHS - Term two lesson plan',
            searchText: 'jhs term two lesson plan',
            href: 'Teaching resources.html#jhs-term2',
            parentTitle: 'Teaching Resources'
        },
        {
            title: 'JHS - Term three lesson plan',
            searchText: 'jhs term three lesson plan',
            href: 'Teaching resources.html#jhs-term3',
            parentTitle: 'Teaching Resources'
        }
    ];

    function hideResourceSuggestions() {
        suggestionsList.innerHTML = '';
        suggestionsList.classList.remove('show');
    }

    function renderResourceSuggestions(query) {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) {
            hideResourceSuggestions();
            return;
        }

        const matchedResources = [];
        resourceCards.forEach(function(card) {
            const titleEl = card.querySelector('h3');
            const descEl = card.querySelector('p');
            const linkEl = card.querySelector('a');
            if (!titleEl || !descEl || !linkEl) {
                return;
            }

            const title = titleEl.textContent.trim();
            const description = descEl.textContent.trim();
            const href = linkEl.getAttribute('href');
            const matches = title.toLowerCase().includes(normalizedQuery) || description.toLowerCase().includes(normalizedQuery);

            if (matches) {
                matchedResources.push({ title, href });
            }
        });

        nestedResourceEntries.forEach(function(item) {
            if (item.searchText.includes(normalizedQuery) || item.title.toLowerCase().includes(normalizedQuery)) {
                matchedResources.push({ title: item.title, href: item.href });
            }
        });

        if (matchedResources.length === 0) {
            hideResourceSuggestions();
            return;
        }

        const uniqueResources = [];
        const seen = new Set();
        matchedResources.forEach(function(item) {
            const key = `${item.title}|${item.href}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueResources.push(item);
            }
        });

        suggestionsList.innerHTML = '';
        uniqueResources.slice(0, 6).forEach(function(resource) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = resource.href;
            link.textContent = resource.title;
            link.setAttribute('role', 'option');
            listItem.appendChild(link);
            suggestionsList.appendChild(listItem);
        });

        suggestionsList.classList.add('show');
    }

    resourceSearch.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        resourceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            const nestedMatch = nestedResourceEntries.some(function(item) {
                return item.parentTitle.toLowerCase() === title && (item.searchText.includes(query) || item.title.toLowerCase().includes(query));
            });

            if (!query || title.includes(query) || desc.includes(query) || nestedMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        renderResourceSuggestions(this.value);
    });

    resourceSearch.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideResourceSuggestions();
            this.blur();
        }

        if (event.key === 'Enter' && suggestionsList.firstElementChild) {
            const firstSuggestion = suggestionsList.firstElementChild.querySelector('a');
            if (firstSuggestion) {
                window.location.href = firstSuggestion.getAttribute('href');
            }
        }
    });

    document.addEventListener('click', function(event) {
        if (!resourceSearch.parentElement.contains(event.target)) {
            hideResourceSuggestions();
        }
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
const heroTitle = heroSection ? heroSection.querySelector('h1') : null;
const heroSlides = [
    {
        image: 'images/uds.JPG',
        title: 'UDS Applications Now Open for 2026/2027',
        showText: true,
        url: 'University Update.html#uds-admissions-2026-2027'
    },
    {
        image: 'images/ucc.JPG',
        title: 'UCC Admissions Portal Open for 2026/2027',
        showText: true,
        url: 'University Update.html#ucc-admissions-2026-2027'
    },
    {
        image: 'images/Haruna.jpg',
        title: '8,200 New Education Jobs Open as GES Recruitment Drive Begins',
        showText: true,
        url: 'GES update.html#new-teacher-recruitment-2026'
    },
    {
        image: 'images/pexels-alaritammsalu-36078146.jpg',
        title: 'Priority for Rural Service: Why Willingness to Serve in Deprived Areas Could Boost Your Chances',
        showText: true,
        url: 'GES update.html#new-teacher-recruitment-2026'
    }
];
let currentSlideIndex = 0;

// Create a persistent Read More button inside the hero
const heroReadMore = document.createElement('a');
heroReadMore.className = 'cta-button hero-read-more';
heroReadMore.textContent = 'Read More';
if (heroSection) {
    heroSection.appendChild(heroReadMore);
}

function changeHeroSlide() {
    if (!heroSection || !heroTitle || heroSlides.length === 0) {
        return;
    }

    const currentSlide = heroSlides[currentSlideIndex];
    heroSection.style.backgroundImage = `url('${currentSlide.image}')`;

    if (currentSlide.showText) {
        heroTitle.textContent = currentSlide.title;
        heroTitle.style.display = 'block';
    } else {
        heroTitle.style.display = 'none';
    }

    if (currentSlide.url) {
        heroReadMore.href = currentSlide.url;
        heroReadMore.style.display = 'inline-block';
    } else {
        heroReadMore.style.display = 'none';
    }

    currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
}

if (heroSection && heroTitle) {
    // Set initial slide
    changeHeroSlide();

    // Change slide every 10 seconds
    setInterval(changeHeroSlide, 10000);
}

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