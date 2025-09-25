// leaderboard.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('model-search');
    const table = document.getElementById('leaderboard');
    const tbody = document.getElementById('leaderboard-body');

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

            sortTable(column, currentSort.direction);
        });
    });

    function sortTable(column, direction) {
        // Get all rows except the human baseline
        const rows = Array.from(tbody.querySelectorAll('tr:not(.human-baseline-row)'));

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