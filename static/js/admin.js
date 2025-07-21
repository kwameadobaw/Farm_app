document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const visitTypeFilter = document.getElementById('visitTypeFilter');
    const visitsContainer = document.getElementById('visitsContainer');
    const visitCards = document.querySelectorAll('.visit-card');

    // Add event listeners
    searchInput.addEventListener('input', filterVisits);
    visitTypeFilter.addEventListener('change', filterVisits);

    // Function to toggle details view
    window.toggleDetails = function(detailsId) {
        const detailsElement = document.getElementById(detailsId);
        if (detailsElement.style.display === 'block') {
            detailsElement.style.display = 'none';
        } else {
            // Hide all other expanded details
            document.querySelectorAll('.visit-details-expanded').forEach(el => {
                el.style.display = 'none';
            });
            // Show this one
            detailsElement.style.display = 'block';
        }
    };

    // Function to filter visits based on search input and visit type
    function filterVisits() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedVisitType = visitTypeFilter.value;
        let visibleCount = 0;

        visitCards.forEach(card => {
            const farmerName = card.querySelector('h3').textContent.toLowerCase();
            const farmId = card.querySelector('p:nth-child(1)').textContent.toLowerCase();
            const visitType = card.dataset.visitType;
            
            // Check if card matches both search term and visit type filter
            const matchesSearch = farmerName.includes(searchTerm) || farmId.includes(searchTerm);
            const matchesType = selectedVisitType === '' || visitType === selectedVisitType;
            
            if (matchesSearch && matchesType) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show no results message if no visits match
        if (visibleCount === 0 && visitCards.length > 0) {
            let noResultsElement = document.getElementById('noResultsMessage');
            if (!noResultsElement) {
                noResultsElement = document.createElement('div');
                noResultsElement.id = 'noResultsMessage';
                noResultsElement.className = 'no-visits';
                noResultsElement.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No visits match your search criteria.</p>
                    <button class="btn-primary" onclick="clearFilters()"><i class="fas fa-times"></i> Clear Filters</button>
                `;
                visitsContainer.appendChild(noResultsElement);
            }
        } else {
            const noResultsElement = document.getElementById('noResultsMessage');
            if (noResultsElement) {
                noResultsElement.remove();
            }
        }
    }

    // Function to clear filters
    window.clearFilters = function() {
        searchInput.value = '';
        visitTypeFilter.value = '';
        filterVisits();
    };
});