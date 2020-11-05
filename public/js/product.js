const url = "http://localhost:3000/api/furniture/"; 
const id = document.location.search.substring(5); // Récupère l'id du produit 
const urlId = url + id; 

const container = document.querySelector(".container"); 

// Récupération
const fetchProduct = async () => {
  try {
    const response = await fetch(urlId);
    return await response.json(); 
  } catch (error) {
    container.innerHTML += `
      <p class="error">Erreur serveur, veuillez réessayer ultérieurement.</p>
      <p class="error">Merci de votre compréhension</p>
    `;
    return console.log(error);
  }
};

fetchProduct().then(data => {
  const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  
  container.innerHTML += `
    <div class="card">
      <img class="img-produit" src="${data.imageUrl}" alt="Meuble ${data.name}">
      <div class="desc-prod">
        <h1>${data.name}</h1>
        <p class="text-prod">${data.description}</p>
        <p class="btn-primary">${formatter.format(data.price / 100)}</p><br>
        <div class="slc-prod">
        <select class="form-control">${data.varnish.map((varnish) => `<option>${varnish}</option>` )}</select>
                </div>
        <a href="cart.html">
          <button class="btn-cart btn">Ajouter au panier</button>
        </a>
      </div>
    </div>
  `;


  const addToCart = document.querySelector(".btn-cart"); 

  addToCart.addEventListener("click", () => {
    const cartContent = JSON.parse(localStorage.getItem("cartContent")) || []; 
    cartContent.push(id);
    localStorage.setItem("cartContent", JSON.stringify(cartContent)); 
  });
});