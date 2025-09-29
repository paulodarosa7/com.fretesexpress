const btnContinuar = document.getElementById("btnContinuar");
const btnEntrarFreteiro = document.getElementById("btnEntrarFreteiro"); 
const btnEntrarUsuario = document.getElementById("btnEntrarUsuario");

const telaCadastro1 = document.getElementById("telaCadastro1");
const telaCadastro2 = document.getElementById("telaCadastro2");


telaCadastro2.classList.add("hidden");

btnContinuar.addEventListener("click", (e) => {
    e.preventDefault(); // impede o submit automático

    const form1 = telaCadastro1.querySelector("form");

    if (!form1.checkValidity()) {
      form1.reportValidity(); // mostra os erros
      return;
    }

    // se está tudo preenchido, troca de tela
    telaCadastro1.classList.add("hidden");
    telaCadastro2.classList.remove("hidden");
});


btnEntrarFreteiro.addEventListener("click", (e) => {
  e.preventDefault(); // impede o submit automático
  window.location.href = "tela_inicial_freteiro.html";
    
});

// btnEntrarUsuario.addEventListener("click", (e) => {
//   e.preventDefault(); // impede o submit automático
//   window.location.href = "tela_inicial_usuario.html";
// });







