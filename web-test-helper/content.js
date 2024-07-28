let isPopupEnabled = true;  // 初期状態でポップアップを有効に

// キーイベントリスナーを追加して、Ctrlキーでオンオフを切り替える
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey) {  // Ctrlキーが押された場合
    isPopupEnabled = !isPopupEnabled;  // ポップアップの有効/無効を切り替える
    console.log(`Popup is now ${isPopupEnabled ? 'enabled' : 'disabled'}`);  // 状態をコンソールに出力
  }
});

// マウスボタンが離されたときに実行されるイベントリスナーを追加
document.addEventListener('mouseup', () => {
  if (!isPopupEnabled) return;  // ポップアップが無効なら何もしない

  const selectedText = window.getSelection().toString().trim();  // 範囲選択されたテキストを取得
  if (selectedText) {  // 範囲選択されたテキストが存在する場合
    chrome.runtime.sendMessage({ action: 'findAnswer', selectedText: selectedText }, response => {
      if (response && response.answer) {  // 応答があり、答えが存在する場合
        showFloatingMessage(response.answer);  // 答えを表示する
      }
    });
  }
});

// ポップアップメッセージを表示する関数
function showFloatingMessage(message) {
  const messageDiv = document.createElement('div');  // 新しいdiv要素を作成
  messageDiv.textContent = message.replace(/, /g, '\n');  // カンマを改行に置換してテキストを設定
  messageDiv.style.position = 'fixed';  // 固定位置に表示
  messageDiv.style.color = 'black';  // 文字色を設定
  messageDiv.style.fontSize = '12px';  // フォントサイズを設定
  messageDiv.style.whiteSpace = 'pre';  // 改行を保持するために設定
  messageDiv.style.zIndex = '9999';  // Zインデックスを設定して最前面に表示
  messageDiv.style.left = '20px';  // 左から20pxに設定
  messageDiv.style.bottom = '10px';  // 下から10pxに設定
  messageDiv.style.backgroundColor = 'transparent';  // 背景を透明に設定
  messageDiv.style.border = 'none';  // 枠をなしに設定
  messageDiv.style.boxShadow = 'none';  // 影をなしに設定
  messageDiv.style.padding = '0';  // パディングをなしに設定
  messageDiv.style.opacity = '0.7';  // 文字の透明度を設定

  document.body.appendChild(messageDiv);  // div要素をドキュメントに追加

  setTimeout(() => {
    document.body.removeChild(messageDiv);  // 1秒後にdiv要素を削除
  }, 1000);  // 1秒後に消える
}




