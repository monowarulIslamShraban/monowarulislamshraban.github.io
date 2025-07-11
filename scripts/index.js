const loadedContent = {};

// Variable to track the last clicked section
let lastClickedSection = 'aboutme';

// Array of sections to load
const sections = [
    { id: 'aboutme', file: 'aboutme.html' },
    { id: 'education', file: 'education.html' },
    { id: 'projects', file: 'projects.html' },
    { id: 'skills', file: 'skills.html' },
    { id: 'research', file: 'research.html' },
    { id: 'experience', file: 'experience.html' }
];

// Function to load content from external files
async function loadContent(sectionId, fileName) {
    try {
        const response = await fetch(fileName);
        const content = await response.text();
        loadedContent[sectionId] = content;
        document.getElementById(sectionId).innerHTML = content;
    } catch (error) {
        console.error(`Error loading ${fileName}:`, error);
        document.getElementById(sectionId).innerHTML = `<p>Error loading content for ${sectionId}</p>`;
    }
}

// Function to load all sections
async function loadAllSections() {
    const loadPromises = sections.map(section =>
            loadContent(section.id, section.file)
    );

    await Promise.all(loadPromises);

    // Set initial active button
    updateActiveButton('aboutme');
}

// Function to scroll to a specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Update the last clicked section when nav button is clicked
        lastClickedSection = sectionId;
        updateActiveButton(sectionId);
    }
}

// Function to update active button
function updateActiveButton(activeSectionId) {
    const buttons = document.querySelectorAll('.sidebar nav .button');
    buttons.forEach(button => {
        button.classList.remove('button_active');
        if (button.getAttribute('onclick').includes(activeSectionId)) {
            button.classList.add('button_active');
        }
    });
}

// Function to handle scroll and update active button
function handleScroll() {
    const sections = document.querySelectorAll('.section');
    let currentSection = 'aboutme';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
            currentSection = section.id;
        }
    });

    // Update last clicked section based on scroll position
    lastClickedSection = currentSection;
    updateActiveButton(currentSection);
}

function handleSectionHover(event) {
    const section = event.target.closest('.section');
    if (section) {
        updateActiveButton(section.id);
    }
}

// Function to handle mouse leave from sections
function handleSectionLeave() {
    // Return to the last clicked section instead of scroll-based detection
    updateActiveButton(lastClickedSection);
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

document.addEventListener('mouseover', handleSectionHover);
document.addEventListener('mouseleave', handleSectionLeave);

// Load all content when page loads
window.onload = () => {
    loadAllSections();
};