// YAML Data Loader
class YAMLLoader {
    constructor() {
        this.data = null;
        this.loaded = false;
    }

    async loadData() {
        try {
            const response = await fetch('cv.yaml');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const yamlText = await response.text();
            this.data = jsyaml.load(yamlText);
            this.loaded = true;
            return this.data;
        } catch (error) {
            console.error('Error loading YAML data:', error);
            // Return fallback data if YAML loading fails
            return this.getFallbackData();
        }
    }

    getFallbackData() {
        return {
            professional_experience: [
                {
                    title: "Senior Software Engineer",
                    type: "Full-time",
                    company: "Tech Corp",
                    location: "San Francisco, CA",
                    start_date: "2022-01-01",
                    end_date: "2024-12-31",
                    highlights: [
                        "Led development of microservices architecture",
                        "Improved system performance by 40%",
                        "Mentored junior developers"
                    ],
                    technology_assets: [
                        { name: "JavaScript", icon: "devicon-javascript-plain" },
                        { name: "React", icon: "devicon-react-original" },
                        { name: "Node.js", icon: "devicon-nodejs-plain" }
                    ]
                },
                {
                    title: "Full Stack Developer",
                    type: "Contract",
                    company: "Startup Inc",
                    location: "New York, NY",
                    start_date: "2020-06-01",
                    end_date: "2021-12-31",
                    highlights: [
                        "Built scalable web applications",
                        "Implemented CI/CD pipelines",
                        "Reduced deployment time by 60%"
                    ],
                    technology_assets: [
                        { name: "Python", icon: "devicon-python-plain" },
                        { name: "Django", icon: "devicon-django-plain" },
                        { name: "PostgreSQL", icon: "devicon-postgresql-plain" }
                    ]
                }
            ]
        };
    }

    getData() {
        return this.data;
    }

    isLoaded() {
        return this.loaded;
    }

    // Extract unique technologies from all experiences
    getAllTechnologies() {
        if (!this.data || !this.data.professional_experience) return [];
        
        const techSet = new Set();
        
        this.data.professional_experience.forEach(exp => {
            if (exp.assets) {
                exp.assets.forEach(asset => {
                    // Clean up asset names
                    const techName = typeof asset === 'string' ? 
                        asset.replace(/devicon-|-plain|-wordmark|-colored|\.png/g, '').replace(/([A-Z])/g, ' $1').trim() :
                        asset.name || asset;
                    
                    if (techName) {
                        techSet.add(techName);
                    }
                });
            }
        });
        
        return Array.from(techSet).map(name => ({ name }));
    }

    // Get experience statistics
    getExperienceStats() {
        if (!this.data || !this.data.professional_experience) return {};
        
        const experiences = this.data.professional_experience;
        const totalYears = this.calculateTotalYears(experiences);
        const companies = new Set(experiences.map(exp => exp.company)).size;
        const technologies = this.getAllTechnologies().length;
        const projects = experiences.length;
        
        return {
            totalYears,
            companies,
            technologies,
            projects
        };
    }

    calculateTotalYears(experiences) {
        let totalMonths = 0;
        
        experiences.forEach(exp => {
            if (!exp.start_date) return;
            
            // Parse dates in "MMM YYYY" format
            const startDate = this.parseDate(exp.start_date);
            const endDate = exp.end_date ? this.parseDate(exp.end_date) : new Date();
            
            if (startDate && endDate) {
                const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                              (endDate.getMonth() - startDate.getMonth());
                totalMonths += months;
            }
        });
        
        return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
    }

    parseDate(dateString) {
        if (!dateString) return null;
        
        // Handle "MMM YYYY" format
        const parts = dateString.split(' ');
        if (parts.length === 2) {
            const month = parts[0];
            const year = parseInt(parts[1]);
            
            const monthMap = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };
            
            if (monthMap.hasOwnProperty(month)) {
                return new Date(year, monthMap[month]);
            }
        }
        
        // Fallback to standard date parsing
        return new Date(dateString);
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    }

    // Format date range
    formatDateRange(startDate, endDate) {
        const start = this.formatDate(startDate);
        const end = endDate ? this.formatDate(endDate) : 'Present';
        return `${start} - ${end}`;
    }
}

// Export for use in other modules
window.YAMLLoader = YAMLLoader;