const btn = document.getElementById('btn'); // si aún lo tienes
const container = document.getElementById('container');

const linkToRegister = document.getElementById('link-register');
const linkToLogin = document.getElementById('link-login');

btn?.addEventListener('click', () => {
  container.classList.toggle('toggle');
});

linkToRegister?.addEventListener('click', (e) => {
  e.preventDefault();
  container.classList.add('toggle');
});

linkToLogin?.addEventListener('click', (e) => {
  e.preventDefault();
  container.classList.remove('toggle');
});

// Redirección para ambos formularios (login y registro)
document.querySelectorAll('.formulario .button').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    // Aquí deberías validar los datos si lo necesitas
    window.location.href = '../../index.html'; // Ruta corregida
  });
});