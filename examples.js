// examples.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load questions from JSONL file
        const response = await fetch('questions.jsonl');
        const text = await response.text();
        const questions = text
            .trim()
            .split('\n')
            .map(line => JSON.parse(line));

        const container = document.getElementById('examples-container');

        // Create cards for ALL questions (no filtering or trimming)
        questions.forEach((question, index) => {
            const card = createExampleCard(question, index);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading examples:', error);
        document.getElementById('examples-container').innerHTML =
            '<p class="error">Failed to load examples. Please try again later.</p>';
    }
});

function createExampleCard(question, index) {
    const card = document.createElement('div');
    card.className = 'example-card';

    // Use the hopType field from the data
    const questionType = question.hopType || 'Single-hop';

    card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${question.descriptionEn}</h3>
      <div class="card-badges">
        <span class="badge badge-${question.type.toLowerCase()}">${question.type}</span>
        <span class="badge badge-${questionType.toLowerCase().replace('-', '-')}">${questionType}</span>
      </div>
    </div>
    
    <div class="card-body">
      <audio controls class="audio-player">
        <source src="${question.audioPath}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      
      <div class="cultural-context">
        <h4>Cultural Context:</h4>
        <p>${getCulturalContext(question)}</p>
      </div>
      
      <div class="question-preview">
        <h4>Sample Question:</h4>
        <p><strong>Q:</strong> ${question.questionEn}</p>
        <div class="options-preview">
          ${question.optionsEn.map((opt, i) =>
        `<span class="option ${question.answer === String.fromCharCode(65 + i) ? 'correct-answer' : ''}" data-option="${String.fromCharCode(65 + i)}">${String.fromCharCode(65 + i)}. ${opt}</span>`
    ).join('')}
        </div>
        <div class="answer-section">
          <button class="show-answer-btn" onclick="toggleAnswer(this)">Show Answer</button>
          <div class="answer-reveal" style="display: none;">
            <p><strong>Correct Answer:</strong> ${question.answer}. ${question.optionsEn[question.answer.charCodeAt(0) - 65]}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <a href="https://huggingface.co/datasets/chenjoachim/TAU-Benchmark" class="card-link">Full Dataset and Download →</a>
    </div>
  `;

    return card;
}



function getCulturalContext(question) {
    // Generate cultural context based on the question type and description
    const contexts = {
        'Transit': 'This sound is part of Taiwan\'s public transportation system, reflecting the country\'s efficient and culturally integrated transit infrastructure.',
        'Retail': 'Common in Taiwan\'s convenience stores and retail environments, representing the unique shopping culture and customer service practices.',
        'Media': 'Typical of Taiwanese media and entertainment content, showcasing local broadcasting and cultural communication styles.',
        'Emergency': 'Part of Taiwan\'s public safety and emergency alert systems, designed for the local population\'s safety and awareness.',
        'default': 'This audio represents a culturally specific sound environment commonly encountered in Taiwan.'
    };

    return contexts[question.type] || contexts['default'];
}

// Function to toggle answer visibility
function toggleAnswer(button) {
    const answerReveal = button.nextElementSibling;
    const isHidden = answerReveal.style.display === 'none';

    if (isHidden) {
        answerReveal.style.display = 'block';
        button.textContent = 'Hide Answer';
        button.classList.add('answer-shown');

        // Highlight the correct answer
        const card = button.closest('.example-card');
        const correctOptions = card.querySelectorAll('.correct-answer');
        correctOptions.forEach(option => {
            option.style.backgroundColor = '#d1fae5';
            option.style.color = '#065f46';
            option.style.fontWeight = '600';
        });
    } else {
        answerReveal.style.display = 'none';
        button.textContent = 'Show Answer';
        button.classList.remove('answer-shown');

        // Remove highlight
        const card = button.closest('.example-card');
        const allOptions = card.querySelectorAll('.option');
        allOptions.forEach(option => {
            option.style.backgroundColor = '';
            option.style.color = '';
            option.style.fontWeight = '';
        });
    }
}