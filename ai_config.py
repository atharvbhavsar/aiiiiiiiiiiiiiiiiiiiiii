"""
Enhanced AI Configuration for AdmitAI
Integrates multiple AI services for comprehensive college guidance
"""

import os
import json
from typing import Dict, Any, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIServiceConfig:
    """Configuration class for all AI services"""
    
    def __init__(self):
        # Primary AI Service - Google Gemini
        self.GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyC-2jr4RlBvKWW8sdjdGjJBQ1ujHR-D2Xs')
        self.GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        
        # OpenAI Configuration (Fallback)
        self.OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
        self.OPENAI_MODEL = 'gpt-3.5-turbo'
        
        # Voice AI Services
        self.VAPI_API_KEY = os.environ.get('VAPI_API_KEY', '')
        self.VAPI_ENDPOINT = 'https://api.vapi.ai/v1/'
        
        self.RETELL_AI_API_KEY = os.environ.get('RETELL_AI_API_KEY', '')
        self.RETELL_AI_ENDPOINT = 'https://api.retellai.com/v1/'
        
        self.ELEVEN_LABS_API_KEY = os.environ.get('ELEVEN_LABS_API_KEY', '')
        self.ELEVEN_LABS_ENDPOINT = 'https://api.elevenlabs.io/v1/'
        self.ELEVEN_LABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'  # Default voice
        
        self.BLAND_AI_API_KEY = os.environ.get('BLAND_AI_API_KEY', '')
        self.BLAND_AI_ENDPOINT = 'https://api.bland.ai/v1/'
        
        # AWS Configuration
        self.AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', '')
        self.AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', '')
        self.AWS_REGION = os.environ.get('AWS_REGION', 'ap-south-1')
        
        # Database Configuration
        self.MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
        self.MONGODB_DB_NAME = os.environ.get('MONGODB_DB_NAME', 'admitai')
        
        # Automation Configuration
        self.N8N_WEBHOOK_URL = os.environ.get('N8N_WEBHOOK_URL', '')
        self.MAKE_WEBHOOK_URL = os.environ.get('MAKE_WEBHOOK_URL', '')
        
        # College Data API Configuration
        self.MHT_CET_API_KEY = os.environ.get('MHT_CET_API_KEY', '')
        self.JEE_API_KEY = os.environ.get('JEE_API_KEY', '')
        
        # Application Settings
        self.AI_RESPONSE_TIMEOUT = 30
        self.VOICE_RESPONSE_TIMEOUT = 15
        self.MAX_RETRIES = 3
        self.ENABLE_VOICE_FEATURES = True
        self.ENABLE_AUTOMATION = True
        self.DEBUG_MODE = os.environ.get('DEBUG_MODE', 'False').lower() == 'true'

# College Database Configuration
COLLEGE_DATABASE_CONFIG = {
    "total_colleges": 150,
    "supported_exams": ["MHT-CET", "JEE Main", "JEE Advanced", "BITSAT", "COMEDK", "KCET"],
    "branches": [
        "Computer Engineering",
        "Information Technology",
        "Mechanical Engineering", 
        "Electrical Engineering",
        "Electronics & Telecommunication",
        "Civil Engineering",
        "Chemical Engineering",
        "AI & Data Science",
        "Data Science",
        "Biotechnology",
        "Textile Engineering",
        "Metallurgical Engineering"
    ],
    "categories": ["General", "OBC", "SC", "ST", "EWS", "NT", "SBC"],
    "states": ["Maharashtra", "Karnataka", "Gujarat", "Delhi", "Rajasthan", "MP", "UP"],
    "cutoff_years": ["2021", "2022", "2023", "2024", "2025"]
}

# AI Prompts Configuration
AI_PROMPTS = {
    "system_prompt": """You are AdmitAI, an expert college admission assistant specializing in Indian engineering colleges. 
    You have comprehensive knowledge about:
    
    1. Engineering Entrance Exams:
       - MHT-CET (Maharashtra)
       - JEE Main & Advanced
       - BITSAT
       - State-level exams (KCET, COMEDK, etc.)
    
    2. Top Engineering Colleges:
       - COEP Technological University, Pune
       - VJTI, Mumbai
       - PICT, Pune
       - IITs, NITs, IIITs
       - State government colleges
       - Private colleges
    
    3. Admission Process:
       - Cutoff trends and predictions
       - Category-wise seat allocation
       - Document requirements
       - Counseling procedures
       - Fee structures and scholarships
    
    4. Career Guidance:
       - Placement statistics
       - Industry trends
       - Higher education options
       - Skill development recommendations
    
    Always provide:
    - Accurate and up-to-date information
    - Encouraging and supportive responses
    - Specific examples when possible
    - Clear actionable advice
    - Empathetic understanding of student concerns
    
    Communicate in a friendly, professional manner while being comprehensive and helpful.""",
    
    "college_recommendation_prompt": """Based on the student's profile:
    - Percentile: {percentile}
    - Category: {category}
    - Preferred Branches: {branches}
    - Budget: {budget}
    - Location Preference: {location}
    
    Provide personalized college recommendations with:
    1. Realistic admission chances
    2. Backup options
    3. Dream colleges to aspire for
    4. Specific reasons for each recommendation
    5. Expected cutoff ranges
    
    Format as a structured response with clear categories.""",
    
    "voice_response_prompt": """Convert this text response to be suitable for voice synthesis:
    - Keep it conversational and natural
    - Remove special characters and emojis
    - Break down complex information into digestible chunks
    - Add appropriate pauses with punctuation
    - Make it sound encouraging and supportive
    
    Original text: {text}
    
    Voice-optimized version:"""
}

