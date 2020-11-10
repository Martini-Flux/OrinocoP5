const url = "http://localhost:3000/api/furniture";  // Url de l'api
const urlPost = "http://localhost:3000/api/furniture/order";  // Url de la requête

const container = document.querySelector(".container"); // Endroit visé

// Récupération
const fetchProducts = async () => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    container.innerHTML += `
    <p class="error">Erreur serveur, veuillez réessayer ultérieurement.</p>
    <p class="error">Merci de votre compréhension</p>
    `;
    return console.log(error);
  }
};

fetchProducts().then(data => {  // Reprend les données du tableau récupéré
  const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }); 
  
  const cartContent = JSON.parse(localStorage.getItem("cartContent")); 
  let priceCounter = 0;  // Compteur de somme totale

  if (!localStorage.getItem("cartContent")) {  
    container.innerHTML += `<p class="empty">Votre panier est vide.</p>`;
  } else {
    const cartItems = cartContent.map(itemId => {
      const cartItem = data.find(item => item._id === itemId); 
      priceCounter += cartItem.price; 
      return `
        <tr>
          <th scope="row">
          <i class="far fa-trash-alt mr-2 text-muted cursor-pointer delete">
          </i>
            <a href="product.html?_id:${cartItem._id}" class="item-name">${cartItem.name}
          </th>
          <td class="text-right">${formatter.format(cartItem.price / 100)}</td>
        </tr>
      `;
    }).join(""); // Assemble les informations

    container.innerHTML += `
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th scope="col">Nom du produit</th>
            <th scope="col" class="text-right">Prix</th>
          </tr>
        </thead>
        <tbody class="cart">${cartItems}</tbody>
      </table>
    `;

    container.innerHTML += `<p class=" total-price">Total : ${formatter.format(priceCounter / 100)}</p>`; 

 // Création du formulaire de contact
    container.innerHTML += `
      <form class="mt-5 validation-form">
        <input type="text" class="form-control" id="firstName" placeholder="Prénom" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{2,30}$" title="2 à 30 lettres, sans accents ni caractères spéciaux." required>
        <input type="text" class="form-control" id="lastName" placeholder="Nom de famille" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{2,30}$" title="2 à 30 lettres, sans accents ni caractères spéciaux." required>
        <input type="text" class="form-control" id="address" placeholder="Adresse" required>
        <input type="text" class="form-control" id="city" placeholder="Ville" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{2,30}$" required>
        <input type="email" class="form-control mb-4" id="email" placeholder="Adresse électronique" required>
        <button type="submit" class="btn btn-success w-100">Valider le panier</button>
      </form>
    `;

    // Supprime un produit du tableau
    const cart = document.querySelector(".cart"); 
    const array = Array.from(cart.children); 

    // Au clic sur l'icône de suppression
    cart.addEventListener("click", event => {
      if (event.target.classList.contains("delete")) {
        const targetTr = event.target.parentElement.parentElement; 
        const index = array.indexOf(targetTr); 
        
        if (array.length === 1) {  // Suprime le tableau entier si il n'y a qu'un seul produit
          localStorage.removeItem("cartContent");
          window.location.reload();
        } else {  // Suprime individuellement
          cartContent.splice(index, 1);
          localStorage.setItem("cartContent", JSON.stringify(cartContent));
          window.location.reload();
        }
      }
    });
 // Envoi le formulaire et les produits
    const form = document.querySelector(".validation-form"); 
    const { firstName, lastName, address, city, email } = form;

    // À la soumission du formulaire
    form.addEventListener("submit", event => {
      event.preventDefault();
 // Envoi de la commande
      const postProducts = async () => {
        try {
          const response = await fetch(urlPost, {
            method: "POST",
            headers: new Headers({
              "Content-Type": "application/json",
            }),
            body: JSON.stringify({
              contact: {
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                address: address.value.trim(),
                city: city.value.trim(),
                email: email.value.trim(),
              },
              products: cartContent,
            }),
          });
          return await response.json(); 
        } catch (error) {
          container.innerHTML += `<p class="error">Un problème est survenu lors de la transmission de votre commande.</p>`;
          return console.log(error);
        }
      };

      postProducts().then((orderData) => {
        localStorage.clear(); // Reset 
        localStorage.setItem("orderData", JSON.stringify(orderData)); // Enregistre les informations
        localStorage.setItem("orderPrice", formatter.format(priceCounter / 100));
        if (localStorage.getItem("orderData") !== "undefined") {
          window.location.href = "confirmation.html"; // Redirige vers la confirmation
        }
      });
    });
  }
});