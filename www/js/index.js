document.addEventListener("DOMContentLoaded", () => {
  const loginPage = document.getElementById("login-page");
  const cadastroPage = document.getElementById("cadastro-page");

  // Alternar entre login e cadastro
  document.getElementById("link-cadastro").addEventListener("click", () => {
    loginPage.classList.add("hidden");
    cadastroPage.classList.remove("hidden");
  });

  document.getElementById("link-login").addEventListener("click", () => {
    cadastroPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
  });

  // Cadastro com login automático
  document.getElementById("cadastro-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("cadastro-email").value;
    const senha = document.getElementById("cadastro-senha").value;

    // Salva dados no localStorage
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userSenha", senha);

    // Marca como logado
    localStorage.setItem("logado", "true");
    localStorage.setItem("logadoEmail", email);

    alert("Cadastro realizado com sucesso! Redirecionando...");
    window.location.href = "ride.html";
  });

  // Login
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    const savedEmail = localStorage.getItem("userEmail");
    const savedSenha = localStorage.getItem("userSenha");

    if (email === savedEmail && senha === savedSenha) {
      localStorage.setItem("logado", "true");
      localStorage.setItem("logadoEmail", email);
      window.location.href = "ride.html";
    } else {
      alert("E-mail ou senha inválidos.");
    }
  });
});
