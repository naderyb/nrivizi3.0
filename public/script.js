// Gestion du formulaire d'inscription
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const inscriptionForm = document.getElementById('inscriptionForm');
const confirmation = document.getElementById('confirmation');

function openModal() {
    modal.classList.remove('hidden');
    modalContent.classList.remove('modal-close');
    modalContent.classList.add('modal-open');
}
openModalBtn.addEventListener('click', openModal);

closeModalBtn.addEventListener('click', () => {
    modalContent.classList.remove('modal-open');
    modalContent.classList.add('modal-close');
    setTimeout(() => {
        modal.classList.add('hidden');
        modalContent.classList.remove('modal-close');
        inscriptionForm.classList.remove('hidden');
        confirmation.classList.add('hidden');
        inscriptionForm.reset();
    }, 500);
});

// Updated form submission handling using Fetch API
inscriptionForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Gather form data from the inputs
    const formData = {
        nomPrenom: document.getElementById('nomPrenom').value,
        email: document.getElementById('email').value,
        formation: document.getElementById('formation').value,
        motivation: document.getElementById('motivation').value
    };

    // Send the data to the /process-form endpoint
    fetch('/process-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Hide the form and display the pre-prepared confirmation message
        inscriptionForm.classList.add('hidden');
        confirmation.classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you could display an error message to the user here
    });
});

// Countdown Timer vers le 13 février 2025
const targetDate = new Date('Feb 13, 2025 00:00:00').getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const gap = targetDate - now;

    if (gap < 0) {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(gap / (1000 * 60 * 60 * 24));
    const hours = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((gap % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

//fonction pour lire les paramètres de l'URL
function getQueryParams() {
    const params = {};
    window.location.search.substr(1).split("&").forEach(function(item) {
        const [key, value] = item.split("=");
        if (key) {
        params[key] = decodeURIComponent(value);
        }
    });
    return params;
    }
    
    document.addEventListener("DOMContentLoaded", () => {
    //récupération des informations de l'admin depuis l'URL
    const params = getQueryParams();
    const headerInfo = document.getElementById("adminHeaderInfo");
    const adminUsername = params.username || ""; // doit être passé lors de la redirection depuis login
    if (params.fullName && params.role) {
        headerInfo.innerText = `${params.fullName} - ${params.role}`;
    } else {
        headerInfo.innerText = "Administrateur";
    }
    
    //variables pour gérer la suppression via le modal
    let submissionToDeleteId = null;

    //référence au modal et à ses boutons
    const confirmationModal = document.getElementById("confirmationModal");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    
    //annuler la suppression : masquer le modal
    cancelDeleteBtn.addEventListener("click", () => {
        confirmationModal.classList.add("hidden");
        submissionToDeleteId = null;
    });
    
    //confirmer la suppression : envoyer la requête DELETE
    confirmDeleteBtn.addEventListener("click", () => {
        if (submissionToDeleteId) {
        fetch(`/submission/${submissionToDeleteId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminUsername })
        })
        .then(response => response.json())
        .then(result => {
            const actionMessage = document.getElementById("actionMessage");
            actionMessage.innerText = result.message;
            actionMessage.className = "text-red-500 font-bold text-center mb-4";
            confirmationModal.classList.add("hidden");
            //actualiser la liste après un délai pour laisser le temps de lire le message
            setTimeout(() => location.reload(), 1500);
        })
        .catch(err => {
            console.error(err);
            const actionMessage = document.getElementById("actionMessage");
            actionMessage.innerText = "Erreur lors de la suppression.";
            actionMessage.className = "text-red-500 font-bold text-center mb-4";
            confirmationModal.classList.add("hidden");
        });
        }
    });
    
    //récupérer la liste des inscriptions depuis le serveur
    fetch('/submissions')
        .then(response => response.json())
        .then(data => {
        const submissionsList = document.getElementById("submissionsList");
        submissionsList.innerHTML = "";
        if (data.length === 0) {
            submissionsList.innerHTML = '<p class="text-center text-gray-400">Aucune inscription pour le moment.</p>';
        } else {
            data.forEach(item => {
            //création de la carte pour chaque inscription
            const card = document.createElement('div');
            card.className = 'bg-gray-800 p-4 rounded-lg shadow';
            card.innerHTML = `
                <h3 class="text-xl font-bold">${item.nomPrenom}</h3>
                <p><strong>Email :</strong> ${item.email}</p>
                <p><strong>Formation :</strong> ${item.formation}</p>
                <p><strong>Motivation :</strong> ${item.motivation}</p>
                <p class="text-sm text-gray-400"><strong>Date :</strong> ${new Date(item.submission_date).toLocaleString()}</p>
            `;
            
            //zone pour les actions
            const actionsDiv = document.createElement('div');
            actionsDiv.className = "mt-2 flex space-x-2";

            //si l'inscription n'est ni validée ni supprimée, afficher les boutons
            if (!item.validated && !item.deleted) {
              // Bouton Valider
                const validateBtn = document.createElement("button");
                validateBtn.innerText = "Valider";
                validateBtn.className = "bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded";
                validateBtn.addEventListener("click", () => {
                fetch(`/submission/validate/${item.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ adminUsername })
                })
                .then(response => response.json())
                .then(result => {
                    const actionMessage = document.getElementById("actionMessage");
                    actionMessage.innerText = result.message;
                    actionMessage.className = "text-green-500 font-bold text-center mb-4";
                    setTimeout(() => location.reload(), 1500);
                })
                .catch(err => {
                    console.error(err);
                    const actionMessage = document.getElementById("actionMessage");
                    actionMessage.innerText = "Erreur lors de la validation.";
                    actionMessage.className = "text-red-500 font-bold text-center mb-4";
                });
                });
                actionsDiv.appendChild(validateBtn);

                //bouton Supprimer
                const deleteBtn = document.createElement("button");
                deleteBtn.innerText = "Supprimer";
                deleteBtn.className = "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded";
                deleteBtn.addEventListener("click", () => {
                //au lieu d'utiliser confirm(), afficher le modal de confirmation
                submissionToDeleteId = item.id;
                confirmationModal.classList.remove("hidden");
                });
                actionsDiv.appendChild(deleteBtn);
            } else {
                //si l'inscription est validée, afficher l'information de validation
                if (item.validated) {
                const validatedInfo = document.createElement("p");
                validatedInfo.className = "text-green-500 text-sm";
                validatedInfo.innerText = `Validée par ${item.validated_by}`;
                actionsDiv.appendChild(validatedInfo);
                }
                //si l'inscription est supprimée, afficher l'information de suppression
                if (item.deleted) {
                const deletedInfo = document.createElement("p");
                deletedInfo.className = "text-red-500 text-sm";
                deletedInfo.innerText = `Supprimée par ${item.deleted_by}`;
                actionsDiv.appendChild(deletedInfo);
                }
            }
            
            card.appendChild(actionsDiv);
            submissionsList.appendChild(card);
            });
        }
        })
        .catch(err => {
        console.error("Erreur lors de la récupération des inscriptions : ", err);
        });
    });

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');

    fetch('/admin/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.success) {
        //affiche le message d'erreur directement sur la page
        document.getElementById('errorMessage').innerText = result.message || "Erreur lors de la connexion.";
        } else {
        //en cas de succès, rediriger vers admin.html en passant les infos dans l'URL
        const admin = result.admin;
        window.location.href = `/admin.html?username=${encodeURIComponent(admin.username)}&fullName=${encodeURIComponent(admin.fullName)}&role=${encodeURIComponent(admin.role)}`;
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById('errorMessage').innerText = "Erreur lors de la connexion.";
    });
    });