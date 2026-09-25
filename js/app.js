document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnStartClass = document.getElementById('btn-start-class');
    const btnEndClass = document.getElementById('btn-end-class');
    const setupModal = document.getElementById('setup-modal');
    const btnCancelSetup = document.getElementById('btn-cancel-setup');
    const setupForm = document.getElementById('setup-form');
    const dashboardGrid = document.getElementById('dashboard-grid');
    const studentsInputsContainer = document.getElementById('students-inputs-container');
    const btnAddStudentRow = document.getElementById('btn-add-student-row');

    // Timer Elements
    const timerContainer = document.getElementById('workout-timer-container');
    const timerDisplay = document.getElementById('workout-timer');

    // Debrief Modal Elements
    const debriefModal = document.getElementById('debrief-modal');
    const debriefGrid = document.getElementById('debrief-grid');
    const debriefTotalTime = document.getElementById('debrief-total-time');
    const debriefTotalCalories = document.getElementById('debrief-total-calories');
    const debriefTotalAthletes = document.getElementById('debrief-total-athletes');
    const btnResumeWorkout = document.getElementById('btn-resume-workout');
    const btnNewWorkout = document.getElementById('btn-new-workout');

    // State
    let students = [];
    let simulationInterval = null;
    let timerInterval = null;
    let workoutStartTime = null;
    let totalWorkoutSeconds = 0;
    let rowCounter = 0;

    // Heart Icon SVG Template
    const heartSvg = `
        <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    `;

    // Helpers
    const getZone = (bpm) => {
        // Zonas de treino HYROX (Baseado em FC Máx ~200)
        if (bpm < 100) return { id: 0, label: 'Repouso', class: 'zone-0', colorVar: 'var(--zone-0)' };
        if (bpm < 120) return { id: 1, label: 'Z1 - Aquecimento', class: 'zone-1', colorVar: 'var(--zone-1)' };
        if (bpm < 140) return { id: 2, label: 'Z2 - Leve/Base', class: 'zone-2', colorVar: 'var(--zone-2)' };
        if (bpm < 160) return { id: 3, label: 'Z3 - Moderado', class: 'zone-3', colorVar: 'var(--zone-3)' };
        if (bpm < 180) return { id: 4, label: 'Z4 - Limiar/Intenso', class: 'zone-4', colorVar: 'var(--zone-4)' };
        return { id: 5, label: 'Z5 - Esforço Máximo', class: 'zone-5', colorVar: 'var(--zone-5)' };
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => String(n).padStart(2, '0');
        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
        return `${pad(minutes)}:${pad(seconds)}`;
    };

    // Dynamic Form Rows
    const addStudentInputRow = (nameVal = '') => {
        rowCounter++;
        const currentIdx = rowCounter;

        const rowDiv = document.createElement('div');
        rowDiv.className = 'input-row input-row-student';
        rowDiv.id = `student-row-${currentIdx}`;

        rowDiv.innerHTML = `
            <input type="text" class="student-name-input" placeholder="Nome do Atleta" value="${nameVal}" required>
            <button type="button" class="btn btn-sm btn-outline btn-connect-band" style="flex: 0.5; margin-right: 10px;">🔗 Conectar BLE</button>
            <button type="button" class="btn-icon-danger btn-remove-row" title="Remover Aluno">&times;</button>
        `;

        const removeBtn = rowDiv.querySelector('.btn-remove-row');
        removeBtn.addEventListener('click', () => {
            const allRows = studentsInputsContainer.querySelectorAll('.input-row-student');
            if (allRows.length > 1) {
                rowDiv.remove();
            } else {
                rowDiv.querySelector('.student-name-input').value = '';
            }
        });
        
        const btnConnect = rowDiv.querySelector('.btn-connect-band');
        btnConnect.addEventListener('click', async () => {
            try {
                // Solicita o pareamento com dispositivo que tenha serviço de Heart Rate
                const device = await navigator.bluetooth.requestDevice({
                    filters: [{ services: ['heart_rate'] }]
                });
                
                btnConnect.textContent = 'Conectando...';
                
                const server = await device.gatt.connect();
                const service = await server.getPrimaryService('heart_rate');
                const characteristic = await service.getCharacteristic('heart_rate_measurement');
                
                await characteristic.startNotifications();
                
                btnConnect.textContent = '✅ Conectado';
                btnConnect.classList.add('btn-success');
                btnConnect.classList.remove('btn-outline');
                
                // Armazena no DOM do row para recuperarmos no submit
                rowDiv.bluetoothData = { device, characteristic };
                
            } catch (error) {
                console.error('Bluetooth error:', error);
                btnConnect.textContent = '❌ Falhou. Tentar Novamente';
            }
        });

        studentsInputsContainer.appendChild(rowDiv);
    };

    const initSetupForm = () => {
        studentsInputsContainer.innerHTML = '';
        rowCounter = 0;
        // Padrão de 3 atletas para demonstração
        addStudentInputRow('Tamara');
        addStudentInputRow('Pedro Lagarto');
        addStudentInputRow('Madson');
    };

    btnAddStudentRow.addEventListener('click', () => {
        addStudentInputRow();
    });

    // Timer Functions
    const startWorkoutTimer = () => {
        timerDisplay.textContent = formatTime(totalWorkoutSeconds);
        timerContainer.classList.remove('hidden');

        timerInterval = setInterval(() => {
            totalWorkoutSeconds++;
            timerDisplay.textContent = formatTime(totalWorkoutSeconds);
        }, 1000);
    };

    const stopWorkoutTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    };

    // Dashboard UI Updates
    const renderDashboard = () => {
        if (students.length === 0) {
            dashboardGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-logo">GAMA <span>CF</span></div>
                    <h2>Prontos para o próximo desafio?</h2>
                    <p>Aguardando o início do treinamento HYROX...</p>
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

            card.className = `student-card ${zone.class}`;
            card.querySelector('.bpm-value').textContent = student.bpm;
            card.querySelector('.zone-label').textContent = zone.label;
        });
    };

    // Simulation Engine
    const startSimulation = () => {
        if (simulationInterval) clearInterval(simulationInterval);

        simulationInterval = setInterval(() => {
            students.forEach(student => {
                if (!student.isRealBluetooth) {
                    // Realistic drift towards current target (apenas para simulação)
                    if (Math.abs(student.bpm - student.targetBpm) < 3) {
                        student.targetBpm = Math.floor(Math.random() * (195 - 90 + 1)) + 90;
                    }

                    if (student.bpm < student.targetBpm) {
                        student.bpm += Math.floor(Math.random() * 3) + 1;
                    } else if (student.bpm > student.targetBpm) {
                        student.bpm -= Math.floor(Math.random() * 3) + 1;
                    }
                }

                const currentZone = getZone(student.bpm);

                // Accumulate statistics
                student.zoneSeconds[currentZone.id] = (student.zoneSeconds[currentZone.id] || 0) + 1;
                student.maxBpm = Math.max(student.maxBpm, student.bpm);
                student.bpmSum += student.bpm;
                student.bpmCount++;

                // Caloric Burn formula: ~ (BPM * 0.075) / 60 per second for intense functional workout
                student.calories += (student.bpm * 0.075) / 60;
            });

            updateDashboardData();
        }, 1000);
    };

    // Debrief / Post-Workout Report Generator
    const renderDebriefReport = () => {
        debriefGrid.innerHTML = '';

        let groupTotalCalories = 0;

        students.forEach(student => {
            const avgBpm = Math.round(student.bpmSum / (student.bpmCount || 1));
            const maxBpm = student.maxBpm;
            const totalCals = Math.round(student.calories);
            groupTotalCalories += totalCals;

            // Find predominant zone (excluding zone 0 rest if there is active training)
            let maxSeconds = -1;
            let predominantZoneId = 3;
            for (let z = 1; z <= 5; z++) {
                const s = student.zoneSeconds[z] || 0;
                if (s > maxSeconds) {
                    maxSeconds = s;
                    predominantZoneId = z;
                }
            }
            if (maxSeconds === 0 && (student.zoneSeconds[0] || 0) > 0) {
                predominantZoneId = 0;
            }

            const predominantZone = getZone(
                predominantZoneId === 0 ? 90 :
                predominantZoneId === 1 ? 110 :
                predominantZoneId === 2 ? 130 :
                predominantZoneId === 3 ? 150 :
                predominantZoneId === 4 ? 170 : 190
            );

            // Calculate zone percentages for Apple Watch style progress bar
            const totalRecorded = student.bpmCount || 1;
            const zPct = [0, 1, 2, 3, 4, 5].map(z => {
                return ((student.zoneSeconds[z] || 0) / totalRecorded * 100).toFixed(1);
            });

            // Dynamic coach tip based on performance
            let coachTip = "🎯 Treino Consistente";
            if (predominantZoneId === 5) {
                coachTip = "🔥 Esforço Máximo Extremo";
            } else if (predominantZoneId === 4) {
                coachTip = "⚡ Alvo HYROX Atingido!";
            } else if (predominantZoneId === 3) {
                coachTip = "💪 Excelente Base Aeróbica";
            } else if (predominantZoneId <= 2) {
                coachTip = "⚠️ Pode Apertar Mais no Próximo";
            }

            const card = document.createElement('div');
            card.className = 'debrief-card';
            card.style.setProperty('--athlete-zone-color', predominantZone.colorVar);

            card.innerHTML = `
                <div class="debrief-card-header">
                    <span class="debrief-athlete-name">${student.name}</span>
                    <span class="debrief-band-tag">${student.bandId}</span>
                </div>

                <div class="debrief-stats-row">
                    <div class="stat-item">
                        <span class="stat-num">${totalCals}</span>
                        <span class="stat-lbl">Kcal</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-num">${avgBpm}</span>
                        <span class="stat-lbl">BPM Médio</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-num">${maxBpm}</span>
                        <span class="stat-lbl">BPM Pico</span>
                    </div>
                </div>

                <div class="debrief-zone-row">
                    <div class="predominant-badge">
                        <span>●</span>
                        <span>Predominante: ${predominantZone.label}</span>
                    </div>
                    <div class="coach-tip">${coachTip}</div>
                </div>

                <div class="zone-distribution-block">
                    <div class="zone-distribution-header">
                        <span>Distribuição de Zonas</span>
                        <span>% do tempo</span>
                    </div>
                    <div class="zone-progress-bar">
                        <div class="zone-segment z1" style="width: ${zPct[1]}%" title="Z1: ${zPct[1]}%"></div>
                        <div class="zone-segment z2" style="width: ${zPct[2]}%" title="Z2: ${zPct[2]}%"></div>
                        <div class="zone-segment z3" style="width: ${zPct[3]}%" title="Z3: ${zPct[3]}%"></div>
                        <div class="zone-segment z4" style="width: ${zPct[4]}%" title="Z4: ${zPct[4]}%"></div>
                        <div class="zone-segment z5" style="width: ${zPct[5]}%" title="Z5: ${zPct[5]}%"></div>
                    </div>
                    <div class="zone-legend">
                        <div class="legend-item"><span class="legend-color z1"></span> Z1: ${zPct[1]}%</div>
                        <div class="legend-item"><span class="legend-color z2"></span> Z2: ${zPct[2]}%</div>
                        <div class="legend-item"><span class="legend-color z3"></span> Z3: ${zPct[3]}%</div>
                        <div class="legend-item"><span class="legend-color z4"></span> Z4: ${zPct[4]}%</div>
                        <div class="legend-item"><span class="legend-color z5"></span> Z5: ${zPct[5]}%</div>
                    </div>
                </div>
            `;

            debriefGrid.appendChild(card);
        });

        // Top summary metrics
        debriefTotalTime.textContent = formatTime(totalWorkoutSeconds);
        debriefTotalCalories.textContent = `${groupTotalCalories} kcal`;
        debriefTotalAthletes.textContent = `${students.length} atletas`;

        debriefModal.classList.remove('hidden');
    };

    // Event Listeners
    btnStartClass.addEventListener('click', () => {
        if (studentsInputsContainer.children.length === 0) {
            initSetupForm();
        }
        setupModal.classList.remove('hidden');
    });

    btnCancelSetup.addEventListener('click', () => {
        setupModal.classList.add('hidden');
    });

    setupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputRows = studentsInputsContainer.querySelectorAll('.input-row-student');
        students = [];
        let validIdx = 1;

        inputRows.forEach(row => {
            const name = row.querySelector('.student-name-input').value.trim();
            if (name !== '') {
                const startBpm = Math.floor(Math.random() * 25) + 85;
                const studentData = {
                    id: validIdx,
                    name: name,
                    bandId: row.bluetoothData ? 'Pulseira Real BLE' : `Simulada #${validIdx}`,
                    bpm: startBpm, // será sobrescrito pelo BLE assim que o primeiro pulso chegar
                    targetBpm: startBpm + 40,
                    maxBpm: startBpm,
                    bpmSum: startBpm,
                    bpmCount: 1,
                    zoneSeconds: [0, 0, 0, 0, 0, 0],
                    calories: 0,
                    isRealBluetooth: !!row.bluetoothData,
                    bluetoothCharacteristic: row.bluetoothData ? row.bluetoothData.characteristic : null
                };

                if (studentData.isRealBluetooth) {
                    studentData.bluetoothCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
                        const value = event.target.value;
                        const flags = value.getUint8(0);
                        const rate16Bits = flags & 0x1;
                        let currentBpm = 0;
                        
                        if (rate16Bits) {
                            currentBpm = value.getUint16(1, true);
                        } else {
                            currentBpm = value.getUint8(1);
                        }
                        
                        // Encontra o atleta no estado atual e atualiza
                        const studentObj = students.find(s => s.id === studentData.id);
                        if (studentObj) {
                            studentObj.bpm = currentBpm;
                        }
                    });
                }

                students.push(studentData);
                validIdx++;
            }
        });

        if (students.length > 0) {
            totalWorkoutSeconds = 0;
            setupModal.classList.add('hidden');
            btnStartClass.classList.add('hidden');
            btnEndClass.classList.remove('hidden');

            renderDashboard();
            startWorkoutTimer();
            startSimulation();
        } else {
            alert('Por favor, informe o nome de pelo menos um atleta.');
        }
    });

    btnEndClass.addEventListener('click', () => {
        // Pause simulation and timer, and open Debrief
        if (simulationInterval) clearInterval(simulationInterval);
        stopWorkoutTimer();
        renderDebriefReport();
    });

    btnResumeWorkout.addEventListener('click', () => {
        // Closes debrief and resumes workout
        debriefModal.classList.add('hidden');
        startWorkoutTimer();
        startSimulation();
    });

    btnNewWorkout.addEventListener('click', () => {
        if (simulationInterval) clearInterval(simulationInterval);
        stopWorkoutTimer();

        students = [];
        totalWorkoutSeconds = 0;
        timerDisplay.textContent = '00:00:00';
        timerContainer.classList.add('hidden');

        debriefModal.classList.add('hidden');
        btnEndClass.classList.add('hidden');
        btnStartClass.classList.remove('hidden');

        renderDashboard();
        initSetupForm();
    });

    // Initialize with default state
    initSetupForm();
});
