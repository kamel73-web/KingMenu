// Improved OAuth hash handling with a delay before reload

const RELOAD_DELAY_MS = 3000; // 3 seconds delay

function handleOAuth() {
    // Existing hash handling logic...

    // Adding a delay before reload
    setTimeout(() => {
        window.location.reload();
    }, RELOAD_DELAY_MS);
}