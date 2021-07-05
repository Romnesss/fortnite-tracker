const namePlatContainer = document.getElementById('namePlatContainer');
const stats = document.getElementById('stats');
const usernameInput = document.getElementById('username');

const statForm = document.getElementById('statForm');
statForm.addEventListener('submit', getData);
async function getData(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const platform = document.getElementById('platform').value;

    const result = await fetch('/api/get-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            platform
        })
    }).then((res) => res.json());

    if (result.status === 'ok') {
        usernameInput.value = username;

        var displayPlat;
        if (platform === 'all') displayPlat = 'All';
        else if (platform === 'keyboardMouse') displayPlat = 'Mouse/Keyboard';
        else if (platform === 'gamepad') displayPlat = 'Console';
        else displayPlat = 'Mobile'; 

        namePlatContainer.innerHTML = `<div id='namePlat'>${username} on ${displayPlat}</div>`;

        const platformSelected = document.getElementById(platform);
        platformSelected.selected = true;

        stats.innerHTML = "";
        for (mode in result.profile) {
            if (result['profile'][mode].isPlayed === true) {
                delete result['profile'][mode].isPlayed;
                delete result['profile'][mode].lastModified;
                stats.innerHTML += `<div class='bar'><div class='bar-padding'><div class='mode'>${mode[0].toUpperCase()}${mode.slice(1)}</div></div></div>`;
                var html = "<ul class='mode-list'>";
                for (stat in result['profile'][mode]) {
                    html += `<li class='stat-box'><div><div class='stat'>${stat}</div><div>${result['profile'][mode][stat]}</div></div></li>`;
                }
                html += '</ul>';
                stats.innerHTML += html;
            } else {
                stats.innerHTML += `<div class='bar'><div class='bar-padding'><div class='mode'>${mode[0].toUpperCase()}${mode.slice(1)}</div></div></div><p>There are no account stats for this mode.</p>`;
            }
        }
    } else {
        alert(result.error);
    }
}