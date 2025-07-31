// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const levelsGrid = document.getElementById('levels-grid');
    const materialsContainer = document.getElementById('materials-container');
    const materialsGrid = document.getElementById('materials-grid');
    const pdfViewerContainer = document.getElementById('pdf-viewer-container');
    const mediaViewerContainer = document.getElementById('media-viewer-container');
    const adminPanel = document.getElementById('admin-panel');
    const adminLink = document.getElementById('admin-link');
    const logoutButton = document.getElementById('logout');
    const btnBack = document.getElementById('btn-back');
    const btnBackPdf = document.getElementById('btn-back-pdf');
    const btnBackMedia = document.getElementById('btn-back-media');
    const btnBackAdmin = document.getElementById('btn-back-admin');
    const levelTitle = document.getElementById('level-title');
    const pdfTitle = document.getElementById('pdf-title');
    const mediaTitle = document.getElementById('media-title');
    const mediaContent = document.getElementById('media-content');
    const pdfCanvas = document.getElementById('pdf-canvas');
    const pageNum = document.getElementById('page-num');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnAddAccess = document.getElementById('btn-add-access');
    const accessTable = document.getElementById('access-table');
    const passwordInputAdmin = document.getElementById('password-input');
    const accessLevelSelect = document.getElementById('access-level');
    const uploadLevelSelect = document.getElementById('upload-level');
    const contentTypeSelect = document.getElementById('content-type');
    const fileUpload = document.getElementById('file-upload');
    const btnUpload = document.getElementById('btn-upload');
    
    // State variables
    let currentUser = null;
    let currentLevel = null;
    let currentMaterial = null;
    let currentPdf = null;
    let currentPage = 1;
    let pdfDoc = null;
    let pageRendering = false;
    let pageNumPending = null;
    const scale = 1.5;
    
    // Sample data
    const accessLevels = {
        '1711': 0, // Admin
        'level1pass': 1,
        'level2pass': 2,
        'level3pass': 3,
        'level4pass': 4,
        'level5pass': 5,
        'level6pass': 6
    };
    
    const materials = {
        1: {
            book: 'Level 1 Student Book',
            videos: [
                { title: 'Introduction to Algebra', duration: '15:30' },
                { title: 'Solving Equations', duration: '22:15' },
                { title: 'Quadratic Functions', duration: '18:45' }
            ],
            audios: [
                { title: 'Algebra Basics', duration: '12:30' },
                { title: 'Equation Solving Techniques', duration: '18:20' },
                { title: 'Advanced Algebra Concepts', duration: '24:10' }
            ]
        },
        2: {
            book: 'Level 2 Student Book',
            videos: [
                { title: 'Geometry Fundamentals', duration: '17:45' },
                { title: 'Triangles and Polygons', duration: '20:30' },
                { title: 'Circles and Spheres', duration: '19:15' }
            ],
            audios: [
                { title: 'Introduction to Geometry', duration: '14:20' },
                { title: 'Shape Properties', duration: '16:45' },
                { title: 'Geometric Proofs', duration: '22:30' }
            ]
        },
        3: {
            book: 'Level 3 Student Book',
            videos: [
                { title: 'Trigonometry Basics', duration: '16:30' },
                { title: 'Trigonometric Identities', duration: '21:45' },
                { title: 'Solving Triangles', duration: '19:20' }
            ],
            audios: [
                { title: 'Trigonometry Introduction', duration: '13:40' },
                { title: 'Sine and Cosine Rules', duration: '17:25' },
                { title: 'Applications of Trigonometry', duration: '20:15' }
            ]
        },
        4: {
            book: 'Level 4 Student Book',
            videos: [
                { title: 'Calculus Fundamentals', duration: '18:20' },
                { title: 'Derivatives and Applications', duration: '23:15' },
                { title: 'Integrals and Applications', duration: '21:30' }
            ],
            audios: [
                { title: 'Introduction to Calculus', duration: '15:30' },
                { title: 'Limits and Continuity', duration: '18:45' },
                { title: 'Fundamental Theorem of Calculus', duration: '22:10' }
            ]
        },
        5: {
            book: 'Level 5 Student Book',
            videos: [
                { title: 'Statistics Overview', duration: '17:10' },
                { title: 'Probability Distributions', duration: '20:45' },
                { title: 'Hypothesis Testing', duration: '22:20' }
            ],
            audios: [
                { title: 'Data Analysis Basics', duration: '14:50' },
                { title: 'Statistical Inference', duration: '19:25' },
                { title: 'Regression Analysis', duration: '23:15' }
            ]
        },
        6: {
            book: 'Level 6 Student Book',
            videos: [
                { title: 'Advanced Calculus', duration: '19:30' },
                { title: 'Multivariable Functions', duration: '24:15' },
                { title: 'Vector Calculus', duration: '22:45' }
            ],
            audios: [
                { title: 'Advanced Mathematics Concepts', duration: '16:20' },
                { title: 'Linear Algebra Overview', duration: '20:30' },
                { title: 'Differential Equations', duration: '25:10' }
            ]
        }
    };
    
    // Initialize
    renderAccessTable();
    
    // Event Listeners
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = passwordInput.value.trim();
        login(password);
    });
    
    logoutButton.addEventListener('click', function() {
        logout();
    });
    
    btnBack.addEventListener('click', function() {
        showLevelsGrid();
    });
    
    btnBackPdf.addEventListener('click', function() {
        showMaterialsGrid(currentLevel);
    });
    
    btnBackMedia.addEventListener('click', function() {
        showMaterialsGrid(currentLevel);
    });
    
    btnBackAdmin.addEventListener('click', function() {
        showDashboard();
    });
    
    btnPrev.addEventListener('click', function() {
        prevPage();
    });
    
    btnNext.addEventListener('click', function() {
        nextPage();
    });
    
    btnAddAccess.addEventListener('click', function() {
        addAccess();
    });
    
    btnUpload.addEventListener('click', function() {
        uploadContent();
    });
    
    // Functions
    function login(password) {
        const accessLevel = accessLevels[password] !== undefined ? accessLevels[password] : null;
        
        if (accessLevel === null) {
            alert('Invalid password. Please try again.');
            return;
        }
        
        currentUser = {
            accessLevel,
            name: accessLevel === 0 ? 'Admin User' : `Level ${accessLevel} Student`,
            role: accessLevel === 0 ? 'Admin' : 'Student'
        };
        
        // Update UI
        document.querySelector('.user-name').textContent = currentUser.name;
        document.querySelector('.user-role').textContent = currentUser.role;
        
        if (accessLevel === 0) {
            adminLink.style.display = 'block';
        } else {
            adminLink.style.display = 'none';
        }
        
        loginScreen.style.display = 'none';
        dashboard.style.display = 'grid';
        
        showDashboard();
    }
    
    function logout() {
        currentUser = null;
        dashboard.style.display = 'none';
        loginScreen.style.display = 'flex';
        passwordInput.value = '';
    }
    
    function showDashboard() {
        materialsContainer.style.display = 'none';
        pdfViewerContainer.style.display = 'none';
        mediaViewerContainer.style.display = 'none';
        adminPanel.style.display = 'none';
        renderLevelsGrid();
    }
    
    function showAdminPanel() {
        materialsContainer.style.display = 'none';
        pdfViewerContainer.style.display = 'none';
        mediaViewerContainer.style.display = 'none';
        adminPanel.style.display = 'block';
    }
    
    function renderLevelsGrid() {
        levelsGrid.innerHTML = '';
        
        // Determine which levels to show
        const levelsToShow = currentUser.accessLevel === 0 ? 
            [1, 2, 3, 4, 5, 6] : 
            [currentUser.accessLevel];
        
        levelsToShow.forEach(level => {
            const card = document.createElement('div');
            card.className = 'level-card';
            card.innerHTML = `
                <i class="fas fa-graduation-cap"></i>
                <h3>Level ${level}</h3>
                <p>Comprehensive learning materials for this level</p>
            `;
            card.addEventListener('click', () => showMaterialsGrid(level));
            levelsGrid.appendChild(card);
        });
    }
    
    function showMaterialsGrid(level) {
        currentLevel = level;
        levelTitle.textContent = `Level ${level} Materials`;
        
        materialsContainer.style.display = 'block';
        pdfViewerContainer.style.display = 'none';
        mediaViewerContainer.style.display = 'none';
        adminPanel.style.display = 'none';
        
        materialsGrid.innerHTML = '';
        
        // Book card
        const bookCard = document.createElement('div');
        bookCard.className = 'material-card';
        bookCard.innerHTML = `
            <i class="fas fa-book"></i>
            <h3>Student Book</h3>
            <p>Interactive textbook for Level ${level}</p>
        `;
        bookCard.addEventListener('click', () => showPdfViewer(level));
        materialsGrid.appendChild(bookCard);
        
        // Videos card
        const videosCard = document.createElement('div');
        videosCard.className = 'material-card';
        videosCard.innerHTML = `
            <i class="fas fa-video"></i>
            <h3>Video Lessons</h3>
            <p>${materials[level].videos.length} video lessons available</p>
        `;
        videosCard.addEventListener('click', () => showMediaViewer(level, 'videos'));
        materialsGrid.appendChild(videosCard);
        
        // Audios card
        const audiosCard = document.createElement('div');
        audiosCard.className = 'material-card';
        audiosCard.innerHTML = `
            <i class="fas fa-music"></i>
            <h3>Audio Lessons</h3>
            <p>${materials[level].audios.length} audio lessons available</p>
        `;
        audiosCard.addEventListener('click', () => showMediaViewer(level, 'audios'));
        materialsGrid.appendChild(audiosCard);
    }
    
    function showPdfViewer(level) {
        pdfTitle.textContent = `Student Book - Level ${level}`;
        materialsContainer.style.display = 'none';
        pdfViewerContainer.style.display = 'block';
        mediaViewerContainer.style.display = 'none';
        adminPanel.style.display = 'none';
        
        // Initialize PDF viewer
        currentPage = 1;
        loadPdf(level);
    }
    
    function loadPdf(level) {
        // In a real app, this would load from /materials/${level}/book
        // For demo, we'll use a sample PDF URL
        const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
        
        pdfjsLib.getDocument(url).promise.then(function(pdf) {
            pdfDoc = pdf;
            pageNum.textContent = `Page ${currentPage} of ${pdfDoc.numPages}`;
            renderPage(currentPage);
        });
    }
    
    function renderPage(num) {
        pageRendering = true;
        
        pdfDoc.getPage(num).then(function(page) {
            const viewport = page.getViewport({ scale: scale });
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: pdfCanvas.getContext('2d'),
                viewport: viewport
            };
            
            const renderTask = page.render(renderContext);
            
            renderTask.promise.then(function() {
                pageRendering = false;
                pageNum.textContent = `Page ${currentPage} of ${pdfDoc.numPages}`;
                
                if (pageNumPending !== null) {
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
    }
    
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }
    
    function prevPage() {
        if (currentPage <= 1) return;
        currentPage--;
        queueRenderPage(currentPage);
    }
    
    function nextPage() {
        if (currentPage >= pdfDoc.numPages) return;
        currentPage++;
        queueRenderPage(currentPage);
    }
    
    function showMediaViewer(level, type) {
        currentLevel = level;
        currentMaterial = type;
        
        if (type === 'videos') {
            mediaTitle.textContent = `Video Lessons - Level ${level}`;
        } else {
            mediaTitle.textContent = `Audio Lessons - Level ${level}`;
        }
        
        materialsContainer.style.display = 'none';
        pdfViewerContainer.style.display = 'none';
        mediaViewerContainer.style.display = 'block';
        adminPanel.style.display = 'none';
        
        renderMediaList(level, type);
    }
    
    function renderMediaList(level, type) {
        mediaContent.innerHTML = '';
        
        const items = type === 'videos' ? materials[level].videos : materials[level].audios;
        
        items.forEach((item, index) => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            mediaItem.innerHTML = `
                <i class="fas fa-${type === 'videos' ? 'video' : 'headphones'}"></i>
                <div class="media-item-content">
                    <h4>${item.title}</h4>
                    <p>Duration: ${item.duration}</p>
                </div>
                <i class="fas fa-play"></i>
            `;
            mediaItem.addEventListener('click', () => playMedia(item.title, type));
            mediaContent.appendChild(mediaItem);
        });
    }
    
    function playMedia(title, type) {
        mediaContent.innerHTML = `
            <div class="media-player">
                <h3>${title}</h3>
                <p>Level ${currentLevel} - ${type === 'videos' ? 'Video Lesson' : 'Audio Lesson'}</p>
                
                ${type === 'videos' ? 
                    `<video controls autoplay>
                        <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>` : 
                    `<audio controls autoplay>
                        <source src="https://sample-videos.com/audio/mp3/crowd-cheering.mp3" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>`
                }
                
                <div class="media-description">
                    <p>This is a sample ${type === 'videos' ? 'video' : 'audio'} lesson for demonstration purposes. In a real application, this would be actual educational content.</p>
                </div>
            </div>
        `;
    }
    
    function renderAccessTable() {
        accessTable.innerHTML = '';
        
        for (const [password, level] of Object.entries(accessLevels)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${password}</td>
                <td>${level === 0 ? 'Admin' : `Level ${level}`}</td>
                <td><button class="action-btn" data-password="${password}">Delete</button></td>
            `;
            accessTable.appendChild(row);
        }
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const password = this.getAttribute('data-password');
                deleteAccess(password);
            });
        });
    }
    
    function addAccess() {
        const password = passwordInputAdmin.value.trim();
        const level = parseInt(accessLevelSelect.value);
        
        if (!password) {
            alert('Please enter a password');
            return;
        }
        
        if (accessLevels[password] !== undefined) {
            alert('This password already exists');
            return;
        }
        
        accessLevels[password] = level;
        renderAccessTable();
        passwordInputAdmin.value = '';
        alert('Access added successfully');
    }
    
    function deleteAccess(password) {
        if (password === '1711') {
            alert('Cannot delete admin access');
            return;
        }
        
        if (confirm('Are you sure you want to delete this access?')) {
            delete accessLevels[password];
            renderAccessTable();
        }
    }
    
    function uploadContent() {
        const level = parseInt(uploadLevelSelect.value);
        const type = contentTypeSelect.value;
        const file = fileUpload.files[0];
        
        if (!file) {
            alert('Please select a file to upload');
            return;
        }
        
        // In a real app, this would upload to the server
        // For demo, we'll just show a success message
        alert(`Successfully uploaded ${file.name} as ${type} for Level ${level}`);
        fileUpload.value = '';
    }
    
    // Admin link in sidebar
    adminLink.addEventListener('click', function(e) {
        e.preventDefault();
        showAdminPanel();
    });
});