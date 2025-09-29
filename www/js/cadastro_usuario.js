
const btnContinuar = document.getElementById("btnContinuar");
const btnEntrarUsuario = document.getElementById("btnEntrarUsuario");


btnEntrarUsuario.addEventListener("click", (e) => {
  e.preventDefault(); // impede o submit automático
  window.location.href = "tela_inicial_usuario.html";
});




