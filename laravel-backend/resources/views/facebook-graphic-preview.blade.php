
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>LankaPulse AI - Live Graphic Studio</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 30px;
            min-height: 100vh;
            background: #080f1e;
            color: white;
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 1200px;
            margin: auto;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }

        .brand {
            font-size: 24px;
            font-weight: 900;
        }

        .brand span {
            color: #22d3ee;
        }

        .status {
            color: #4ade80;
            font-size: 13px;
        }

        .layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 380px;
            gap: 25px;
            align-items: start;
        }

        .preview,
        .info {
            padding: 22px;
            background: #111c30;
            border-radius: 16px;
        }

        .preview {
            text-align: center;
        }

        .poster {
            display: block;
            width: 100%;
            max-width: 540px;
            height: auto;
            margin: auto;
            border-radius: 8px;
            background: #080f1e;
        }

        .info h3 {
            margin-top: 15px;
        }

        .info p {
            color: #aab7cb;
            font-size: 14px;
            line-height: 1.7;
            overflow-wrap: anywhere;
        }

        .badge {
            display: inline-block;
            padding: 7px 12px;
            background: #123b32;
            color: #4ade80;
            border-radius: 20px;
            font-size: 12px;
        }

        .refresh-button {
            margin-top: 10px;
            padding: 11px 17px;
            border: 0;
            border-radius: 8px;
            background: #0891b2;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        .refresh-button:hover {
            background: #0e7490;
        }

        @media (max-width: 850px) {
            body {
                padding: 15px;
            }

            .layout {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>

<div class="container">

    <div class="topbar">
        <div class="brand">
            LankaPulse <span>AI</span>
        </div>

        <div class="status" id="status">
            ● Connecting to preview...
        </div>
    </div>

    <div class="layout">

        <div class="preview">

            <img
                id="poster"
                class="poster"
                src="{{ route('facebook.preview.image') }}"
                alt="Facebook poster preview"
            >

        </div>

        <div class="info">

            <span class="badge">LOCAL DEVELOPMENT MODE</span>

            <h3>Facebook Graphic Studio</h3>

            <p>
                <strong>Test Article ID:</strong><br>
                {{ $article->id }}
            </p>

            <p>
                <strong>English headline:</strong><br>
                {{ $article->title }}
            </p>

            <p>
                <strong>Sinhala headline:</strong><br>
                {{ $article->title_si }}
            </p>

            <p>
                <strong>Source:</strong><br>
                {{ $article->source_name }}
            </p>

            <p>
                <strong>Preview size:</strong><br>
                1080 × 1350 pixels
            </p>

            <p>
                <strong>Auto refresh:</strong><br>
                Checks generator changes every second.
            </p>

            <p id="last-update">
                Initializing preview...
            </p>

            <button
                class="refresh-button"
                onclick="refreshPoster()"
            >
                Refresh poster now
            </button>

        </div>

    </div>

</div>

<script>
   
const versionUrl = @json(route('facebook.preview.version'));
const imageUrl = @json(route('facebook.preview.image'));

const poster = document.getElementById('poster');
const status = document.getElementById('status');
const lastUpdate = document.getElementById('last-update');

let currentVersion = null;
let checking = false;
let generating = false;

function refreshPoster() {
    if (generating) return;

    generating = true;
    status.textContent = '● Regenerating poster...';

    const image = new Image();

    image.onload = () => {
        poster.src = image.src;

        status.textContent = '● Live preview active';
        lastUpdate.textContent =
            'Last updated: ' + new Date().toLocaleTimeString();

        generating = false;
    };

    image.onerror = () => {
        status.textContent = '● Poster generation failed';
        lastUpdate.textContent =
            'Check storage/logs/laravel.log';

        generating = false;
    };

    image.src = imageUrl + '?t=' + Date.now();
}

async function checkForChanges() {
    if (checking || generating) return;

    checking = true;

    try {
        const response = await fetch(
            versionUrl + '?t=' + Date.now(),
            { cache: 'no-store' }
        );

        if (!response.ok) {
            throw new Error('Version check failed');
        }

        const data = await response.json();

        if (
            currentVersion !== null &&
            data.version !== currentVersion
        ) {
            currentVersion = data.version;
            refreshPoster();
        } else if (currentVersion === null) {
            currentVersion = data.version;
        }

    } catch (error) {
        status.textContent = '● Preview connection error';
        console.error(error);

    } finally {
        checking = false;
    }
}

async function initializePreview() {
    try {
        const response = await fetch(
            versionUrl + '?t=' + Date.now(),
            { cache: 'no-store' }
        );

        if (!response.ok) {
            throw new Error('Unable to initialize preview');
        }

        const data = await response.json();

        currentVersion = data.version;

        status.textContent = '● Live preview active';

        lastUpdate.textContent =
            'Preview initialized: ' + new Date().toLocaleTimeString();

    } catch (error) {
        status.textContent = '● Unable to initialize preview';
        console.error(error);
    }
}

initializePreview().then(() => {
    setInterval(checkForChanges, 1000);
});

</script>

</body>
</html>
