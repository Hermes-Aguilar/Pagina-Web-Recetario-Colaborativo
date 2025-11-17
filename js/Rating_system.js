// Sistema de Calificación Interactivo - La Cabaña
// ================================================

class RatingSystem {
    constructor() {
        this.ratings = this.loadRatings();
        this.userRatings = this.loadUserRatings();
        this.init();
    }

    // Inicializar el sistema
    init() {
        this.createModal();
        this.setupRatings();
        this.setupBookmarks();
    }

    // Cargar calificaciones desde localStorage
    loadRatings() {
        const stored = localStorage.getItem('lacabana_ratings');
        return stored ? JSON.parse(stored) : {};
    }

    // Cargar calificaciones del usuario desde localStorage
    loadUserRatings() {
        const stored = localStorage.getItem('lacabana_user_ratings');
        return stored ? JSON.parse(stored) : {};
    }

    // Guardar calificaciones en localStorage
    saveRatings() {
        localStorage.setItem('lacabana_ratings', JSON.stringify(this.ratings));
    }

    // Guardar calificaciones del usuario en localStorage
    saveUserRatings() {
        localStorage.setItem('lacabana_user_ratings', JSON.stringify(this.userRatings));
    }

    // Crear modal de confirmación
    createModal() {
        if (document.getElementById('ratingModal')) return;

        const modal = document.createElement('div');
        modal.id = 'ratingModal';
        modal.className = 'rating-modal';
        modal.innerHTML = `
            <div class="rating-modal-content">
                <div class="rating-modal-icon">⭐</div>
                <h3>¡Gracias por tu calificación!</h3>
                <p id="ratingModalMessage">Tu opinión nos ayuda a mejorar</p>
                <button class="rating-modal-close" onclick="ratingSystem.closeModal()">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // Mostrar modal
    showModal(message = 'Tu opinión nos ayuda a mejorar') {
        const modal = document.getElementById('ratingModal');
        const messageEl = document.getElementById('ratingModalMessage');
        if (modal && messageEl) {
            messageEl.textContent = message;
            modal.classList.add('active');
            
            // Auto-cerrar después de 3 segundos
            setTimeout(() => this.closeModal(), 3000);
        }
    }

    // Cerrar modal
    closeModal() {
        const modal = document.getElementById('ratingModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Obtener ID único del elemento
    getItemId(element) {
        const h2 = element.querySelector('h2');
        return h2 ? h2.textContent.trim() : 'item_' + Math.random().toString(36).substr(2, 9);
    }

    // Calcular promedio de calificaciones
    calculateAverage(itemId) {
        const itemRatings = this.ratings[itemId];
        if (!itemRatings || itemRatings.length === 0) return 0;
        
        const sum = itemRatings.reduce((a, b) => a + b, 0);
        return (sum / itemRatings.length).toFixed(1);
    }

    // Obtener número de calificaciones
    getRatingCount(itemId) {
        return this.ratings[itemId] ? this.ratings[itemId].length : 0;
    }

    // Configurar sistema de calificación
    setupRatings() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemId = this.getItemId(item);
            const ratingContainer = item.querySelector('.rating-stars');
            
            if (!ratingContainer) return;
            
            // Limpiar el contenido (funciona con ★ o ☆)
            ratingContainer.textContent = '';

            // Convertir a sistema interactivo
            const currentRating = this.userRatings[itemId] || 0;
            const averageRating = this.calculateAverage(itemId);
            const ratingCount = this.getRatingCount(itemId);

            ratingContainer.className = 'rating-stars-interactive';
            ratingContainer.innerHTML = this.createStarsHTML(currentRating, averageRating, ratingCount);
            ratingContainer.dataset.itemId = itemId;

            // Agregar eventos
            this.addRatingEvents(ratingContainer);
        });
    }

    // Crear HTML de estrellas
    createStarsHTML(userRating, averageRating, ratingCount) {
        let html = '<div class="rating-tooltip">Califica esta receta</div>';
        
        for (let i = 1; i <= 5; i++) {
            const filled = i <= userRating ? 'filled' : '';
            html += `<span class="star ${filled}" data-rating="${i}">★</span>`;
        }
        
        if (ratingCount > 0) {
            html += `<span class="rating-text">${averageRating}</span>`;
            html += `<span class="rating-count">${ratingCount}</span>`;
        }
        
        return html;
    }

    // Agregar eventos de calificación
    addRatingEvents(container) {
        const stars = container.querySelectorAll('.star');
        const itemId = container.dataset.itemId;

        stars.forEach((star, index) => {
            // Hover effect
            star.addEventListener('mouseenter', () => {
                this.highlightStars(stars, index + 1);
            });

            // Click to rate
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                const rating = parseInt(star.dataset.rating);
                this.submitRating(itemId, rating, container);
            });
        });

        // Reset hover on mouse leave
        container.addEventListener('mouseleave', () => {
            const currentRating = this.userRatings[itemId] || 0;
            this.highlightStars(stars, currentRating);
        });
    }

    // Resaltar estrellas
    highlightStars(stars, count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('hover');
            } else {
                star.classList.remove('hover');
            }
        });
    }

    // Enviar calificación
    submitRating(itemId, rating, container) {
        // Guardar calificación del usuario
        const previousRating = this.userRatings[itemId];
        this.userRatings[itemId] = rating;
        this.saveUserRatings();

        // Actualizar calificaciones generales
        if (!this.ratings[itemId]) {
            this.ratings[itemId] = [];
        }
        
        // Si el usuario ya había calificado, reemplazar su calificación
        if (previousRating) {
            const index = this.ratings[itemId].indexOf(previousRating);
            if (index > -1) {
                this.ratings[itemId][index] = rating;
            }
        } else {
            this.ratings[itemId].push(rating);
        }
        
        this.saveRatings();

        // Actualizar UI
        this.updateRatingDisplay(itemId, container);

        // Animación de confirmación
        container.classList.add('rating-submitted');
        setTimeout(() => {
            container.classList.remove('rating-submitted');
        }, 500);

        // Mostrar modal
        const messages = [
            '¡Excelente! Tu calificación ha sido registrada',
            '¡Gracias! Tu opinión es muy valiosa',
            '¡Genial! Hemos guardado tu calificación',
            '¡Perfecto! Tu voto ha sido contabilizado'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showModal(randomMessage);
    }

    // Actualizar display de calificación
    updateRatingDisplay(itemId, container) {
        const userRating = this.userRatings[itemId];
        const averageRating = this.calculateAverage(itemId);
        const ratingCount = this.getRatingCount(itemId);

        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < userRating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });

        // Actualizar o crear texto de calificación
        let ratingText = container.querySelector('.rating-text');
        let ratingCountEl = container.querySelector('.rating-count');

        if (ratingCount > 0) {
            if (!ratingText) {
                ratingText = document.createElement('span');
                ratingText.className = 'rating-text';
                container.appendChild(ratingText);
            }
            ratingText.textContent = averageRating;

            if (!ratingCountEl) {
                ratingCountEl = document.createElement('span');
                ratingCountEl.className = 'rating-count';
                container.appendChild(ratingCountEl);
            }
            ratingCountEl.textContent = ratingCount;
        }
    }

    // Configurar sistema de marcadores
    setupBookmarks() {
        const bookmarks = this.loadBookmarks();
        const bookmarkIcons = document.querySelectorAll('.bookmark-icon');

        bookmarkIcons.forEach(icon => {
            const item = icon.closest('.menu-item');
            const itemId = this.getItemId(item);

            // Restaurar estado de marcador
            if (bookmarks[itemId]) {
                icon.classList.add('bookmarked');
                icon.style.filter = 'brightness(0.7) sepia(1) hue-rotate(-10deg) saturate(8)';
            }

            // Agregar evento de clic
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleBookmark(itemId, icon);
            });
        });
    }

    // Cargar marcadores
    loadBookmarks() {
        const stored = localStorage.getItem('lacabana_bookmarks');
        return stored ? JSON.parse(stored) : {};
    }

    // Guardar marcadores
    saveBookmarks(bookmarks) {
        localStorage.setItem('lacabana_bookmarks', JSON.stringify(bookmarks));
    }

    // Alternar marcador
    toggleBookmark(itemId, icon) {
        const bookmarks = this.loadBookmarks();
        
        if (bookmarks[itemId]) {
            delete bookmarks[itemId];
            icon.classList.remove('bookmarked');
            icon.style.filter = '';
            this.showToast('❌ Receta eliminada de favoritos');
        } else {
            bookmarks[itemId] = true;
            icon.classList.add('bookmarked');
            icon.style.filter = 'brightness(0.7) sepia(1) hue-rotate(-10deg) saturate(8)';
            this.showToast('⭐ Receta agregada a favoritos');
        }
        
        this.saveBookmarks(bookmarks);
    }

    // Mostrar toast notification
    showToast(message) {
        // Eliminar toast anterior si existe
        const existingToast = document.querySelector('.rating-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'rating-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1em;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        `;

        // Agregar animaciones CSS
        if (!document.getElementById('toastStyles')) {
            const style = document.createElement('style');
            style.id = 'toastStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Limpiar todas las calificaciones (útil para desarrollo)
    clearAllRatings() {
        if (confirm('¿Estás seguro de que quieres eliminar todas las calificaciones?')) {
            localStorage.removeItem('lacabana_ratings');
            localStorage.removeItem('lacabana_user_ratings');
            localStorage.removeItem('lacabana_bookmarks');
            this.ratings = {};
            this.userRatings = {};
            location.reload();
        }
    }
}

// Inicializar el sistema cuando el DOM esté listo
let ratingSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ratingSystem = new RatingSystem();
    });
} else {
    ratingSystem = new RatingSystem();
}

// Exponer función para limpiar calificaciones en consola (desarrollo)
window.clearRatings = () => {
    if (ratingSystem) {
        ratingSystem.clearAllRatings();
    }
};