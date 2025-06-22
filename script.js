 // Global state for theme
        let currentTheme = {
            mode: 'light', // 'light' or 'dark'
            primaryColor: 'blue', // 'blue', 'green', 'purple', 'red'
        };

        // Utility function to get CSS classes based on current theme and color
        function getClasses(type, color = currentTheme.primaryColor) {
            const mode = currentTheme.mode;
            const primaryColor = color;

            const primaryMap = {
                'blue': {
                    'bg': 'bg-blue-500', 'text': 'text-blue-500', 'border': 'border-blue-500',
                    'light-bg': 'bg-blue-100', 'light-text': 'text-blue-800', 'light-border': 'border-blue-200',
                    'gradient': 'gradient-blue', 'rgb': '60,126,245' /* RGB for blue-500 */
                },
                'green': {
                    'bg': 'bg-green-500', 'text': 'text-green-500', 'border': 'border-green-500',
                    'light-bg': 'bg-green-100', 'light-text': 'text-green-800', 'light-border': 'border-green-200',
                    'gradient': 'gradient-green', 'rgb': '34,197,94' /* RGB for green-500 */
                },
                'purple': {
                    'bg': 'bg-purple-500', 'text': 'text-purple-500', 'border': 'border-purple-500',
                    'light-bg': 'bg-purple-100', 'light-text': 'text-purple-800', 'light-border': 'border-purple-200',
                    'gradient': 'gradient-purple', 'rgb': '168,85,247' /* RGB for purple-500 */
                },
                'red': {
                    'bg': 'bg-red-500', 'text': 'text-red-500', 'border': 'border-red-500',
                    'light-bg': 'bg-red-100', 'light-text': 'text-red-800', 'light-border': 'border-red-200',
                    'gradient': 'gradient-red', 'rgb': '239,68,68' /* RGB for red-500 */
                },
            };

            switch (type) {
                case 'bg': return primaryMap[primaryColor]['bg'];
                case 'text': return primaryMap[primaryColor]['text'];
                case 'border': return primaryMap[primaryColor]['border'];
                case 'light-bg': return primaryMap[primaryColor]['light-bg'];
                case 'light-text': return primaryMap[primaryColor]['light-text'];
                case 'light-border': return primaryMap[primaryColor]['light-border'];
                case 'gradient': return primaryMap[primaryColor]['gradient'];
                case 'rgb': return primaryMap[primaryColor]['rgb'];
                default: return '';
            }
        }

        // --- Theme Management ---
        const body = document.body;
        const themeToggleButton = document.getElementById('theme-toggle-button');
        const colorPicker = document.querySelector('.color-picker');
        const dashboardTitle = document.getElementById('dashboard-title');
        const dashboardSubtitle = document.getElementById('dashboard-subtitle');

        function applyTheme() {
            // Apply mode classes to body
            body.classList.remove('light-theme', 'dark-theme');
            body.classList.add(`${currentTheme.mode}-theme`);

            // Update header title color
            dashboardTitle.classList.remove(...Object.values(Object.values(getClasses('gradient', 'blue')).map(c => `gradient-${c.split('-')[1]}`))); // Remove all previous gradients
            dashboardTitle.classList.remove('text-white'); // Remove dark theme specific text color
            if (currentTheme.mode === 'dark') {
                dashboardTitle.classList.add('text-white');
            } else {
                dashboardTitle.classList.add(getClasses('gradient'));
            }

            // Update subtitle color
            dashboardSubtitle.classList.remove('text-gray-300', 'text-gray-600');
            dashboardSubtitle.classList.add(currentTheme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600');


            // Update theme toggle button text
            themeToggleButton.textContent = currentTheme.mode === 'light' ? '☀️ Light' : '🌙 Dark';
            themeToggleButton.classList.remove('bg-gray-700', 'text-white', 'bg-gray-200', 'text-gray-800');
            themeToggleButton.classList.add(
                currentTheme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200',
                currentTheme.mode === 'dark' ? 'text-white' : 'text-gray-800'
            );

            // Update color picker buttons
            document.querySelectorAll('.color-picker button').forEach(btn => {
                btn.classList.remove('selected');
                if (btn.dataset.color === currentTheme.primaryColor) {
                    btn.classList.add('selected');
                }
            });

            // Update all elements with dynamic colors
            updateDynamicColors();
        }

        function updateDynamicColors() {
            // Update root CSS variable for ring color calculation
            document.documentElement.style.setProperty('--primary-color-500-rgb', getClasses('rgb'));

            // Update Goals Widget items
            document.querySelectorAll('#goals-list li').forEach(li => {
                li.className = `flex items-center p-3 rounded-lg border ${getClasses('light-bg')} ${getClasses('light-border')}`;
                const span = li.querySelector('span');
                const input = li.querySelector('input');
                const button = li.querySelector('button');

                if (span) span.classList.add(getClasses('text')); // Re-add dynamic text color
                if (input) {
                    input.classList.remove('border-blue-500', 'border-green-500', 'border-purple-500', 'border-red-500');
                    input.classList.add(getClasses('border'));
                }
                if (button) {
                    button.classList.remove('bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500');
                    button.classList.add(getClasses('bg'));
                }
            });

            // Update Progress Bars
            const workoutProgressBar = document.getElementById('weekly-workout-progress-bar');
            const hydrationProgressBar = document.getElementById('hydration-goal-progress-bar');
            workoutProgressBar.className = `progress-bar ${getClasses('gradient', 'green')}`;
            hydrationProgressBar.className = `progress-bar ${getClasses('gradient', 'blue')}`;

            

            // Update Checklist Widget
            document.getElementById('checklist-form').querySelector('input').className = `flex-grow p-3 rounded-l-lg border ${getClasses('light-border')} focus:outline-none focus:ring-2 ${getClasses('bg')}`; // Reset ring color
            document.getElementById('checklist-form').querySelector('button').classList.remove('bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500');
            document.getElementById('checklist-form').querySelector('button').classList.add(getClasses('bg'));

            document.querySelectorAll('#checklist-list li').forEach(li => {
                li.className = `flex items-center p-3 rounded-lg border ${getClasses('light-border')} ${currentTheme.mode === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-sm`;
                const checkbox = li.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.style.backgroundColor = checkbox.checked ? getComputedStyle(document.documentElement).getPropertyValue(`--primary-color-500`) : '';
                    checkbox.style.borderColor = checkbox.checked ? getComputedStyle(document.documentElement).getPropertyValue(`--primary-color-500`) : '';
                }
            });

            // Update Coaches Widget
            document.querySelectorAll('#coaches-list .coach-card').forEach(card => {
                card.classList.remove('border-blue-200', 'border-green-200', 'border-purple-200', 'border-red-200');
                card.classList.add(getClasses('light-border'));
                const h4 = card.querySelector('h4');
                h4.classList.remove('text-blue-500', 'text-green-500', 'text-purple-500', 'text-red-500');
                h4.classList.add(getClasses('text'));
            });

            // Update Mood Log Widget
            document.querySelectorAll('#mood-selector button').forEach(btn => {
                btn.classList.remove('bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500');
                if (btn.classList.contains('selected')) {
                    btn.classList.add(getClasses('bg'));
                    // Set ring color explicitly via style property for selected mood button
                    btn.style.setProperty('--primary-color-500-rgb', getClasses('rgb')); // Update CSS variable for this element's ring
                    btn.style.setProperty('box-shadow', `0 0 0 4px rgba(${getClasses('rgb')}, 0.6), 0 0 0 8px rgba(255, 255, 255, 0.6)`);
                } else {
                    btn.style.setProperty('box-shadow', ''); // Clear custom shadow if not selected
                }
            });
            // Update widget container backgrounds and borders
            document.querySelectorAll('.widget-container').forEach(container => {
                container.classList.remove('bg-gray-800', 'border-gray-700', 'bg-white', 'border-gray-200', 'shadow-lg', 'shadow-xl');
                container.classList.add(
                    currentTheme.mode === 'dark' ? 'bg-gray-800' : 'bg-white',
                    currentTheme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200',
                    currentTheme.mode === 'dark' ? 'shadow-lg' : 'shadow-xl'
                );
            });
            // Update general text colors
            document.querySelectorAll('.light-theme .text-gray-700').forEach(el => el.style.color = '#374151');
            document.querySelectorAll('.dark-theme .text-gray-200').forEach(el => el.style.color = '#e5e7eb');
            document.querySelectorAll('.progress-widget .progress-label').forEach(el => {
                el.classList.remove('text-gray-300', 'text-gray-700');
                el.classList.add(currentTheme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700');
            });
            document.querySelectorAll('.light-theme .text-gray-800').forEach(el => el.style.color = '#1f2937');
            document.querySelectorAll('.dark-theme .text-gray-100').forEach(el => el.style.color = '#f3f4f6');
            document.querySelectorAll('.checklist-list li span:not(.completed)').forEach(span => {
                span.classList.remove('text-gray-100', 'text-gray-800');
                span.classList.add(currentTheme.mode === 'dark' ? 'text-gray-100' : 'text-gray-800');
            });
            document.querySelectorAll('.coach-card p').forEach(p => {
                if (p.classList.contains('bio')) {
                    p.classList.remove('text-gray-400', 'text-gray-500');
                    p.classList.add(currentTheme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500');
                } else {
                    p.classList.remove('text-gray-300', 'text-gray-600');
                    p.classList.add(currentTheme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600');
                }
            });
            document.querySelectorAll('.mood-feedback').forEach(p => {
                p.classList.remove('text-gray-300', 'text-gray-700');
                p.classList.add(currentTheme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700');
            });
            document.querySelectorAll('.mood-history h4').forEach(h4 => {
                h4.classList.remove('text-gray-200', 'text-gray-800');
                h4.classList.add(currentTheme.mode === 'dark' ? 'text-gray-200' : 'text-gray-800');
            });
            document.querySelectorAll('.mood-history li').forEach(li => {
                li.classList.remove('text-gray-300', 'text-gray-700');
                li.classList.add(currentTheme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700');
            });
        }


        themeToggleButton.addEventListener('click', () => {
            currentTheme.mode = currentTheme.mode === 'light' ? 'dark' : 'light';
            applyTheme();
        });

        colorPicker.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'BUTTON' && target.dataset.color) {
                currentTheme.primaryColor = target.dataset.color;
                applyTheme();
            }
        });

        // --- Goals Widget ---
        let goals = [
            { id: 1, text: 'Run 5k', value: 5, unit: 'km', isEditing: false },
            { id: 2, text: 'Drink Water', value: 8, unit: 'glasses', isEditing: false },
            { id: 3, text: 'Meditate', value: 30, unit: 'minutes', isEditing: false },
        ];
        const goalsList = document.getElementById('goals-list');

        function renderGoals() {
            goalsList.innerHTML = '';
            goals.forEach(goal => {
                const li = document.createElement('li');
                li.className = `flex items-center p-3 rounded-lg border ${getClasses('light-bg')} ${getClasses('light-border')}`;

                if (goal.isEditing) {
                    const input = document.createElement('input');
                    input.type = typeof goal.value === 'number' ? 'number' : 'text';
                    input.value = typeof goal.value === 'number' ? goal.value : goal.text;
                    input.className = `flex-grow p-2 rounded-md ${currentTheme.mode === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'} border ${getClasses('border')} focus:outline-none focus:ring-2 ${getClasses('bg')}`;
                    input.autofocus = true;
                    input.addEventListener('blur', () => handleGoalBlur(goal.id, input.value));
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') handleGoalBlur(goal.id, input.value);
                    });
                    li.appendChild(input);
                } else {
                    const span = document.createElement('span');
                    span.className = `flex-grow text-lg font-medium cursor-pointer ${getClasses('text')}`;
                    span.textContent = `${goal.text}: ${goal.value} ${goal.unit}`;
                    span.addEventListener('click', () => handleEditGoalClick(goal.id));
                    li.appendChild(span);
                }

                const button = document.createElement('button');
                button.className = `ml-3 px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 ${getClasses('bg')} text-white hover:opacity-90`;
                button.textContent = 'Edit';
                button.addEventListener('click', () => handleEditGoalClick(goal.id));
                li.appendChild(button);

                goalsList.appendChild(li);
            });
        }

        function handleEditGoalClick(id) {
            goals = goals.map(goal =>
                goal.id === id ? { ...goal, isEditing: true } : { ...goal, isEditing: false } // Only one editable at a time
            );
            renderGoals();
        }

        function handleGoalBlur(id, newValue) {
            goals = goals.map(goal => {
                if (goal.id === id) {
                    if (typeof goal.value === 'number') {
                        return { ...goal, value: parseFloat(newValue) || goal.value, isEditing: false };
                    } else {
                        return { ...goal, text: newValue, isEditing: false };
                    }
                }
                return goal;
            });
            renderGoals();
        }

        // --- Progress Widgets (Static for now, dynamic values in JS for updating) ---
        function updateProgressBar(id, progress, color) {
            const progressBar = document.getElementById(`${id}-progress-bar`);
            const progressValue = document.getElementById(`${id}-progress-value`);
            if (progressBar && progressValue) {
                progressBar.style.width = `${progress}%`;
                progressBar.className = `progress-bar ${getClasses('gradient', color)}`; // Reapply gradient
                progressValue.textContent = `${progress}%`;
            }
        }

        // --- Checklist Widget ---
        let checklistItems = [
            { id: 1, text: 'Complete morning stretch', completed: false },
            { id: 2, text: 'Prepare healthy lunch', completed: false },
            { id: 3, text: 'Go for a 30-min walk', completed: true },
            { id: 4, text: 'Read health articles', completed: false },
        ];
        const checklistList = document.getElementById('checklist-list');
        const checklistForm = document.getElementById('checklist-form');
        const newTaskInput = document.getElementById('new-task-input');

        function renderChecklist() {
            checklistList.innerHTML = '';
            checklistItems.forEach(item => {
                const li = document.createElement('li');
                li.className = `flex items-center p-3 rounded-lg border ${getClasses('light-border')} ${currentTheme.mode === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-sm`;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.completed;
                checkbox.className = `form-checkbox h-5 w-5 rounded transition-colors duration-200 cursor-pointer`;
                checkbox.style.setProperty('--primary-color-500', getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme.primaryColor}-500`)); // Pass CSS var
                if (item.completed) {
                    checkbox.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme.primaryColor}-500`);
                    checkbox.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme.primaryColor}-500`);
                } else {
                    checkbox.style.backgroundColor = currentTheme.mode === 'dark' ? '#4b5563' : '#fff';
                    checkbox.style.borderColor = currentTheme.mode === 'dark' ? '#6b7280' : '#d1d5db';
                }

                checkbox.addEventListener('change', () => handleToggleChecklistComplete(item.id));

                const span = document.createElement('span');
                span.className = `ml-3 text-lg flex-grow ${item.completed ? 'completed' : ''}`;
                if (!item.completed) {
                     span.classList.add(currentTheme.mode === 'dark' ? 'text-gray-100' : 'text-gray-800');
                }
                span.textContent = item.text;

                li.appendChild(checkbox);
                li.appendChild(span);
                checklistList.appendChild(li);
            });
             // Update add button color
            checklistForm.querySelector('button').classList.remove('bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500');
            checklistForm.querySelector('button').classList.add(getClasses('bg'));
             // Update input border color
            newTaskInput.classList.remove('border-blue-200', 'border-green-200', 'border-purple-200', 'border-red-200');
            newTaskInput.classList.add(getClasses('light-border'));
            newTaskInput.classList.remove('bg-gray-700', 'text-gray-100', 'bg-gray-50', 'text-gray-800');
            newTaskInput.classList.add(
                currentTheme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
                currentTheme.mode === 'dark' ? 'text-gray-100' : 'text-gray-800'
            );
        }

        function handleToggleChecklistComplete(id) {
            checklistItems = checklistItems.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            );
            renderChecklist();
        }

        checklistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItemText = newTaskInput.value.trim();
            if (newItemText) {
                checklistItems.push({ id: Date.now(), text: newItemText, completed: false });
                newTaskInput.value = '';
                renderChecklist();
            }
        });

        // --- Coaches Widget ---
        const coaches = [
            { id: 1, name: 'Coach Balram', specialty: 'Strength Training', bio: 'Expert in weightlifting and muscle gain.', imageUrl: 'R:\\visual studio\\CodeNova-_Frontend-Domination\\Balram.jpg' },
            { id: 2, name: 'Coach Gouri', specialty: 'Yoga & Mindfulness', bio: 'Helps with flexibility and mental well-being.', imageUrl: 'R:\\visual studio\\CodeNova-_Frontend-Domination\\gouri.jpg' },
            { id: 3, name: 'Coach Ramdas', specialty: 'Nutrition', bio: 'Guides on healthy eating habits for sustainable results.', imageUrl: 'R:\\visual studio\\CodeNova-_Frontend-Domination\\ram 11.jpg' },
            { id: 3, name: 'Coach Sachin', specialty: 'Trainer', bio: 'Gym trainer, Bulking expert.', imageUrl: 'R:\\visual studio\\CodeNova-_Frontend-Domination\\sachin.jpg' },
        ];
        const coachesList = document.getElementById('coaches-list');

        function renderCoaches() {
            coachesList.innerHTML = '';
            coaches.forEach(coach => {
                const div = document.createElement('div');
                div.className = `coach-card flex items-center p-4 rounded-xl border ${getClasses('light-border')} ${currentTheme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} shadow-md transition-transform duration-300 hover:scale-[1.02]`;

                const img = document.createElement('img');
                img.src = coach.imageUrl;
                img.alt = coach.name;
                img.className = "w-16 h-16 rounded-full object-cover mr-4 shadow-sm";
                img.onerror = function() { this.onerror=null; this.src="https://placehold.co/100x100/CCCCCC/666666?text=Coach"; };

                const infoDiv = document.createElement('div');
                infoDiv.className = "coach-info flex-grow";

                const h4 = document.createElement('h4');
                h4.className = `text-xl font-semibold ${getClasses('text')}`;
                h4.textContent = coach.name;

                const pSpecialty = document.createElement('p');
                pSpecialty.className = `text-sm ${currentTheme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;
                pSpecialty.textContent = coach.specialty;

                const pBio = document.createElement('p');
                pBio.className = `text-xs mt-1 ${currentTheme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} bio`;
                pBio.textContent = coach.bio;

                infoDiv.appendChild(h4);
                infoDiv.appendChild(pSpecialty);
                infoDiv.appendChild(pBio);
                div.appendChild(img);
                div.appendChild(infoDiv);
                coachesList.appendChild(div);
            });
        }

        // --- Mood Log Widget ---
        let moodHistory = [];
        let currentSelectedMood = null;
        const moodSelector = document.getElementById('mood-selector');
        const moodFeedback = document.getElementById('mood-feedback');
        const moodHistoryContainer = document.getElementById('mood-history-container');
        const moodHistoryList = document.getElementById('mood-history-list');
        const emojis = [
            { emoji: '😄', label: 'Happy' },
            { emoji: '😊', label: 'Content' },
            { emoji: '😐', label: 'Neutral' },
            { emoji: '😟', label: 'Worried' },
            { emoji: '😔', label: 'Sad' },
            { emoji: '💪', label: 'Energized' },
        ];

        function renderMoodLog() {
            moodFeedback.textContent = currentSelectedMood ? `Today's Mood: ${currentSelectedMood}` : '';
            if (currentSelectedMood) {
                 moodFeedback.classList.remove('text-gray-300', 'text-gray-700');
                 moodFeedback.classList.add(currentTheme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700');
            }


            document.querySelectorAll('#mood-selector button').forEach(button => {
                const emoji = button.dataset.emoji;
                button.classList.remove('selected');
                button.classList.remove('bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'); // Remove old bg colors
                button.classList.remove('bg-gray-600', 'bg-gray-100'); // Remove old default bg colors

                if (currentSelectedMood === emoji) {
                    button.classList.add('selected', getClasses('bg'));
                    button.style.setProperty('--primary-color-500-rgb', getClasses('rgb')); // Set CSS variable for ring
                    button.style.setProperty('box-shadow', `0 0 0 4px rgba(${getClasses('rgb')}, 0.6), 0 0 0 8px rgba(255, 255, 255, 0.6)`);
                    button.classList.add('text-white');
                } else {
                    button.classList.add(currentTheme.mode === 'dark' ? 'bg-gray-600' : 'bg-gray-100');
                    button.classList.remove('text-white');
                    button.classList.add(currentTheme.mode === 'dark' ? 'text-gray-200' : ''); // Set text color for non-selected
                    button.style.setProperty('box-shadow', ''); // Clear custom shadow if not selected
                }
            });

            renderMoodHistory();
        }

        function handleMoodSelect(emoji) {
            currentSelectedMood = emoji;
            const today = new Date().toISOString().split('T')[0];
            const existingIndex = moodHistory.findIndex(entry => entry.date === today);

            if (existingIndex > -1) {
                moodHistory[existingIndex] = { date: today, emoji };
            } else {
                moodHistory.push({ date: today, emoji });
            }
            renderMoodLog();
        }

        moodSelector.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            if (target && target.dataset.emoji) {
                handleMoodSelect(target.dataset.emoji);
            }
        });

        function renderMoodHistory() {
            moodHistoryList.innerHTML = '';
            if (moodHistory.length > 0) {
                moodHistoryContainer.style.display = 'block';
                moodHistoryContainer.querySelector('h4').classList.remove('text-gray-200', 'text-gray-800');
                moodHistoryContainer.querySelector('h4').classList.add(currentTheme.mode === 'dark' ? 'text-gray-200' : 'text-gray-800');
            } else {
                moodHistoryContainer.style.display = 'none';
            }

            moodHistory.forEach(entry => {
                const li = document.createElement('li');
                li.className = `flex justify-between items-center ${currentTheme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;
                const dateSpan = document.createElement('span');
                dateSpan.textContent = entry.date;
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'emoji text-2xl';
                emojiSpan.textContent = entry.emoji;
                li.appendChild(dateSpan);
                li.appendChild(emojiSpan);
                moodHistoryList.appendChild(li);
            });
        }

        // --- Initial Render ---
        window.onload = () => {
            // Set initial CSS custom properties based on default theme for root
            document.documentElement.style.setProperty('--primary-color-500', getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme.primaryColor}-500`));

            // Set up initial theme and render components
            applyTheme();
            renderGoals();
            updateProgressBar('weekly-workout', 75, 'green');
            updateProgressBar('hydration-goal', 90, 'blue');
            renderChecklist();
            renderCoaches();
            renderMoodLog();
        };

        // Define CSS Custom Properties for colors (to be used by JS for dynamic styles)
        document.documentElement.style.setProperty('--blue-500', '#3b82f6');
        document.documentElement.style.setProperty('--green-500', '#22c55e');
        document.documentElement.style.setProperty('--purple-500', '#a855f7');
        document.documentElement.style.setProperty('--red-500', '#ef4444');