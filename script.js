// script.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1. 載入 JSONL 並解析成陣列
  const res = await fetch('questions.jsonl');
  const text = await res.text();
  const questions = text
    .trim()
    .split('\n')
    .map(line => JSON.parse(line));

  const container = document.getElementById('quiz-container');

  questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    // Title: 1-based index – 類型
    const title = document.createElement('h2');
    title.textContent = `${index + 1} - ${q.type}`;
    card.appendChild(title);

    // Audio element
    const audio = document.createElement('audio');
    audio.id = `audio-${q.uniqueId}`;
    audio.src = q.audioPath;
    audio.preload = 'metadata';
    card.appendChild(audio);

    // Buttons
    const btns = document.createElement('div');
    btns.className = 'buttons';

    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play Audio';
    playBtn.className = 'play';
    playBtn.addEventListener('click', () => {
      audio.currentTime = q.startMs / 1000;
      audio.play();
      setTimeout(() => audio.pause(), q.endMs - q.startMs);
    });
    btns.appendChild(playBtn);

    const pauseBtn = document.createElement('button');
    pauseBtn.textContent = 'Pause Audio';
    pauseBtn.className = 'pause';
    pauseBtn.addEventListener('click', () => audio.pause());
    btns.appendChild(pauseBtn);

    const answerBtn = document.createElement('button');
    answerBtn.textContent = 'Show Answer';
    answerBtn.className = 'answer';
    btns.appendChild(answerBtn);

    card.appendChild(btns);

    // 問題與選項
    const qCn = document.createElement('p');
    qCn.textContent = q.questionCn;
    card.appendChild(qCn);

    const qEn = document.createElement('p');
    qEn.textContent = q.questionEn;
    card.appendChild(qEn);

    const opts = document.createElement('div');
    opts.className = 'options';
    q.optionsCn.forEach((opt, i) => {
      const p = document.createElement('p');
      p.className = 'option';
      p.textContent = `${String.fromCharCode(65 + i)}. ${opt} / ${q.optionsEn[i]}`;
      opts.appendChild(p);
    });
    card.appendChild(opts);

    // 答案
    const ans = document.createElement('div');
    ans.className = 'answer-text';
    ans.textContent = `Answer: ${q.answer}`;
    ans.style.display = 'none';
    card.appendChild(ans);

    answerBtn.addEventListener('click', () => {
      ans.style.display = ans.style.display === 'none' ? 'block' : 'none';
    });

    container.appendChild(card);
  });
});
