let isPopupEnabled = true;  // 初期状態でポップアップを有効に

// キーイベントリスナーを追加して、Ctrlキーでオンオフを切り替える
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey) {
    isPopupEnabled = !isPopupEnabled;
    console.log(`Popup is now ${isPopupEnabled ? 'enabled' : 'disabled'}`);
  }
});

document.addEventListener('mouseup', () => {
  if (!isPopupEnabled) return;  // ポップアップが無効なら何もしない

  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.runtime.sendMessage({ action: 'findAnswer', selectedText: selectedText }, response => {
      if (response && response.answer) {
        showFloatingMessage(response.answer);
      }
    });
  }
});

function showFloatingMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message.replace(/, /g, '\n');  // 改行で表示するためにカンマを改行に置換
  messageDiv.style.position = 'fixed';
  messageDiv.style.color = 'black';  // 文字色を設定
  messageDiv.style.fontSize = '12px';
  messageDiv.style.whiteSpace = 'pre';  // 改行を保持するために追加
  messageDiv.style.zIndex = '9999';
  messageDiv.style.left = '20px';  // 右から20pxに設定
  messageDiv.style.bottom = '10px';  // 下から10pxに設定
  messageDiv.style.backgroundColor = 'transparent';  // 背景を透明に
  messageDiv.style.border = 'none';  // 枠なし
  messageDiv.style.boxShadow = 'none';  // 影なし
  messageDiv.style.padding = '0';  // パディングなし
  messageDiv.style.opacity = '0.2';  // 文字の透明度を設定

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    document.body.removeChild(messageDiv);
  }, 1000);  // 1秒後に消える
}



