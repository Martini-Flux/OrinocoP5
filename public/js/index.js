const url = "http://localhost:3000/api/furniture/"; 
const container = document.querySelector('.container'); // Endroit visé pour les produits
console.log(".container");

//récuperation des données
const fetchProducts = async() =>{
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (error){
		container.innerHTML +=`
		 <p class="error">Une erreur est survenue!</p>
		 <p class="error">Veuillez réessayer, merci de votre compréhension</p>
		 `;
		return console.log(url);
	}
};

// utilisation des données récuperées
fetchProducts().then(data =>{
	const formatter = new Intl.NumberFormat("fr-FR", { style : "currency", currency: "EUR" });
	const furnitures = data.map(furniture =>`
		<div class="col-sm-6">
		<div class="box">
			<img class="box-img" src="${furniture.imageUrl}" alt="Meuble en bois" ${furniture.name}>
			<div class="box-body">
				<a href="pages/product.html?_id=${furniture._id}" class="box-link">
				<h3 class="box-title stretched-link">${furniture.name}</h3> 
				</a>
					<p class="box-text">${furniture.description}</p>
					<p class="btn-primary">${formatter.format(furniture.price / 100)}</p>
				</div>
			</div>
		</div>
		 `).join("");

		container.innerHTML +=` <div class="products">${furnitures}</div>`;
});

