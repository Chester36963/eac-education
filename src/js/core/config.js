/* ============================================================================
   EAC EDUCATION - CONFIG
   config.js - Application constants and configuration
   ============================================================================ */

const CONFIG = {
  // App Settings
  APP_NAME: 'EAC Education',
  VERSION: '1.0.0-beta',
  ENVIRONMENT: 'production',

  // Feature Flags
  FEATURES: {
    AUTHENTICATION: true,
    PROGRESS_TRACKING: true,
    GAMIFICATION: true,
    DASHBOARD: true,
  },

  // User Settings
  USER: {
    DAILY_LIMIT_FREE: 2,
    DAILY_LIMIT_PREMIUM: 999,
    STREAK_RESET_HOUR: 0, // Midnight
    SESSION_TIMEOUT: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  },

  // Storage Keys
  STORAGE_KEYS: {
    USER: 'eac_user',
    SESSION: 'eac_session',
    PREFERENCES: 'eac_preferences',
    PROGRESS: 'eac_progress',
  },

  // Topics Configuration
  TOPICS: [
    {
      id: 'four-centres',
      name: 'Four Centres',
      nameZh: '四心坐標幾何',
      icon: 'Four Centres',
      color: '#fca9a9',
    },
    {
      id: 'polynomial',
      name: 'Polynomials',
      nameZh: '多項式',
      icon: 'Polynomials',
      color: '#fca9a9',
    },
    {
      id: 'mensuration',
      name: 'Mensuration',
      nameZh: '度量',
      icon: 'Mensuration',
      color: '#fca9a9',
    },
  ],

  // Categories
  CATEGORIES: [
    { type: 'conceptual', name: 'Conceptual', nameZh: '概念題' },
    { type: 'calculation', name: 'Calculation', nameZh: '計算題' },
    { type: 'proof', name: 'Proof', nameZh: '證明題' },
  ],

  // Difficulty Levels
  DIFFICULTIES: [
    { level: 'easy', name: 'Easy', nameZh: '簡單' },
    { level: 'medium', name: 'Medium', nameZh: '中等' },
    { level: 'hard', name: 'Hard', nameZh: '困難' },
    { level: 'challenging', name: 'Challenging', nameZh: '挑戰' },
  ],

  // Achievements
  ACHIEVEMENTS: [
    { id: 'first-step', name: 'First Step', icon: 'First' },
    { id: 'momentum', name: 'Momentum (5-day streak)', icon: 'Streak' },
    { id: 'excellence', name: 'Excellence (10 correct)', icon: 'Perfect' },
    { id: 'master', name: 'Master (50 questions)', icon: 'Master' },
    { id: 'expert', name: 'Expert (100 questions)', icon: 'Expert' },
  ],

  // Endpoints (for future API integration)
  API: {
    BASE_URL: '',
    ENDPOINTS: {
      AUTH_LOGIN: '/api/auth/login',
      AUTH_REGISTER: '/api/auth/register',
      QUESTIONS: '/api/questions',
      PROGRESS: '/api/progress',
    },
  },

  // Content catalog is kept separate from question records so the taxonomy can grow.
  CONTENT: {
    CATALOG_URL: 'data/catalog.json',
    QUESTION_TYPES: ['mcq', 'short-answer', 'structured', 'proof', 'diagram', 'dse-long'],
  },

  // UI Settings
  UI: {
    TOAST_DURATION: 3000, // ms
    MODAL_ANIMATION: 300, // ms
    DEBOUNCE_DELAY: 300, // ms
  },

  // Messages
  MESSAGES: {
    EN: {
      WELCOME: 'Welcome to EAC Education',
      LOGIN_SUCCESS: 'Login successful',
      REGISTER_SUCCESS: 'Account created',
      ANSWER_CORRECT: 'Correct!',
      ANSWER_WRONG: 'Incorrect. Try again.',
      DAILY_LIMIT_REACHED: 'Daily limit reached. Upgrade to continue.',
      STREAK_MAINTAINED: 'Streak maintained!',
      STREAK_BROKEN: 'Streak reset',
    },
    ZH: {
      WELCOME: '歡迎來到 EAC 教育',
      LOGIN_SUCCESS: '登入成功',
      REGISTER_SUCCESS: '帳戶已建立',
      ANSWER_CORRECT: '正確！',
      ANSWER_WRONG: '不對，請重試。',
      DAILY_LIMIT_REACHED: '已達到每日限制。升級以繼續。',
      STREAK_MAINTAINED: '連續日數已維持',
      STREAK_BROKEN: '連續日數已重置',
    },
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
