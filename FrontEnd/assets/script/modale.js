// GENERATION DES PROJETS

const sectionProjets = document.querySelector(".gallery");
const filterContainer = document.getElementById("filterContainer");
    
let data = null;
// Reset la section projets
function resetSectionProjets() {
    sectionProjets.innerHTML = "";
}
    
// Génère les projets
async function generationProjets(id) {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        data = await response.json();
    } catch {
        const p = document.createElement("p");
        p.classList.add("error");
        p.insertAdjacentHTML("Afterbegin", "Une erreur est survenue lors de la récupération des projets<br><br>Une tentative de reconnexion automatique auras lieu dans une minute<br><br><br><br>Si le problème persiste, veuillez contacter l'administrateur du site");
        sectionProjets.appendChild(p);
        await new Promise(resolve => setTimeout(resolve, 60000));
        window.location.href = "index.html";
    }
    
    resetSectionProjets();
    
    // Filtre les résultats
    if (id !== null) {
        data = data.filter(item => item.categoryId == id);
    }
    
    // Change la couleur du bouton en fonction du filtre
        document.querySelectorAll(".filter__btn").forEach(btn => {
            btn.classList.remove("filter__btn--active");
            document.querySelector(`.filter__btn-id-${id}`).classList.add("filter__btn--active");
    });
    
    
    if (data.length === 0 || data === undefined) {
        const p = document.createElement("p");
        p.classList.add("error");
        p.insertAdjacentHTML("Afterbegin", "Aucun projet à afficher <br><br>Toutes nos excuses pour la gêne occasionnée");
        sectionProjets.appendChild(p);
        return;
    }
    
    // Génère les projets dans le DOM
    for (let i = 0; i < data.length; i++) {
        const figure = document.createElement("figure");
        sectionProjets.appendChild(figure);
        figure.classList.add(`js-projet-${data[i].id}`); // Ajoute l'id du projet pour le lien vers la modale lors de la suppression
    
        const img = document.createElement("img");
        img.src = data[i].imageUrl;
        img.alt = data[i].title;
        figure.appendChild(img);
    
        const figcaption = document.createElement("figcaption");
        figcaption.insertAdjacentHTML("afterbegin", data[i].title);
        figure.appendChild(figcaption);
    }
}
    
// Appeler ces fonctions au chargement de la page
async function initializePage() {
    await generateFilterButtons();
    await generationProjets(null);
}
    
async function generateFilterButtons() {
    try {
        const response = await fetch('http://localhost:5678/api/categories'); // Mettez le bon chemin vers votre API pour récupérer les catégories
        const categories = await response.json();
    
        // Ajout du bouton "Tous"
        const btnAll = document.createElement("button");
        btnAll.classList.add("filter__btn", "filter__btn-id-null", "filter__btn--active");
        btnAll.textContent = "Tous";
        btnAll.addEventListener("click", () => generationProjets(null));
        filterContainer.appendChild(btnAll);
    
        // Ajout des boutons de catégorie
        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.classList.add("filter__btn", `filter__btn-id-${category.id}`);
            btn.textContent = category.name; // Assurez-vous que votre API renvoie les noms des catégories
            btn.addEventListener("click", () => generationProjets(category.id));
            filterContainer.appendChild(btn);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
    }
}
    
// Appeler la fonction d'initialisation au chargement de la page
initializePage();
    
//////////////////////////////////////////////////////////////////////////
///////////////////// Gestion Formulaire de Contact //////////////////////
//////////////////////////////////////////////////////////////////////////

let validContactForm = false;

const checkInputContact = () => {
    const regName = /^[a-zA-Z]+$/;
    const regMail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+/;
    const errorText = document.querySelector(".formContactError");

    if (regName.test(nameContact.value) && regMail.test(emailContact.value) && messageContact.value.trim() !== "") {
        sumbmitBtn.classList.remove("unable");
        errorText.textContent = "";
        validContactForm = true;
    } else {
        sumbmitBtn.classList.add("unable");
        validContactForm = false;
    }
};

