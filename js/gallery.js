document.addEventListener('DOMContentLoaded', function() {
   
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalBg = document.querySelector('.modal-bg');
    const closeButton = document.getElementById('modal-close');
    
    // 全てのギャラリーアイテムのラッパー要素を取得
    const galleryItems = document.querySelectorAll('.gallery-item'); 

    // モーダルを非表示にする関数
    function closeModal() {
        
        // 1. 全ての画像から拡大クラスを削除
        galleryItems.forEach(item => {
            item.classList.remove('is-scaled');
        });

        // 2. bodyにリセットクラスを追加し、アニメーションを強制的に解除
        document.body.classList.add('reset-hover');

        // 3. モーダルを非表示
        modal.classList.remove('is-active');

        // 4. スクロール許可
        document.body.style.overflow = ''; 
        
        // 5. 短時間後にリセットクラスを削除し、再拡大を防ぐ
        setTimeout(() => {
            document.body.classList.remove('reset-hover');
        }, 10); 
    }

    // タッチデバイスの判定
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    
    const observerOptions = {
        root: null, 
        rootMargin: '0px 0px -10% 0px', 
        threshold: 0.01 
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面に入ったら is-visible クラスを付与し、じわっと拡大アニメーションを再生
                entry.target.classList.add('is-visible');
                // 一度アニメーションが実行されたら監視を停止
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    galleryItems.forEach(item => {
        const img = item.querySelector('img'); 
        
        scrollObserver.observe(img);

        // --- PC（非タッチデバイス）でのみホバーの動きを有効にする ---
        if (!isTouchDevice) {
            // PCでのみ拡大（ホバー）効果を有効にする
            item.addEventListener('mouseenter', () => item.classList.add('is-scaled'));
            item.addEventListener('mouseleave', () => item.classList.remove('is-scaled'));
        }

        // --- PC/モバイル共通：クリック/タップでモーダルを開く ---
        item.addEventListener('click', function(e) {
             e.preventDefault(); 
             
             // モーダルが開いている場合は何もしない
             if (modal.classList.contains('is-active')) return;

             // 1. 画像のURLを取得
             const imageUrl = img.getAttribute('src');

             // 2. モーダル内の拡大画像にURLを設定
             modalImage.setAttribute('src', imageUrl);

             // 3. ぼかした背景にURLを設定
             modalBg.style.backgroundImage = `url('${imageUrl}')`;

             // 4. モーダルを表示
             modal.classList.add('is-active');

             // スクロール防止
             document.body.style.overflow = 'hidden';
        });
    });

    // モーダルの閉じるイベント（PC/モバイル共通）
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target === modalBg) {
            closeModal();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });

    // 👇 既存のスクロール時に拡大状態を解除する処理（Debounce処理）を維持
    let scrollTimeout;
    
    document.addEventListener('scroll', function() {
        
        if (modal.classList.contains('is-active')) return;

        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(function() {
            galleryItems.forEach(item => {
                if (item.classList.contains('is-scaled')) {
                    item.classList.remove('is-scaled');
                }
            });
        }, 150);
    }, { passive: true });
});