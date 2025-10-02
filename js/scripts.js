// Variáveis globais para a galeria
let currentMotoIndex = 0;
let currentImageIndex = 0;

// Função para carregar a seção de motos
function loadMotosSection() {
    const motosGrid = document.getElementById('motosGrid');
    const planoSelect = document.getElementById('plano');
    
    // Limpar grid
    motosGrid.innerHTML = '';
    
    // Adicionar motos ao grid
    motosData.forEach((moto, index) => {
        const motoCard = createMotoCard(moto, index);
        motosGrid.appendChild(motoCard);
    });
}

// Função para criar card da moto
function createMotoCard(moto, index) {
    const card = document.createElement('div');
    card.className = 'moto-card';
    
    card.innerHTML = `
        <div class="gallery-badge">
            <i class="fas fa-images"></i> ${moto.gallery ? moto.gallery.length : '0'} fotos
        </div>
        <img src="${moto.image}" alt="${moto.name}" class="moto-image">
        <div class="moto-info">
            <h3 class="moto-name">${moto.name}</h3>
            <div class="moto-price">R$ ${moto.price}</div>
            <div class="moto-details">
                <span><i class="fas fa-calendar"></i> ${moto.year}</span>
                <span><i class="fas fa-tachometer-alt"></i> ${moto.km}</span>
            </div>
            ${moto.features ? `
                <div class="moto-features">
                    ${moto.features.map(feature => `<span>${feature}</span>`).join('')}
                </div>
            ` : ''}
            <div class="moto-location">
                <i class="fas fa-map-marker-alt"></i> 
                <span>${moto.location}</span>
            </div>
            <div class="view-gallery">
                <i class="fas fa-expand"></i> Ver Galeria
            </div>
            <a href="#contato" class="btn" data-moto="${moto.name}" style="margin-top: 15px; display: block; text-align: center;">Tenho Interesse</a>
        </div>
    `;
    
    // Evento para abrir galeria - apenas no card, não no botão
    card.addEventListener('click', (e) => {
        // Não abrir galeria se clicar no botão "Tenho Interesse"
        if (!e.target.closest('.btn')) {
            openGallery(index);
        }
    });
    
    return card;
}

// Funções da Galeria
function openGallery(motoIndex) {
    currentMotoIndex = motoIndex;
    currentImageIndex = 0;
    
    const moto = motosData[motoIndex];
    const modal = document.getElementById('galleryModal');
    const modalMotoName = document.getElementById('modalMotoName');
    const mainImage = document.getElementById('mainImage');
    
    modalMotoName.textContent = moto.name;
    mainImage.src = moto.gallery ? moto.gallery[0] : moto.image;
    
    loadThumbnails(moto);
    updateImageCounter();
    updateNavigationButtons();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function loadThumbnails(moto) {
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    const images = moto.gallery || [moto.image];
    
    images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `Foto ${index + 1} da ${moto.name}`;
        thumbnail.className = `thumbnail ${index === currentImageIndex ? 'active' : ''}`;
        thumbnail.onclick = () => changeImage(index);
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

function changeImage(index) {
    currentImageIndex = index;
    const moto = motosData[currentMotoIndex];
    const mainImage = document.getElementById('mainImage');
    const images = moto.gallery || [moto.image];
    
    mainImage.src = images[index];
    updateImageCounter();
    updateThumbnails();
    updateNavigationButtons();
}

function prevImage() {
    if (currentImageIndex > 0) {
        changeImage(currentImageIndex - 1);
    }
}

function nextImage() {
    const moto = motosData[currentMotoIndex];
    const images = moto.gallery || [moto.image];
    if (currentImageIndex < images.length - 1) {
        changeImage(currentImageIndex + 1);
    }
}

function updateImageCounter() {
    const moto = motosData[currentMotoIndex];
    const images = moto.gallery || [moto.image];
    const imageCounter = document.getElementById('imageCounter');
    imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
}

function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function updateNavigationButtons() {
    const moto = motosData[currentMotoIndex];
    const images = moto.gallery || [moto.image];
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === images.length - 1;
}

function setupGalleryEvents() {
    const modal = document.getElementById('galleryModal');
    const closeBtn = document.getElementById('closeModal');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Fechar modal
    closeBtn.onclick = closeGallery;
    
    // Fechar ao clicar fora
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeGallery();
        }
    };
    
    // Navegação
    prevBtn.onclick = prevImage;
    nextBtn.onclick = nextImage;
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        }
    });
}

// Configuração do formulário Netlify
function setupForm() {
    const form = document.querySelector('form[name="contato"]');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Validação básica
            const nome = document.getElementById('nome').value;
            const telefone = document.getElementById('telefone').value;
            
            if (!nome || !telefone) {
                e.preventDefault();
                alert('Por favor, preencha pelo menos o nome e telefone.');
                return;
            }
            
            console.log('Formulário sendo enviado para Netlify...');
            // O Netlify cuida do resto e redireciona para sucesso.html
        });
    }
}

// Função para inicializar o site
function init() {
    // Carregar seção de motos
    loadMotosSection();
    
    // Configurar eventos da galeria
    setupGalleryEvents();
    
    // Configurar formulário
    setupForm();
    
    // Menu Mobile
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });
    
    // Navegação suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                document.querySelector('nav ul').classList.remove('show');
            }
        });
    });
    
    // Preencher automaticamente o campo de plano quando clicar em "Tenho Interesse"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && e.target.hasAttribute('data-moto')) {
            const motoName = e.target.getAttribute('data-moto');
            const select = document.getElementById('plano');
            
            // Encontrar o plano correspondente baseado na moto
            let planoValue = 'completo'; // padrão
            
            if (motoName.includes('Biz') || motoName.includes('NMax')) {
                planoValue = 'premium';
            } else if (motoName.includes('CG') || motoName.includes('Factor')) {
                planoValue = 'completo';
            }
            
            select.value = planoValue;
            
            // Rolar até o formulário
            document.getElementById('contato').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    // Atualizar ano atual
    updateFooterInfo();
}

// Função para atualizar informações do rodapé
function updateFooterInfo() {
    // Atualiza o ano atual no rodapé
    document.getElementById("year").textContent = new Date().getFullYear();
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);