const submitMessageContact = () => {
    const displayMessageContainer = document.querySelector(".messageContainer");
    const displayError = document.querySelector(".formContactError");

    if (validContactForm) {
        const sentMessage = `Merci ${nameContact.value}, votre message a bien été envoyé.`;
        const body = `Nom : ${nameContact.value}\nemail : ${emailContact.value}\n-------\nMessage : ${messageContact.value}`;
        console.log(body);
        /*alert(sentMessage);*/
        displayMessageContainer.textContent = sentMessage;
        setTimeout(() => {
            displayMessageContainer.textContent = ""; // Ajout pour effacer le message après un délai
        }, 1200);
        // Reset du formulaire
        nameContact.value = "";
        emailContact.value = "";
        messageContact.value = "";
        validContactForm = false;
        sumbmitBtn.classList.add("unable");
    } else {
        displayError.textContent = "Veuillez compléter tous les champs";
        setTimeout(() => {
            displayError.textContent = ""; // Ajout pour effacer le message après un délai
        }, 800);
    }
};

const init = async () => {
    // Formulaire
    nameContact.addEventListener("input", checkInputContact);
    emailContact.addEventListener("input", checkInputContact);
    messageContact.addEventListener("input", checkInputContact);
    formContact.addEventListener("submit", (e) => {
        e.preventDefault();
        submitMessageContact();
    });
};

init();


//////////////////////////////////////////////////////////////////////////
//////////////////////// Gestion Modale //////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// Reset la section projets
function resetmodaleSectionProjets() {  
	modaleSectionProjets.innerHTML = "";
}

// Ouverture de la modale
let modale = null;
let dataAdmin;
const modaleSectionProjets = document.querySelector(".js-admin-projets"); 

const openModale = function(e) {
    e.preventDefault()
    modale = document.querySelector(e.target.getAttribute("href"))

    modaleProjets(); // Génère les projets dans la modale admin
    // attendre la fin de la génération des projets
    setTimeout(() => {
        modale.style.display = null
        modale.removeAttribute("aria-hidden")
        modale.setAttribute("aria-modal", "true")
    }, 25);
    // Ajout EventListener sur les boutons pour ouvrir la modale projet
    document.querySelectorAll(".js-modale-projet").forEach(a => {
        a.addEventListener("click", openModaleProjet)});

    // Apl fermeture modale
    modale.addEventListener("click", closeModale)
    modale.querySelector(".js-modale-close").addEventListener("click", closeModale)
    modale.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)

};

// Génère les projets dans la modale admin
async function modaleProjets() { 
    const response = await fetch('http://localhost:5678/api/works'); 
    dataAdmin = await response.json();
    resetmodaleSectionProjets()
    for (let i = 0; i < dataAdmin.length; i++) {
        if (dataAdmin[i].id !== undefined) {
            const div = document.createElement("div");
            div.classList.add("gallery__item-modale");
            div.setAttribute("dataID", dataAdmin[i].id);
            modaleSectionProjets.appendChild(div);

            const img = document.createElement("img");
            img.src = dataAdmin[i].imageUrl;
            img.alt = dataAdmin[i].title;
            div.appendChild(img);

            const p = document.createElement("p");
            div.appendChild(p);
            p.classList.add(dataAdmin[i].id, "js-delete-work");

            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-trash-can"); 
            p.appendChild(icon);
        }
    }
    deleteWork()
}


//  Ferme la modale
const closeModale = function(e) {
    e.preventDefault()
    if (modale === null) return

    
    modale.setAttribute("aria-hidden", "true")
    modale.removeAttribute("aria-modal")

    modale.querySelector(".js-modale-close").removeEventListener("click", closeModale)

    // Fermeture de la modale apres 400ms 
    window.setTimeout(function() {
        modale.style.display = "none"
        modale = null
        resetmodaleSectionProjets()
    }, 300)
};


