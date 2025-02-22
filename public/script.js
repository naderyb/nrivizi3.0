// Gestion du bouton d'inscription
const openModalBtn = document.getElementById('openModalBtn');

openModalBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default action

    // Create the message container
    const messageDiv = document.createElement('div');
    messageDiv.className = 
        "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 z-50";
    messageDiv.innerHTML = `
        <div class="bg-gray-800 text-white p-6 sm:p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 class="text-3xl font-bold text-red-400">⚠️ Désolé !</h2>
            <p class="mt-3 text-lg text-gray-300">
                Les inscriptions sont <span class="text-red-500 font-semibold">closes</span>.<br>
                Revenez plus tard pour d'autres événements incroyables avec le <span class="text-cyan-400 font-bold">Nexus Club</span>! 🚀
            </p>
            <button id="closeMessageBtn" class="mt-5 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md">
                Ok, compris !
            </button>
        </div>
    `;

    // Append message to the body
    document.body.appendChild(messageDiv);

    // Close the message when clicking the button
    document.getElementById("closeMessageBtn").addEventListener("click", function () {
        messageDiv.remove();
    });
});

// Countdown Timer
const targetDate = new Date('Feb 25, 2025 00:00:00').getTime();
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
