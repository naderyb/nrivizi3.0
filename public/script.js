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