// Définit la "border" du click pour fermer la modale
const stopPropagation = function(e) {
    e.stopPropagation()
};
// Selectionne les éléments qui ouvrent la modale
document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", openModale)
});
// Ferme la modale avec la touche echap
window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModale(e)
        closeModaleProjet(e)}
});


////////////////////////////////////////////////////
///////////////// GESTION TOKEN LOGIN //////////////
////////////////////////////////////////////////////

// Récupération du token
const token = sessionStorage.getItem("token");
const AlredyLogged = document.querySelector(".js-alredy-logged");

adminPanel()
// Gestion de l'affichage des boutons admin
function adminPanel() {
    document.querySelectorAll(".admin__modifer").forEach(a => {
        if (token === null) {
            return;
        }
        else {
            a.removeAttribute("aria-hidden")
            a.removeAttribute("style")
            AlredyLogged.innerHTML = "logout";
            filterContainer.style.display="none"; //masque les boutons filtre
        }
    });
}
////////////////////////////////////////////////////////////
/////////////// SUPPRESSION D'UN PROJET ////////////////////
////////////////////////////////////////////////////////////

// Event listener sur les boutons supprimer par apport a leur id
function deleteWork() {
    let btnDelete = document.querySelectorAll(".js-delete-work");
    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", deleteProjets);
    }}

// Supprimer le projet
async function deleteProjets() {

    console.log("DEBUG DEBUT DE FUNCTION SUPRESSION")
    console.log(this.classList[0])
    console.log(token)

    await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
    })

    .then (response => {
        console.log(response)
        // Token true
        if (response.status === 204) {
            console.log("DEBUG SUPPRESION DU PROJET " + this.classList[0])
            refreshPage(this.classList[0])
        }
        // Token false
        else if (response.status === 401) {
            alert("Vous n'êtes pas autorisé à supprimer ce projet, merci de vous connecter avec un compte valide")
            window.location.href = "login.html";
        }
    })
    .catch (error => {
        console.log(error)
    })
}

// Rafraichit les projets sans recharger la page
function refreshPage(i) {
    /*modaleProjets();*/ // Relance la génération des projets dans la modale admin

    // Supprime le projet de la page d'accueil
    const projet = document.querySelector(`.js-projet-${i}`);
    if (projet) {
        projet.style.display = "none";
    }

    // Supprime le projet de la modale admin
    const modaleProjet = document.querySelector(`.gallery__item-modale[dataID="${i}"]`);
    if (modaleProjet) {
        modaleProjet.remove();
    }
}

////////////////////////////////////////////////////
///////// BOITE MODALE : PARTIE AJOUT PROJET ///////
////////////////////////////////////////////////////

// Ouverture de la modale projet
let modaleProjet = null;
const openModaleProjet = function(e) {
    e.preventDefault()
    modaleProjet = document.querySelector(e.target.getAttribute("href"))

    modaleProjet.style.display = null
    modaleProjet.removeAttribute("aria-hidden")
    modaleProjet.setAttribute("aria-modal", "true")

    // Apl fermeture modale
    modaleProjet.addEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-close").addEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)
    modaleProjet.querySelector(".js-modale-close").addEventListener("click", resetModaleProjet)

    modaleProjet.querySelector(".js-modale-return").addEventListener("click", backToModale)
    modaleProjet.querySelector(".js-modale-return").addEventListener("click", resetModaleProjet)
};


// Fermeture de la modale projet
const closeModaleProjet = function(e) {
    if (modaleProjet === null) return

    modaleProjet.setAttribute("aria-hidden", "true")
    modaleProjet.removeAttribute("aria-modal")

    modaleProjet.querySelector(".js-modale-close").removeEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation)

    modaleProjet.style.display = "none"
    modaleProjet = null
    
    closeModale(e)
};

