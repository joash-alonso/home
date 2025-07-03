// Asset Mapping for Technology Icons - using local SVG files
const AssetMapping = {
    // Programming Languages
    'python': {
        name: 'Python',
        icon: 'assets/python.svg',
        color: '#3776AB'
    },
    'golang': {
        name: 'Go',
        icon: 'assets/go.svg',
        color: '#00ADD8'
    },
    // AI/ML Services
    'openai': {
        name: 'OpenAI',
        icon: 'assets/openai.svg',
        color: '#74AA9C'
    },
    // Web Frameworks
    'fastapi': {
        name: 'FastAPI',
        icon: 'assets/fastapi.svg',
        color: '#009688'
    },
    'streamlit': {
        name: 'Streamlit',
        icon: 'assets/streamlit.svg',
        color: '#FF4B4B'
    },
    // Cloud Platforms
    'aws': {
        name: 'AWS',
        icon: 'assets/aws.svg',
        color: '#FF9900'
    },
    'gcp': {
        name: 'Google Cloud',
        icon: 'assets/gcp.svg',
        color: '#4285F4'
    },
    'azureml': {
        name: 'Azure ML',
        icon: 'assets/azure.svg',
        color: '#0078D4'
    },
    // DevOps & Tools
    'docker': {
        name: 'Docker',
        icon: 'assets/docker.svg',
        color: '#2496ED'
    },
    'gha': {
        name: 'GitHub Actions',
        icon: 'assets/githubactions.svg',
        color: '#2088FF'
    },
    // Databases
    'mongo': {
        name: 'MongoDB',
        icon: 'assets/mongo.svg',
        color: '#47A248'
    },
    'postgres': {
        name: 'PostgreSQL',
        icon: 'assets/postgres.svg',
        color: '#336791'
    },
    // ML/Data Science
    'pandas': {
        name: 'Pandas',
        icon: 'assets/pandas.svg',
        color: '#150458'
    },
    'numpy': {
        name: 'NumPy',
        icon: 'assets/numpy.svg',
        color: '#013243'
    },
    'sklearn': {
        name: 'Scikit-learn',
        icon: 'assets/sklearn.svg',
        color: '#F7931E'
    },
    'mlflow': {
        name: 'MLflow',
        icon: 'assets/mlflow.svg',
        color: '#0194E2'
    },
    'jupyter': {
        name: 'Jupyter',
        icon: 'assets/jupyter.svg',
        color: '#F37626'
    },
    // AI Frameworks
    'langchain': {
        name: 'LangChain',
        icon: 'assets/langchain.svg',
        color: '#1C3C3C'
    },
    // Other Technologies
    'webrtc': {
        name: 'WebRTC',
        icon: 'assets/webrtc.svg',
        color: '#FF5722'
    },
    // Additional mappings for variations
    'spacy': {
        name: 'spaCy',
        icon: 'assets/spacy.svg',
        color: '#09A3D5'
    }
};

// Helper function to get asset info
function getAssetInfo(key) {
    return AssetMapping[key] || {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        icon: null, // Will create fallback icon in timeline.js
        color: '#666666'
    };
}

// Export for global use
window.AssetMapping = AssetMapping;
window.getAssetInfo = getAssetInfo;
