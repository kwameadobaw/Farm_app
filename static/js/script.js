document.addEventListener('DOMContentLoaded', function() {
    // Form navigation
    const sections = document.querySelectorAll('.form-section');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressBar = document.getElementById('progressBar');
    const steps = document.querySelectorAll('.step');
    const farmTypeRadios = document.querySelectorAll('input[name="farm_type"]');
    const followUpRadios = document.querySelectorAll('input[name="follow_up_needed"]');
    const proposedDateGroup = document.getElementById('proposedDateGroup');
    const fileInput = document.getElementById('photo');
    const fileName = document.getElementById('file-name');
    const getLocationBtn = document.getElementById('getLocationBtn');
    const gpsCoordinatesInput = document.getElementById('gps_coordinates');
    const form = document.getElementById('farmVisitForm');

    // Initialize form
    updateProgressBar(1);
    toggleFarmTypeFields();

    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.closest('.form-section');
            const currentSectionIndex = parseInt(currentSection.id.replace('section', ''));
            const nextSectionIndex = parseInt(this.dataset.next);
            
            // Validate current section before proceeding
            if (validateSection(currentSectionIndex)) {
                // Hide current section
                currentSection.classList.add('hidden');
                
                // Show next section
                document.getElementById(`section${nextSectionIndex}`).classList.remove('hidden');
                
                // Update progress bar
                updateProgressBar(nextSectionIndex);
                
                // Scroll to top of form
                window.scrollTo({ top: form.offsetTop - 50, behavior: 'smooth' });
            }
        });
    });

    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.closest('.form-section');
            const currentSectionIndex = parseInt(currentSection.id.replace('section', ''));
            const prevSectionIndex = parseInt(this.dataset.prev);
            
            // Hide current section
            currentSection.classList.add('hidden');
            
            // Show previous section
            document.getElementById(`section${prevSectionIndex}`).classList.remove('hidden');
            
            // Update progress bar
            updateProgressBar(prevSectionIndex);
            
            // Scroll to top of form
            window.scrollTo({ top: form.offsetTop - 50, behavior: 'smooth' });
        });
    });

    // Farm type change handler
    farmTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleFarmTypeFields);
    });

    // Follow up needed change handler
    followUpRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Yes') {
                proposedDateGroup.style.display = 'block';
                document.getElementById('proposed_date').setAttribute('required', '');
            } else {
                proposedDateGroup.style.display = 'none';
                document.getElementById('proposed_date').removeAttribute('required');
            }
        });
    });

    // File input change handler
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });

    // Get location button click handler
    getLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    gpsCoordinatesInput.value = `${latitude}, ${longitude}`;
                    getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Location found';
                    getLocationBtn.classList.add('success');
                },
                function(error) {
                    console.error('Error getting location:', error);
                    getLocationBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Location error';
                    getLocationBtn.classList.add('error');
                    alert('Could not get your location. Please enter coordinates manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    // Form submit handler
    form.addEventListener('submit', function(event) {
        // Validate all sections before submitting
        let isValid = true;
        for (let i = 1; i <= 5; i++) {
            if (!validateSection(i)) {
                isValid = false;
                // Show the section with errors
                sections.forEach(section => section.classList.add('hidden'));
                document.getElementById(`section${i}`).classList.remove('hidden');
                updateProgressBar(i);
                break;
            }
        }
        
        if (!isValid) {
            event.preventDefault();
        }
    });

    // Helper functions
    function updateProgressBar(currentStep) {
        // Update progress bar width
        const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Update step indicators
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.add('active');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
    }

    function toggleFarmTypeFields() {
        const farmType = document.querySelector('input[name="farm_type"]:checked')?.value;
        const cropSections = [document.getElementById('cropSection'), document.getElementById('cropStageSection'), document.getElementById('cropIssuesSection')];
        const livestockSections = [document.getElementById('livestockSection'), document.getElementById('animalCountSection'), document.getElementById('livestockIssuesSection')];
        
        if (farmType === 'Crop') {
            cropSections.forEach(section => section.style.display = 'block');
            livestockSections.forEach(section => section.style.display = 'none');
        } else if (farmType === 'Livestock') {
            cropSections.forEach(section => section.style.display = 'none');
            livestockSections.forEach(section => section.style.display = 'block');
        } else if (farmType === 'Mixed') {
            cropSections.forEach(section => section.style.display = 'block');
            livestockSections.forEach(section => section.style.display = 'block');
        }
    }

    function validateSection(sectionIndex) {
        const section = document.getElementById(`section${sectionIndex}`);
        const requiredFields = section.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            // Reset previous error styling
            field.classList.remove('error');
            
            // Check if field is empty or unchecked
            if ((field.type === 'radio' || field.type === 'checkbox') && !section.querySelector(`[name="${field.name}"]:checked`)) {
                isValid = false;
                // Find the field group and highlight it
                const fieldGroup = field.closest('.radio-group') || field.closest('.checkbox-group');
                if (fieldGroup) fieldGroup.classList.add('error');
            } else if (field.value.trim() === '') {
                isValid = false;
                field.classList.add('error');
            }
        });
        
        return isValid;
    }
});