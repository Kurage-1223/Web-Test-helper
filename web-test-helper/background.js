// 拡張機能がインストールされたときに実行されるリスナーを追加
chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Test Helper installed.');  // インストール完了のメッセージをコンソールに出力
});

// メッセージリスナーを追加して、メッセージが受信されたときに処理を実行
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'findAnswer') {  // メッセージのアクションが 'findAnswer' の場合
    const selectedText = message.selectedText;  // メッセージから選択されたテキストを取得
    fetch(chrome.runtime.getURL('answers.txt'))  // answers.txt ファイルを取得
      .then(response => response.text())  // テキストとしてレスポンスを取得
      .then(text => {
        const lines = text.split('\n');  // ファイルの内容を行ごとに分割
        let answers = [];  // 答えを格納する配列を初期化
        for (let line of lines) {  // 各行を処理
          if (line.includes(selectedText)) {  // 行に選択されたテキストが含まれている場合
            let answerPart = line.split('ANSWER: ')[1];  // 'ANSWER: ' の後の部分を取得
            if (answerPart) {
              answers = answers.concat(answerPart.split(';').map(answer => answer.trim()));  // 答えを ';' で分割して配列に追加
            }
          }
        }
        if (answers.length > 0) {
          sendResponse({ answer: answers.join(', ') });  // 複数の答えをカンマで区切ってレスポンスを送信
        } else {
          sendResponse({ answer: 'Answer not found.' });  // 答えが見つからなかった場合のレスポンスを送信
        }
      })
      .catch(error => {
        sendResponse({ answer: 'Error: ' + error.message });  // エラーが発生した場合のレスポンスを送信
      });
    return true;  // 非同期応答を示す
  }
});


  
  