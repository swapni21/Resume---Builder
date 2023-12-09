document.addEventListener('DOMContentLoaded',function(){
    let submissions = [];

    function addEntry(containerId, entryClassName) {
        const container = document.getElementById(containerId);
        const entry = document.querySelector(`.${entryClassName}`);
        const newEntry = entry.cloneNode(true);
        const inputFields = newEntry.querySelectorAll('input');
        inputFields.forEach((input) => {
            input.value = '';
        });
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.type = 'button';
        removeButton.className = 'remove-entry';
        removeButton.addEventListener('click', () => {
            container.removeChild(newEntry);
        });
        newEntry.appendChild(removeButton);
        container.appendChild(newEntry);
    }
    document.getElementById('add-education').addEventListener('click', () => {
        addEntry('education-entries', 'education-entry');
    });

    document.getElementById('add-work').addEventListener('click', () => {
        addEntry('work-entries', 'work-entry');
    });

    document.getElementById('add-skill').addEventListener('click', () => {
        addEntry('skills-entries', 'skill-entry');
    });

    function updateUserData() {
        const userData = {
            personalInfo: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
            },
            education: [],
            workExperience: [],
            skills: [],
        };
    
        const educationEntries = document.querySelectorAll('#education-entries .education-entry');
        educationEntries.forEach((entry) => {
            const university = entry.querySelector('.university').value;
            const degree = entry.querySelector('.degree').value;
            const gradYear = entry.querySelector('.grad-year').value;
            userData.education.push({ university, degree, gradYear });
        });
    
        const workEntries = document.querySelectorAll('#work-entries .work-entry');
        workEntries.forEach((entry) => {
            const company = entry.querySelector('.company').value;
            const position = entry.querySelector('.position').value;
            const duration = entry.querySelector('.duration').value;
            userData.workExperience.push({ company, position, duration });
        });
    
        const skillsEntries = document.querySelectorAll('#skills-entries .skill-entry');
        skillsEntries.forEach((entry) => {
            const tools = entry.querySelector('.tools').value;
            const programmingLanguages = entry.querySelector('.programming-languages').value;
            userData.skills.push({ tools, programmingLanguages });
        });
    
        const name = userData.personalInfo.name.trim().toLowerCase().replace(/\s/g, ''); 
            const mobile = userData.personalInfo.phone.trim().slice(-2); 

            
            const submissionId = name + mobile;
       
        submissions.push({ id: submissionId, data: userData });

        localStorage.setItem('submissions', JSON.stringify(submissions));
    }
    function loadUserData() {
        const savedData = localStorage.getItem('submissions');
        if (savedData) {
            submissions = JSON.parse(savedData);
        }
    }
    loadUserData();
    
    function generateAndDisplayResume(submissionId) {
        const resumeDiv = document.getElementById('resume');
        resumeDiv.innerHTML = '';
        
        const foundSubmission = submissions.find(submission => submission.id === submissionId);
    
        if (foundSubmission) {
            const userData = foundSubmission.data;
            const resumeContent = document.createElement('div');
            resumeContent.innerHTML = `
                <h2>Resume</h2>
                <h3>Personal Information</h3>
                <p>Name: ${userData.personalInfo.name}</p>
                <p>Email: ${userData.personalInfo.email}</p>
                <p>Phone: ${userData.personalInfo.phone}</p>
                <p>Address: ${userData.personalInfo.address}</p>
    
                <h3>Educational Background</h3>
                <ul>
                    ${userData.education.map(edu => `
                        <li>
                            University: ${edu.university}<br>
                            Degree: ${edu.degree}<br>
                            Graduation Year: ${edu.gradYear}
                        </li>
                    `).join('')}
                </ul>
                <h3>Work Experience</h3>
                <ul>
                    ${userData.workExperience.map(work => `
                        <li>
                            Company: ${work.company}<br>
                            Position: ${work.position}<br>
                            Duration: ${work.duration}
                        </li>
                    `).join('')}
                </ul>
                <h3>Skills</h3>
                <ul>
                    ${userData.skills.map(skill => `
                        <li>
                            Tools: ${skill.tools}<br>
                            Programming Languages: ${skill.programmingLanguages}
                        </li>
                    `).join('')}
                </ul>
            `;
            resumeDiv.appendChild(resumeContent);
            toggleSections(false);
        } else {
            resumeDiv.innerHTML = '<p>No resume exists for the provided ID.</p>';
            toggleSections(false); 
        }
    }
    
    function toggleSections(showForm) {
        const formSection = document.getElementById('resume-form'); 
        const resumeSection = document.getElementById('resume-section'); 
        if (showForm) {
            formSection.style.display = 'block';
            resumeSection.style.display = 'none'; 
        } else {
            formSection.style.display = 'none';
            resumeSection.style.display = 'block'; 
        }
    }
    
    document.getElementById('generate-resume').addEventListener('click', function (e) {
        e.preventDefault();
        console.log("Generating resume");

        clearErrorMessages();

        const isValid = validateForm();

        if (isValid) {
            updateUserData();
            const lastSubmission = submissions[submissions.length - 1];
            if (lastSubmission) {
                generateAndDisplayResume(lastSubmission.id);
                const newUrl = `${window.location.pathname}?id=${lastSubmission.id}`;
                window.history.pushState({}, '', newUrl);
            }
        }
    }); 

    // Function to clear error messages
    function clearErrorMessages() {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach((error) => {
            error.textContent = '';
        });
    }

    // Function to validate the entire form
    function validateForm() {
        let isValid = true;

        // Validation logic for each input field
        isValid = validateRequiredField('name', 'name-error') && isValid;
        isValid = validateEmailField('email', 'email-error') && isValid;
        isValid = validateRequiredField('phone', 'phone-error') && isValid;
        isValid = validateRequiredField('address', 'address-error') && isValid;

        return isValid;
    }

    // Function to validate a required input field
    function validateRequiredField(fieldId, errorId) {
        const field = document.getElementById(fieldId).value;
        const errorElement = document.getElementById(errorId);

        if (field.trim() === "") {
            errorElement.textContent = "This field is required";
            return false;
        }

        return true;
    }

    // Function to validate an email input field
    function validateEmailField(fieldId, errorId) {
        const email = document.getElementById(fieldId).value;
        const errorElement = document.getElementById(errorId);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === "") {
            errorElement.textContent = "Email is required";
            return false;
        } else if (!emailPattern.test(email)) {
            errorElement.textContent = "Invalid email format";
            return false;
        }

        return true;
    }

    document.getElementById('back-to-form').addEventListener('click', function (e) {
        e.preventDefault();
        toggleSections(true);
        document.getElementById('resume-form').reset();
        const newUrl = window.location.pathname;
        window.history.pushState({}, '', newUrl);
        
    });

    function handleSearchParams() {
        const searchParams = new URLSearchParams(window.location.search);
        const submissionId = searchParams.get('id');
        if (submissionId) {
            generateAndDisplayResume(submissionId);
        }
    }
    window.addEventListener('popstate', handleSearchParams);
    handleSearchParams();
})