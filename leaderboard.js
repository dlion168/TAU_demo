// leaderboard.js
document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('model-search');
    const table = document.getElementById('leaderboard');
    const tbody = document.getElementById('leaderboard-body');

    // Load submissions data
    let submissions = [];
    try {
        const response = await fetch('submissions.jsonl');
        const text = await response.text();
        submissions = text
            .trim()
            .split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line));

        // Add random baseline
        submissions.push({
            model_name: "Random Baseline",
            model_org: "Baseline",
            params: null,
            single_accuracy: 0.25,
            multi_accuracy: 0.25,
            submission_date: "2024-09-01"
        });
    } catch (error) {
        console.error('Error loading submissions:', error);
    }

    // Initialize leaderboard
    populateLeaderboard(submissions);

    // Function to populate leaderboard table
    function populateLeaderboard(data) {
        // Keep the human baseline row (it should already be in HTML)
        const humanBaselineRow = tbody.querySelector('.human-baseline-row');

        // Clear all other rows
        const modelRows = tbody.querySelectorAll('tr:not(.human-baseline-row)');
        modelRows.forEach(row => row.remove());

        // Create rows for each submission
        data.forEach((submission, index) => {
            const row = createSubmissionRow(submission, index + 1);
            tbody.appendChild(row);
        });
    }

    // Function to create a submission row
    function createSubmissionRow(submission, rank) {
        const row = document.createElement('tr');

        const singlePercent = (submission.single_accuracy * 100).toFixed(1);
        const multiPercent = (submission.multi_accuracy * 100).toFixed(1);
        const paramsDisplay = submission.params === null || submission.params === undefined ?
            '-' :
            submission.params >= 1000 ?
                (submission.params / 1000).toFixed(1).replace('.0', '') + 'k' :
                submission.params;

        row.innerHTML = `
            <td>${rank}</td>
            <td class="model-cell">
                <div class="model-info">
                    <span class="model-name">${submission.model_name}</span>
                    <span class="model-org">${submission.model_org}</span>
                </div>
            </td>
            <td>${paramsDisplay}</td>
            <td class="accuracy-cell">
                <span class="accuracy-value">${singlePercent}%</span>
                <div class="accuracy-bar">
                    <div class="accuracy-fill" style="width: ${singlePercent}%"></div>
                </div>
            </td>
            <td class="accuracy-cell">
                <span class="accuracy-value">${multiPercent}%</span>
                <div class="accuracy-bar">
                    <div class="accuracy-fill" style="width: ${multiPercent}%"></div>
                </div>
            </td>
            <td>${submission.submission_date}</td>
        `;

        return row;
    }

    // Search functionality (excludes human baseline)
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = tbody.querySelectorAll('tr:not(.human-baseline-row)');

        rows.forEach(row => {
            const modelName = row.querySelector('.model-name').textContent.toLowerCase();
            const modelOrg = row.querySelector('.model-org').textContent.toLowerCase();

            if (modelName.includes(searchTerm) || modelOrg.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Sorting functionality
    const sortableHeaders = document.querySelectorAll('.sortable');
    let currentSort = { column: null, direction: 'asc' };

    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');

            // Toggle sort direction if clicking same column
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.direction = 'asc';
            }

            currentSort.column = column;

            // Update header indicators
            sortableHeaders.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
            header.classList.add(`sort-${currentSort.direction}`);

            sortSubmissions(column, currentSort.direction);
        });
    });

    function sortSubmissions(column, direction) {
        let sortedSubmissions = [...submissions];

        // Sort based on column
        sortedSubmissions.sort((a, b) => {
            let aVal, bVal;

            switch (column) {
                case 'model':
                    aVal = a.model_name.toLowerCase();
                    bVal = b.model_name.toLowerCase();
                    break;
                case 'params':
                    aVal = a.params || 0;
                    bVal = b.params || 0;
                    break;
                case 'single-hop':
                    aVal = a.single_accuracy;
                    bVal = b.single_accuracy;
                    break;
                case 'multi-hop':
                    aVal = a.multi_accuracy;
                    bVal = b.multi_accuracy;
                    break;
                case 'submission-date':
                    aVal = new Date(a.submission_date);
                    bVal = new Date(b.submission_date);
                    break;
                default:
                    return 0;
            }

            if (direction === 'asc') {
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            } else {
                return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            }
        });

        // Re-populate with sorted data
        populateLeaderboard(sortedSubmissions);
    }

    // Legacy function kept for compatibility (now redirects to sortSubmissions)
    function sortTable(column, direction) {
        sortSubmissions(column, direction);

        rows.sort((a, b) => {
            let aVal, bVal;

            switch (column) {
                case 'rank':
                    aVal = parseInt(a.cells[0].textContent);
                    bVal = parseInt(b.cells[0].textContent);
                    break;
                case 'model':
                    aVal = a.querySelector('.model-name').textContent.toLowerCase();
                    bVal = b.querySelector('.model-name').textContent.toLowerCase();
                    break;
                case 'params':
                    aVal = parseFloat(a.cells[2].textContent) || 0;
                    bVal = parseFloat(b.cells[2].textContent) || 0;
                    break;
                case 'single-hop':
                    aVal = parseFloat(a.cells[3].querySelector('.accuracy-value').textContent);
                    bVal = parseFloat(b.cells[3].querySelector('.accuracy-value').textContent);
                    break;
                case 'multi-hop':
                    aVal = parseFloat(a.cells[4].querySelector('.accuracy-value').textContent);
                    bVal = parseFloat(b.cells[4].querySelector('.accuracy-value').textContent);
                    break;
                case 'submission-date':
                    aVal = new Date(a.cells[5].textContent);
                    bVal = new Date(b.cells[5].textContent);
                    break;
                default:
                    return 0;
            }

            if (direction === 'asc') {
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            } else {
                return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            }
        });

        // Get the human baseline row to keep it at top
        const humanBaselineRow = tbody.querySelector('.human-baseline-row');

        // Update rank numbers after sorting and append after human baseline
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });

        // Rebuild table with human baseline first, then sorted rows
        tbody.innerHTML = '';
        tbody.appendChild(humanBaselineRow);
        rows.forEach(row => tbody.appendChild(row));
    }

    // Add hover effects and animations (excluding human baseline)
    const tableRows = tbody.querySelectorAll('tr:not(.human-baseline-row)');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'var(--hover-bg, #f8f9fa)';
        });

        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });
});