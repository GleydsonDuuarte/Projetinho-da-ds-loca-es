let currentMotoIndex = 0;
let currentImageIndex = 0;
let motosData = [];

async function loadMotosSection() {
    const motosGrid = document.getElementById('motosGrid');
    
    motosGrid.innerHTML = `
        <div class="loading" style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #e53e3e;"></i>
            <p style="margin-top: 15px;">Carregando frota de motos...</p>
        </div>
    `;
    
    try {
        motosData = await loadMotosData();
        motosGrid.innerHTML = '';
        
        if (motosData.length === 0) {
            motosGrid.innerHTML = `
                <div class="no-data" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fas fa-motorcycle" style="font-size: 3rem; color: #ccc;"></i>
                    <p style="margin-top: 15px; color: #666;">Nenhuma moto disponível no momento.</p>
                </div>
            `;
            return;
        }
        
        motosData.forEach((moto, index) => {
            const motoCard = createMotoCard(moto, index);
            motosGrid.appendChild(motoCard);
        });
        
    } catch (error) {
        motosGrid.innerHTML = `
            <div class="error" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e53e3e;">
                <i class="fas fa-exclamation-triangle"></i>
                <p style="margin-top: 15px;">Erro ao carregar as motos. Atualize a página.</p>
                <button onclick="location.reload()" class="btn" style="margin-top: 15px;">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        `;
    }
}

function createMotoCard(moto, index) {
    const card = document.createElement('div');
    card.className = 'moto-card';
    
    const gallery = Array.isArray(moto.gallery) ? moto.gallery : [moto.image];
    
    card.innerHTML = `
        ${gallery.length > 1 ? `
            <div class="gallery-badge">
                <i class="fas fa-images"></i> ${gallery.length} fotos
            </div>
        ` : ''}
        
        <img src="${moto.image}" alt="${moto.name}" class="moto-image" 
             onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25856cd63?w=400'">
        
        <div class="moto-info">
            <h3 class="moto-name">${moto.name}</h3>
            <div class="moto-price">${moto.price}</div>
            
            <div class="moto-details">
                <span><i class="fas fa-calendar"></i> ${moto.year}</span>
                <span><i class="fas fa-tachometer-alt"></i> ${moto.km}</span>
            </div>
            
            ${moto.features && moto.features.length > 0 ? `
                <div class="moto-features">
                    ${moto.features.map(feature => `<span>${feature.trim()}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="moto-location">
                <i class="fas fa-map-marker-alt"></i> 
                <span>${moto.location}</span>
            </div>
            
            ${gallery.length > 1 ? `
                <div class="view-gallery">
                    <i class="fas fa-expand"></i> Ver Galeria
                </div>
            ` : ''}
            
            <a href="#contato" class="btn" data-moto="${moto.name}" 
               style="margin-top: 15px; display: block; text-align: center;">
                Tenho Interesse
            </a>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn')) {
            openGallery(index);
        }
    });
    
    return card;
}

async function reloadMotosData() {
    const reloadBtn = document.getElementById('reloadBtn');
    if (!reloadBtn) return;
    
    const originalText = reloadBtn.innerHTML;
    reloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
    reloadBtn.disabled = true;
    
    try {
        await loadMotosSection();
        reloadBtn.innerHTML = '<i class="fas fa-check"></i> Atualizado!';
        
        setTimeout(() => {
            reloadBtn.innerHTML = originalText;
            reloadBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        reloadBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro!';
        setTimeout(() => {
            reloadBtn.innerHTML = originalText;
            reloadBtn.disabled = false;
        }, 2000);
    }
}

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
    
    closeBtn.onclick = closeGallery;
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeGallery();
        }
    };
    
    prevBtn.onclick = prevImage;
    nextBtn.onclick = nextImage;
    
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        }
    });
}

function setupForm() {
    const form = document.querySelector('form[name="contato"]');
    if (form) {
        form.addEventListener('submit', function(e) {
            const nome = document.getElementById('nome').value;
            const telefone = document.getElementById('telefone').value;
            
            if (!nome || !telefone) {
                e.preventDefault();
                alert('Por favor, preencha pelo menos o nome e telefone.');
                return;
            }
        });
    }
}

async function init() {
    await loadMotosSection();
    setupGalleryEvents();
    setupForm();
    
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });
    
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
                
                document.querySelector('nav ul').classList.remove('show');
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && e.target.hasAttribute('data-moto')) {
            const motoName = e.target.getAttribute('data-moto');
            const select = document.getElementById('plano');
            
            let planoValue = 'completo';
            if (motoName.includes('Biz') || motoName.includes('NMax')) {
                planoValue = 'premium';
            } else if (motoName.includes('CG') || motoName.includes('Factor')) {
                planoValue = 'completo';
            }
            
            select.value = planoValue;
            
            document.getElementById('contato').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    updateFooterInfo();
}

function updateFooterInfo() {
    document.getElementById("year").textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init);