// Retour au modale admin
const backToModale = function(e) {
    e.preventDefault()
    modaleProjet.style.display = "none"
    modaleProjet = null
    modaleProjets(dataAdmin)
};


///////////////////////////////////////////////////////
////////////// AJOUT D'UN PROJET //////////////////////
///////////////////////////////////////////////////////

const btnAjouterProjet = document.querySelector(".js-add-work");
/*btnAjouterProjet.addEventListener("click", addWork);*/
btnAjouterProjet.addEventListener("click", (event) => addWork(event, null));

const imageInput = document.querySelector(".js-image");
const previewImg = document.querySelector(".js-image-preview") ;
const formgpePhoto = document.querySelector(".form-group-photo") ;

// Ajouter un écouteur d'événements "change" à l'élément d'entrée de fichier
imageInput.addEventListener("change", function(event) {
    // Code pour mettre à jour l'aperçu de l'image ici
    const selectedImage = event.target.files[0];

    if (selectedImage) {
        const imagePreview = document.querySelector(".js-image-preview");
        // Vérifie si le type de fichier est pris en charge
        if (!['image/jpeg', 'image/png'].includes(selectedImage.type)) {
            alert("Le format de l'image doit être .jpg ou .png");
            return;
        }
        imagePreview.src = URL.createObjectURL(selectedImage);
        previewImg.style.display="block"; //affiche la preview du fichier selectionné
        beforePreview.style.display="none"; //cache la partie ajout d'un fichier
        formgpePhoto.classList.add("hide-after"); //cache le ::after
    }
});
// test reset modale v.0.1

function resetModaleProjet() {
    // Réinitialiser les valeurs des champs du formulaire
    document.querySelector(".js-title").value = "";
    document.querySelector(".js-categoryId").value = "";

    // Réinitialiser l'aperçu de l'image
    const imageInput = document.querySelector(".js-image");
    const previewImg = document.querySelector(".js-image-preview");
    const formgpePhoto = document.querySelector(".form-group-photo");

    imageInput.value = ""; // Réinitialiser la valeur de l'input file
    previewImg.src = "";   // Réinitialiser l'aperçu de l'image
    previewImg.style.display="none";
    beforePreview.style.display="";
}


// Ajouter un projet
async function addWork(event, id) {
    event.preventDefault();

    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;
    const imageInput = document.querySelector(".js-image");
    const image = imageInput.files[0];

    if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Merci de choisir une catégorie valide");
        return;
    } else if (image.size > 4 * 1024 * 1024) { // Pour vérifier si la taille est supérieure à 4 Mo
        alert("La taille de l'image doit être inférieure à 4 Mo");
        return;
    } else if (!['image/jpeg', 'image/png'].includes(image.type)) { // Pour vérifier si le type est .jpg ou .png
        alert("Le format de l'image doit être .jpg ou .png");
        return;
    } else {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 201) {
                alert("Projet ajouté avec succès");
                // MàJ de l'interface sans refaire d'appel API
                const newProject = await response.json();
                updateUIAfterAdd(newProject, id);

                backToModale(event);
                resetModaleProjet();
            } 
            if (response.status === 400) {
                alert("Merci de remplir tous les champs");
            } 
            if (response.status === 500) {
                alert("Erreur serveur");
            } 
            if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet");
                window.location.href = "login.html";
            }

        } catch (error) {
            console.log(error);
        }
    }
}
// MàJ de l'interface après l'ajout d'un projet
function updateUIAfterAdd(newProject, id) {
    // Ajout du nouveau projet à la liste existante
    const figure = document.createElement("figure");
    sectionProjets.appendChild(figure);
    figure.classList.add(`js-projet-${newProject.id}`);

    const img = document.createElement("img");
    img.src = newProject.imageUrl;
    img.alt = newProject.title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.insertAdjacentHTML("afterbegin", newProject.title);
    figure.appendChild(figcaption);
}
