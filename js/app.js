document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnStartClass = document.getElementById('btn-start-class');
    const btnEndClass = document.getElementById('btn-end-class');
    const setupModal = document.getElementById('setup-modal');
    const btnCancelSetup = document.getElementById('btn-cancel-setup');
    const setupForm = document.getElementById('setup-form');
    const dashboardGrid = document.getElementById('dashboard-grid');

    // State
    let students = [];
    let simulationInterval = null;

    // Heart Icon SVG Template
    const heartSvg = `
        <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    `;

    // Helpers
    const getZone = (bpm) => {
        // Simplified zones based on approx Max HR 200
        if (bpm < 100) return { id: 0, label: 'Repouso', class: 'zone-0' };
        if (bpm < 120) return { id: 1, label: 'Aquecimento', class: 'zone-1' };
        if (bpm < 140) return { id: 2, label: 'Queima de Gordura', class: 'zone-2' };
        if (bpm < 160) return { id: 3, label: 'Aeróbico', class: 'zone-3' };
        if (bpm < 180) return { id: 4, label: 'Anaeróbico', class: 'zone-4' };
        return { id: 5, label: 'Esforço Máximo', class: 'zone-5' };
    };

    // UI Updates
    const renderDashboard = () => {
        if (students.length === 0) {
            dashboardGrid.innerHTML = `
                <div class="empty-state">
                    <p>Nenhuma aula em andamento.</p>
                    <p>Clique em <strong>Iniciar Aula</strong> para adicionar alunos.</p>
                </div>
            `;
            return;
        }

        dashboardGrid.innerHTML = '';
        
        students.forEach(student => {
            const zone = getZone(student.bpm);
            
            const card = document.createElement('div');
            card.className = `student-card ${zone.class}`;
            card.id = `student-${student.id}`;
            
            card.innerHTML = `
                ${heartSvg}
                <div class="student-name">${student.name}</div>
                <div class="hr-display">
                    <span class="bpm-value">${student.bpm}</span>
                    <span class="bpm-label">bpm</span>
                </div>
                <div class="zone-label">${zone.label}</div>
            `;
            
            dashboardGrid.appendChild(card);
        });
    };

    const updateDashboardData = () => {
        students.forEach(student => {
            const card = document.getElementById(`student-${student.id}`);
            if (!card) return;

            const zone = getZone(student.bpm);
            
            // Update classes for color changes
            card.className = `student-card ${zone.class}`;
            
            // Update values
            card.querySelector('.bpm-value').textContent = student.bpm;
            card.querySelector('.zone-label').textContent = zone.label;
        });
    };

    // Simulation Engine
    const startSimulation = () => {
        if (simulationInterval) clearInterval(simulationInterval);
        
        simulationInterval = setInterval(() => {
            students.forEach(student => {
                // To make it look realistic, we drift towards the target
                if (Math.abs(student.bpm - student.targetBpm) < 3) {
                    // Pick a new target if close
                    // Random target between 90 and 195
                    student.targetBpm = Math.floor(Math.random() * (195 - 90 + 1)) + 90;
                }
                
                // Move current BPM towards target
                if (student.bpm < student.targetBpm) {
                    student.bpm += Math.floor(Math.random() * 3) + 1;
                } else if (student.bpm > student.targetBpm) {
                    student.bpm -= Math.floor(Math.random() * 3) + 1;
                }
            });
            
            updateDashboardData();
        }, 1000); // Update every second
    };

    // Event Listeners
    btnStartClass.addEventListener('click', () => {
        setupModal.classList.remove('hidden');
    });

    btnCancelSetup.addEventListener('click', () => {
        setupModal.classList.add('hidden');
    });

    setupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        students = [];
        
        for (let i = 1; i <= 3; i++) {
            const nameInput = document.getElementById(`student-${i}-name`).value;
            if (nameInput.trim() !== '') {
                // Initialize with random starting values
                const startBpm = Math.floor(Math.random() * 20) + 80;
                students.push({
                    id: i,
                    name: nameInput,
                    bpm: startBpm,
                    targetBpm: startBpm + 40,
                    bandId: `Band ${i}`
                });
            }
        }

        if (students.length > 0) {
            setupModal.classList.add('hidden');
            btnStartClass.classList.add('hidden');
            btnEndClass.classList.remove('hidden');
            renderDashboard();
            startSimulation();
        } else {
            alert("Adicione pelo menos um aluno para começar a aula.");
        }
    });

    btnEndClass.addEventListener('click', () => {
        if(confirm("Tem certeza que deseja encerrar a aula atual?")) {
            clearInterval(simulationInterval);
            students = [];
            
            // Reset form
            setupForm.reset();
            
            renderDashboard();
            btnEndClass.classList.add('hidden');
            btnStartClass.classList.remove('hidden');
        }
    });
});
