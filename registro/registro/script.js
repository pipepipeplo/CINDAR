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

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para mostrar mensajes de error
function showError(message) {
  // Remover mensaje anterior si existe
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    background: #ff4757;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    margin: 10px 0;
    font-size: 14px;
    text-align: center;
    animation: slideDown 0.3s ease;
  `;

  // Insertar antes del primer formulario
  const activeForm = document.querySelector('.formulario');
  activeForm.insertBefore(errorDiv, activeForm.children[2]);

  // Remover después de 5 segundos
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

// Función para mostrar mensajes de éxito
function showSuccess(message) {
  const existingSuccess = document.querySelector('.success-message');
  if (existingSuccess) {
    existingSuccess.remove();
  }

  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    background: #2ed573;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    margin: 10px 0;
    font-size: 14px;
    text-align: center;
    animation: slideDown 0.3s ease;
  `;

  const activeForm = document.querySelector('.formulario');
  activeForm.insertBefore(successDiv, activeForm.children[2]);

  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.remove();
    }
  }, 3000);
}

// Manejar registro
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.querySelectorAll('.formulario')[1]; // Segundo formulario (registro)
  const loginForm = document.querySelectorAll('.formulario')[0]; // Primer formulario (login)

  // Manejar envío de formulario de registro
  registerForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const button = this.querySelector('.button');
    const originalText = button.textContent;
    
    // Obtener valores de los campos
    const nameInput = this.querySelector('input[placeholder*="Nombre"]');
    const emailInput = this.querySelector('input[type="email"]');
    const passwordInput = this.querySelector('input[type="password"]');
    
    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();

    // Validaciones
    if (!name || name.length < 2) {
      showError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (!email || !isValidEmail(email)) {
      showError('Por favor ingresa un email válido');
      return;
    }

    if (!password || password.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Verificar si el email ya está registrado
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existingUsers.find(user => user.email === email)) {
      showError('Este email ya está registrado');
      return;
    }

    // Efecto de carga al botón
    button.textContent = 'Registrando...';
    button.style.opacity = '0.7';
    
    // Simular proceso de registro
    setTimeout(() => {
      // Guardar usuario en localStorage
      const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // En producción, esto debería estar encriptado
        registeredAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      button.textContent = originalText;
      button.style.opacity = '1';
      
      showSuccess('¡Registro exitoso! Ahora puedes iniciar sesión');
      
      // Limpiar formulario
      this.reset();
      
      // Cambiar a formulario de login después de 2 segundos
      setTimeout(() => {
        if (container.classList.contains('toggle')) {
          toggleForm();
        }
      }, 2000);
    }, 2000);
  });

  // Manejar envío de formulario de login
  loginForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const button = this.querySelector('.button');
    const originalText = button.textContent;
    
    // Obtener valores de los campos
    const emailInput = this.querySelector('input[type="email"]');
    const passwordInput = this.querySelector('input[type="password"]');
    
    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();

    // Validaciones
    if (!email || !isValidEmail(email)) {
      showError('Por favor ingresa un email válido');
      return;
    }

    if (!password) {
      showError('Por favor ingresa tu contraseña');
      return;
    }

    // Efecto de carga al botón
    button.textContent = 'Iniciando...';
    button.style.opacity = '0.7';
    
    // Simular proceso de login
    setTimeout(() => {
      // Verificar credenciales
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.email === email && u.password === password);

      if (user) {
        // Login exitoso
        localStorage.setItem('currentUser', JSON.stringify(user));
        showSuccess('¡Bienvenido ' + user.name + '!');
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          window.location.href = '../../index.html';
        }, 1500);
      } else {
        // Credenciales inválidas
        button.textContent = originalText;
        button.style.opacity = '1';
        showError('Email o contraseña incorrectos');
      }
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

  // Agregar estilos para mensajes de error y éxito
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});