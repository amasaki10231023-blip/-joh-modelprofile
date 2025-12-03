window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('loaded');
        }
    }, 1000); 
});