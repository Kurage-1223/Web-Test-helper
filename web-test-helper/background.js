chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Test Helper installed.');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'findAnswer') {
    const selectedText = message.selectedText;
    fetch(chrome.runtime.getURL('answers.txt'))
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        let answers = [];
        for (let line of lines) {
          if (line.includes(selectedText)) {
            let answerPart = line.split('ANSWER: ')[1];
            if (answerPart) {
              answers = answers.concat(answerPart.split(';').map(answer => answer.trim()));
            }
          }
        }
        if (answers.length > 0) {
          sendResponse({ answer: answers.join(', ') });
        } else {
          sendResponse({ answer: 'Answer not found.' });
        }
      })
      .catch(error => {
        sendResponse({ answer: 'Error: ' + error.message });
      });
    return true;
  }
});

  
  