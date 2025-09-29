const origemInput = document.getElementById('origem');
const destinoInput = document.getElementById('destino');
const origemAutocomplete = document.getElementById('autocomplete-origem');
const destinoAutocomplete = document.getElementById('autocomplete-destino');
const pedirFreteBtn = document.getElementById('pedirFreteBtn');
const veiculoSelect = document.getElementById('veiculo');
const pesoInput = document.getElementById('peso');
const precoDiv = document.getElementById('preco');
const sairBtn = document.getElementById('sairBtn');

let origemCoords = null;
let destinoCoords = null;

// Função debounce para otimizar as requisições enquanto o usuário digita
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Função para buscar endereços usando a API Photon em inglês
async function fetchAddresses(query, container) {
  if (!query) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = 'Carregando...';

  try {
    // URL da API Photon para buscar endereços
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`;  // Usando 'en' para inglês
    const res = await fetch(url);
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      container.innerHTML = '';
      data.features.forEach((feature) => {
        const item = document.createElement('div');
        item.textContent = feature.properties.name + ', ' + (feature.properties.city || feature.properties.state || '');
        item.dataset.lat = feature.geometry.coordinates[1]; // Latitude
        item.dataset.lon = feature.geometry.coordinates[0]; // Longitude

        container.appendChild(item); // Adiciona o item ao container
      });

      container.style.display = 'block';
    } else {
      container.style.display = 'none';
      container.innerHTML = 'Nenhum endereço encontrado.';
    }
  } catch (error) {
    console.error('Erro na busca de endereços:', error);
    container.style.display = 'none';
    container.innerHTML = 'Erro ao buscar endereços.';
  }
}

// Evento de input para origem
origemInput.addEventListener(
  'input',
  debounce(() => fetchAddresses(origemInput.value, origemAutocomplete), 300)
);

// Evento de input para destino
destinoInput.addEventListener(
  'input',
  debounce(() => fetchAddresses(destinoInput.value, destinoAutocomplete), 300)
);

// Função para preencher o campo de input ao selecionar um endereço do autocomplete
function selectAddress(input, container, latLon) {
  input.value = latLon.textContent; // Preenche o campo com o nome do endereço
  input.dataset.lat = latLon.dataset.lat; // Atribui a latitude
  input.dataset.lon = latLon.dataset.lon; // Atribui a longitude
  container.style.display = 'none'; // Fecha o container do autocomplete
}

// Eventos de clique para selecionar o endereço de origem
origemAutocomplete.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'DIV') {
    selectAddress(origemInput, origemAutocomplete, e.target);
  }
});

// Eventos de clique para selecionar o endereço de destino
destinoAutocomplete.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'DIV') {
    selectAddress(destinoInput, destinoAutocomplete, e.target);
  }
});

// Inicializa o mapa com Leaflet
let map = L.map('map').setView([-24.955, -53.455], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

let routeLayer = null;

// Função para calcular a distância entre duas coordenadas
function calculaDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Retorna a distância em km
}

// Função para calcular o preço do frete
function calculaPreco(distancia, peso, veiculo) {
  let precoBase = 50; // Preço base
  let precoPeso = peso * 2; // Preço com base no peso
  let precoDistancia = distancia * 3; // Preço com base na distância
  let fatorVeiculo = 1;

  if (veiculo === 'caminhao') fatorVeiculo = 1.5;
  else if (veiculo === 'caminhonete') fatorVeiculo = 1.2;

  return precoBase + precoPeso + precoDistancia * fatorVeiculo; // Retorna o preço estimado
}

// Função para desenhar a rota no mapa
function desenhaRota(lat1, lon1, lat2, lon2) {
  if (routeLayer) {
    map.removeLayer(routeLayer); // Remove a rota anterior
  }

  // Usando o Leaflet Routing Machine para desenhar a rota
  routeLayer = L.Routing.control({
    waypoints: [
      L.latLng(lat1, lon1),  // Coordenadas da origem
      L.latLng(lat2, lon2)    // Coordenadas do destino
    ],
    routeWhileDragging: true,  // Permite arrastar a rota enquanto o usuário move os pontos
    lineOptions: {
      styles: [{ color: 'red', weight: 4, opacity: 0.7 }]  // Estilo da linha da rota
    }
  }).addTo(map);

  // Adiciona marcadores nos pontos de origem e destino
  L.marker([lat1, lon1]).addTo(map).bindPopup('Origem').openPopup();
  L.marker([lat2, lon2]).addTo(map).bindPopup('Destino').openPopup();

  // Ajusta o mapa para exibir a rota corretamente
  map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
}

// Evento do botão "Pedir Frete" para calcular preço e desenhar a rota
pedirFreteBtn.addEventListener('click', () => {
  // Verifica se todos os campos estão preenchidos
  if (
    !origemInput.dataset.lat ||
    !origemInput.dataset.lon ||
    !destinoInput.dataset.lat ||
    !destinoInput.dataset.lon ||
    !pesoInput.value ||
    pesoInput.value <= 0 ||
    isNaN(pesoInput.value)
  ) {
    precoDiv.innerHTML = '<div style="color: red;">Por favor, preencha todos os campos corretamente.</div>';
    return;
  }

  // Pega as coordenadas de origem e destino
  const lat1 = parseFloat(origemInput.dataset.lat);
  const lon1 = parseFloat(origemInput.dataset.lon);
  const lat2 = parseFloat(destinoInput.dataset.lat);
  const lon2 = parseFloat(destinoInput.dataset.lon);

  origemCoords = [lat1, lon1];
  destinoCoords = [lat2, lon2];

  // Calcula a distância
  const distancia = calculaDistancia(lat1, lon1, lat2, lon2);

  // Calcula o preço com base na distância e peso
  const peso = parseFloat(pesoInput.value);
  const veiculo = veiculoSelect.value;
  const preco = calculaPreco(distancia, peso, veiculo);

  // Exibe o preço estimado
  precoDiv.textContent = `💰 Preço estimado: R$ ${preco.toFixed(2)}`;

  // Desenha a rota no mapa
  desenhaRota(lat1, lon1, lat2, lon2);
});

// Evento do botão "Sair" para recarregar a página
sairBtn.addEventListener('click', () => {
  window.location.reload();
});
