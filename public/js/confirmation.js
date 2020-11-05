const container = document.querySelector(".container");

if (localStorage.getItem("orderData") && localStorage.getItem("orderPrice")){
	const orderData = JSON.parse(localStorage.orderData);
	const firstName = Object.values(orderData.contact.firstName).join("");
	const orderId = Object.values(orderData.orderId).join("");
	const price = localStorage.getItem("orderPrice");

	container.innerHTML +=`
	<div class = "txt-center">
		<i class="far fa-grin-stars"></i>
		<p class = "conf">Voici votre identifiant de commande</p>
		<p class = "conf"><strong>${orderId}</strong></p>
		<p class = "conf">Concervez-le precieusement!</p>
		<p class = "conf">La somme de <strong>${price}</strong> sera prochainement débitée sur le moyen de paiement selectionné.</p>
		<p class = "conf">Merci de votre confiance ${firstName}, et à bientôt !</p>
	</div>
	`;

} else {
	container.innerHTML += `
	<p class = "confi">Vous n'avez passé aucune commande.</p>
	`;
}