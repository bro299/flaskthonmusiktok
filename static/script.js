document.getElementById('downloadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const videoUrl = document.getElementById('videoUrl').value;

    document.getElementById('loadingSpinner').style.display = 'block';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl }),
        });

        const data = await response.json();
        console.log(data);
        // Sembunyikan spinner loading
        document.getElementById('loadingSpinner').style.display = 'none';

        if (data.audioUrl && data.thumbnailUrl && data.title) {
            const fileName = `TikTok_Audio_${Date.now()}.mp3`;
            const isDarkTheme = document.body.classList.contains('dark-theme');
            const cardClass = isDarkTheme ? 'bg-dark text-white' : '';
            document.getElementById('result').innerHTML = `
                <div class="card mx-auto ${cardClass}" style="width: 18rem;">
                    <img src="${data.thumbnailUrl}" class="card-img-top" alt="Video Thumbnail">
                    <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <a href="${data.audioUrl}" class="btn btn-primary" download="${fileName}">Download MP3</a>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('result').textContent = 'Error: Missing video information';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Error downloading video';
    } finally {
        document.querySelector('.loading-spinner').classList.add('d-none');
    }
});

document.getElementById('pasteButton').addEventListener('click', function() {
    navigator.clipboard.readText()
        .then(text => document.getElementById('videoUrl').value = text)
        .catch(err => console.error('Failed to read clipboard contents: ', err));
});

document.getElementById('siteName').addEventListener('click', function() {
    location.reload();
});

document.getElementById('themeToggle').addEventListener('click', function() {
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const formControls = document.querySelectorAll('.form-control');

    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    
    navbar.classList.toggle('navbar-dark');
    navbar.classList.toggle('navbar-light');
    navbar.classList.toggle('bg-dark');
    navbar.classList.toggle('bg-light');

    formControls.forEach(control => {
        control.classList.toggle('dark-theme');
        control.classList.toggle('light-theme');
    });

    const icon = this.querySelector('i');
    if (body.classList.contains('dark-theme')) {
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        icon.classList.replace('fa-moon', 'fa-sun');
    }
});

const setLanguage = (lang) => {
    const translations = {
        'en': {
            pageTitle: 'TikTok Music Downloader',
            placeholder: 'Paste TikTok link here',
            pasteButton: 'Paste',
            submitButton: 'Download',
            instructionsTitle: 'How to Use the Website:',
            instructions: `
                <li>Paste the TikTok video link you want to download into the field above.</li>
                <li>Click the "Paste" button to paste the link from your clipboard.</li>
                <li>Click the "Download" button to start the download process.</li>
                <li>Wait until the download is complete and the download link appears below.</li>
                <li>Click the "Download MP3" button to save the audio file to your device.</li>
            `
        },
        'id': {
            pageTitle: 'Pengunduh Musik TikTok',
            placeholder: 'Tempel tautan TikTok di sini',
            pasteButton: 'Tempel',
            submitButton: 'Download',
            instructionsTitle: 'Cara Menggunakan Website:',
            instructions: `
                <li>Tempel tautan video TikTok yang ingin Anda unduh pada kolom di atas.</li>
                <li>Klik tombol "Tempel" untuk mem-paste tautan dari clipboard Anda.</li>
                <li>Klik tombol "Download" untuk memulai proses pengunduhan.</li>
                <li>Tunggu hingga pengunduhan selesai dan tautan unduhan muncul di bawah.</li>
                <li>Klik tombol "Download MP3" untuk menyimpan file audio ke perangkat Anda.</li>
            `
        }
    };

    document.getElementById('pageTitle').textContent = translations[lang].pageTitle;
    document.querySelector('input#videoUrl').placeholder = translations[lang].placeholder;
    document.getElementById('pasteButton').textContent = translations[lang].pasteButton;
    document.querySelector('button[type="submit"]').textContent = translations[lang].submitButton;
    document.querySelector('#instructions h5').textContent = translations[lang].instructionsTitle;
    document.getElementById('instructionList').innerHTML = translations[lang].instructions;
};

document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
document.getElementById('lang-id').addEventListener('click', () => setLanguage('id'));
