function initializeMatchManager() {
    const BASE_URL = 'http://localhost:3030/jsonstore/matches';
    const endpoints = { update: id => `${BASE_URL}/${id}`, delete: id => `${BASE_URL}/${id}` };
    const elements = {
        host: document.getElementById("host"),
        score: document.getElementById("score"),
        guest: document.getElementById("guest"),
        list: document.getElementById('list'),
        addBtn: document.getElementById("add-match"),
        editBtn: document.getElementById("edit-match"),
        loadBtn: document.getElementById("load-matches")
    };

    let selectedMatchId = null;

    function attachEvents() {
        elements.loadBtn.addEventListener('click', loadMatches);
        elements.addBtn.addEventListener('click', createMatch);
        elements.editBtn.addEventListener('click', editMatchHandler);
    }

    async function fetchMatches() {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error('Failed to fetch matches');
            return await response.json();
        } catch (error) {
            console.error('Error fetching matches:', error);
            return {};  // Return an empty object in case of an error
        }
    }

    function createMatchElement(match) {
        const li = document.createElement('li');
        li.classList.add('match');
        li.innerHTML = `<span>${match.host} ${match.score} ${match.guest}</span><button class="change-btn">Change</button><button class="delete-btn">Delete</button>`;
        return li;
    }

    function renderMatches(matches) {
        elements.list.innerHTML = '';
        Object.values(matches).forEach(match => elements.list.appendChild(createMatchElement(match)));
        attachEventListeners();  // Attach event listeners once after updating the list
        elements.editBtn.disabled = true;
    }

    async function loadMatches() {
        const matches = await fetchMatches();
        renderMatches(matches);
    }

    async function getMatchIdByHost(host) {
        const matches = await fetchMatches();
        return Object.values(matches).find(match => match.host === host)?._id;
    }

    async function createMatch(ev) {
        ev.preventDefault();
        const { host, score, guest } = elements;
        if (host.value.trim() && score.value.trim() && guest.value.trim()) {
            try {
                await fetch(BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ host: host.value.trim(), score: score.value.trim(), guest: guest.value.trim() })
                });
                clearAllInputs();
                await loadMatches();
            } catch (error) {
                console.error('Error creating match:', error);
            }
        } else {
            console.warn('All fields must be filled out');
        }
    }

    async function editMatchHandler(ev) {
        ev.preventDefault();
        if (selectedMatchId) {
            try {
                await fetch(endpoints.update(selectedMatchId), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        host: elements.host.value.trim(),
                        score: elements.score.value.trim(),
                        guest: elements.guest.value.trim(),
                        _id: selectedMatchId
                    })
                });
                clearAllInputs();
                await loadMatches();
                selectedMatchId = null;
                elements.addBtn.disabled = false;
                elements.editBtn.disabled = true;
            } catch (error) {
                console.error('Error updating match:', error);
            }
        } else {
            console.warn('No match selected for editing');
        }
    }

    async function deleteMatch(host) {
        const matchId = await getMatchIdByHost(host);
        if (matchId) {
            try {
                await fetch(endpoints.delete(matchId), { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
                await loadMatches();
                selectedMatchId = null;
                elements.addBtn.disabled = false;
            } catch (error) {
                console.error('Error deleting match:', error);
            }
        } else {
            console.error('Match ID not found for host:', host);
        }
    }

    function attachEventListeners() {
        // Use event delegation to handle 'change' and 'delete' buttons
        elements.list.addEventListener('click', async (event) => {
            if (event.target.classList.contains('change-btn')) {
                const [host, score, guest] = event.target.closest('li').querySelector('span').textContent.split(' ');
                selectedMatchId = await getMatchIdByHost(host);
                if (selectedMatchId) {
                    elements.host.value = host;
                    elements.score.value = score;
                    elements.guest.value = guest;
                    elements.addBtn.disabled = true;
                    elements.editBtn.disabled = false;
                } else {
                    console.error('Match ID not found for host:', host);
                }
            } else if (event.target.classList.contains('delete-btn')) {
                const host = event.target.closest('li').querySelector('span').textContent.split(' ')[0];
                await deleteMatch(host);
            }
        });
    }

    function clearAllInputs() {
        elements.host.value = '';
        elements.score.value = '';
        elements.guest.value = '';
    }

    attachEvents();
}

initializeMatchManager();