# Voice Configuration
VOICE_CONFIG = {
    "eleven_labs": {
        "voice_settings": {
            "stability": 0.7,
            "similarity_boost": 0.8,
            "style": 0.2,
            "use_speaker_boost": True
        },
        "model_id": "eleven_monolingual_v1",
        "supported_languages": ["en"],
        "voice_options": {
            "professional_female": "21m00Tcm4TlvDq8ikWAM",
            "friendly_male": "29vD33N1CtxCmqQRPOHJ", 
            "warm_female": "IKne3meq5aSn9XLyUdCD"
        }
    },
    "speech_recognition": {
        "language": "en-IN",
        "timeout": 5,
        "phrase_timeout": 1,
        "dynamic_energy_threshold": True
    },
    "vapi": {
        "voice_model": "eleven_labs_v2",
        "language": "en-IN",
        "accent": "indian_english",
        "response_speed": "normal",
        "interrupt_sensitivity": "medium"
    }
}

# Automation Workflow Configuration
AUTOMATION_CONFIG = {
    "workflows": {
        "query_logging": {
            "enabled": True,
            "endpoint": "/webhook/query-log",
            "analytics": True,
            "sentiment_analysis": True
        },
        "document_verification": {
            "enabled": True,
            "ocr_service": "google_vision",
            "verification_threshold": 0.8,
            "auto_approve_threshold": 0.95
        },
        "deadline_reminders": {
            "enabled": True,
            "schedule": "daily_9am",
            "advance_days": [7, 3, 1],
            "channels": ["email", "push", "sms"]
        },
        "cutoff_updates": {
            "enabled": True,
            "check_interval": "hourly",
            "sources": ["official_websites", "api_feeds"],
            "notification_threshold": 0.5
        }
    },
    "integrations": {
        "n8n": {
            "webhook_url": "https://webhook.n8n.cloud/admitai",
            "auth_header": "Bearer {token}",
            "retry_policy": "exponential_backoff"
        },
        "make": {
            "webhook_url": "https://hook.make.com/admitai",
            "auth_method": "api_key",
            "rate_limit": 100
        }
    }
}

# Performance Monitoring Configuration
MONITORING_CONFIG = {
    "metrics": {
        "response_time": {"threshold": 2000, "unit": "ms"},
        "uptime": {"threshold": 99.9, "unit": "percent"},
        "error_rate": {"threshold": 1, "unit": "percent"},
        "user_satisfaction": {"threshold": 4.0, "unit": "rating"}
    },
    "alerts": {
        "email": ["admin@admitai.com", "tech@admitai.com"],
        "slack": "#alerts",
        "sms": ["+91XXXXXXXXXX"]
    },
    "logging": {
        "level": "INFO",
        "retention_days": 30,
        "log_queries": True,
        "log_responses": True,
        "anonymize_data": True
    }
}

# Export configuration
def get_config():
    """Get complete configuration dictionary"""
    return {
        "ai_service": AIServiceConfig(),
        "college_database": COLLEGE_DATABASE_CONFIG,
        "ai_prompts": AI_PROMPTS,
        "voice_config": VOICE_CONFIG,
        "automation": AUTOMATION_CONFIG,
        "monitoring": MONITORING_CONFIG
    }

# Validation functions
def validate_api_keys():
    """Validate that required API keys are present"""
    config = AIServiceConfig()
    required_keys = {
        "GEMINI_API_KEY": config.GEMINI_API_KEY,
    }
    
    optional_keys = {
        "OPENAI_API_KEY": config.OPENAI_API_KEY,
        "ELEVEN_LABS_API_KEY": config.ELEVEN_LABS_API_KEY,
        "VAPI_API_KEY": config.VAPI_API_KEY,
        "AWS_ACCESS_KEY_ID": config.AWS_ACCESS_KEY_ID
    }
    
    missing_required = []
    missing_optional = []
    
    for key, value in required_keys.items():
        if not value or value == '':
            missing_required.append(key)
    
    for key, value in optional_keys.items():
        if not value or value == '':
            missing_optional.append(key)
    
    if missing_required:
        logger.error(f"Missing required API keys: {missing_required}")
        return False, missing_required
    
    if missing_optional:
        logger.warning(f"Missing optional API keys (some features may be limited): {missing_optional}")
    
    logger.info("API key validation completed successfully")
    return True, []

def test_ai_services():
    """Test connectivity to AI services"""
    results = {}
    config = AIServiceConfig()
    
    # Test Gemini API
    try:
        import requests
        headers = {'Content-Type': 'application/json'}
        test_data = {
            'contents': [{'parts': [{'text': 'Hello, test message'}]}],
            'generationConfig': {'maxOutputTokens': 10}
        }
        
        response = requests.post(
            f"{config.GEMINI_API_URL}?key={config.GEMINI_API_KEY}",
            headers=headers,
            json=test_data,
            timeout=10
        )
        
        results['gemini'] = {
            'status': 'success' if response.status_code == 200 else 'error',
            'status_code': response.status_code,
            'message': 'Connected successfully' if response.status_code == 200 else f'HTTP {response.status_code}'
        }
    except Exception as e:
        results['gemini'] = {
            'status': 'error',
            'message': str(e)
        }
    
    return results

if __name__ == "__main__":
    # Validate configuration
    is_valid, missing_keys = validate_api_keys()
    
    if is_valid:
        logger.info("Configuration validation passed")
        
        # Test services
        test_results = test_ai_services()
        logger.info(f"Service test results: {test_results}")
    else:
        logger.error(f"Configuration validation failed. Missing keys: {missing_keys}")