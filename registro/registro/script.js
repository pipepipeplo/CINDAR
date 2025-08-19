const container = document.getElementById('container');
const linkToRegister = document.getElementById('link-register');
const linkToLogin = document.getElementById('link-login');

// Función para alternar entre formularios
function toggleForm() {
  container.classList.toggle('toggle');
  
  // Agregar clase de animación
  const forms = document.querySelectorAll('.container-form');
  forms.forEach(form => {
    form.classList.remove('active');
    setTimeout(() => form.classList.add('active'), 100);
  });
}

// Event listeners para los enlaces
linkToRegister?.addEventListener('click', (e) => {
  e.preventDefault();
  if (!container.classList.contains('toggle')) {
    toggleForm();
  }
});

linkToLogin?.addEventListener('click', (e) => {
  e.preventDefault();
  if (container.classList.contains('toggle')) {
    toggleForm();
  }
});

// Manejar envío de formularios
document.querySelectorAll('.formulario').forEach(function(form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Agregar efecto de carga al botón
    const button = this.querySelector('.button');
    const originalText = button.textContent;
    button.textContent = 'Procesando...';
    button.style.opacity = '0.7';
    
    // Simular proceso de login/registro
    setTimeout(() => {
      button.textContent = originalText;
      button.style.opacity = '1';
      
      // Aquí puedes agregar la lógica real de autenticación
      // window.location.href = '../../index.html';
      alert('Formulario enviado correctamente');
    }, 2000);
  });
});

// Mejorar la experiencia táctil en móviles
if ('ontouchstart' in window) {
  document.querySelectorAll('.button, .social-networks ion-icon, a').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    element.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
}

// Animación inicial
window.addEventListener('load', () => {
  container.style.opacity = '0';
  container.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    container.style.transition = 'all 0.6s ease';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 100);
});