
window.addEventListener('load', () => {
    // ローディング画面を少し見せるため、1000ミリ秒（1秒）待機
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('loaded');
        }
    }, 1000); 
});