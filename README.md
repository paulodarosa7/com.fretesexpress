# 🚚 FretesExpress

O **FretesExpress** é um aplicativo híbrido desenvolvido para facilitar a conexão entre motoristas e clientes que precisam solicitar serviços de frete, de forma rápida, intuitiva e eficiente.

O aplicativo conta com uma interface maneira, simples e prática, permitindo que o usuário cadastre, visualize e gerencie pedidos de transporte diretamente pelo celular.

Além disso, o **FretesExpress** abre espaço para **MEIs, autônomos e profissionais independentes** que desejam oferecer serviços de transporte de cargas para outras pessoas, tornando o processo mais acessível e confiável.

---

## 📱 Tecnologias Utilizadas

Apache Cordova → para empacotar o código web em aplicativo mobile.

HTML5, CSS3 e JavaScript → responsáveis pela interface e lógica da aplicação.

Android Studio → utilizado como emulador e ambiente de testes.

---

## ⚙️ Funcionalidades

* 🔑 **Tela de login e cadastro** para solicitantes e motoristas.
* 📱 **Telas principais já criadas** para interação do usuário.
* 🗺️ **Geolocalização em tempo real**, utilizando a API open-source [Leaflet](https://leafletjs.com/), que permite visualizar a localização aproximada e exata do smartphone diretamente no mapa.
* 🎨 **Interface responsiva e otimizada** para dispositivos móveis, garantindo boa experiência tanto em smartphones quanto em tablets.
---

## 🛠️ Status do Projeto

🚧 Em desenvolvimento – novas funcionalidades de cadastro de fretes e integração com backend serão adicionadas.

---

Última modificação:
Resolvendo problema de timeout no android. O Leaflet não consegue puxar a informação do GPS por conta do pouco tempo de timeout. Timeout atual: 60 segundos.
