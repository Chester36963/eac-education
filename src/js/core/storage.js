/* ============================================================================
   EAC EDUCATION - STORAGE
   storage.js - localStorage wrapper for user data persistence
   ============================================================================ */

const Storage = {
  // Save user object to localStorage
  saveUser: function(user) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
      return true;
    } catch (e) {
      console.error('Error saving user:', e);
      return false;
    }
  },

  // Get user object from localStorage
  getUser: function() {
    try {
      const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error getting user:', e);
      return null;
    }
  },

  // Clear user data
  clearUser: function() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION);
      return true;
    } catch (e) {
      console.error('Error clearing user:', e);
      return false;
    }
  },

  // Save preferences
  savePreferences: function(prefs) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
      return true;
    } catch (e) {
      console.error('Error saving preferences:', e);
      return false;
    }
  },

  // Get preferences
  getPreferences: function() {
    try {
      const prefs = localStorage.getItem(CONFIG.STORAGE_KEYS.PREFERENCES);
      return prefs ? JSON.parse(prefs) : {
        language: 'en',
        theme: 'light',
      };
    } catch (e) {
      console.error('Error getting preferences:', e);
      return { language: 'en', theme: 'light' };
    }
  },

  // Save progress for a specific question
  saveQuestion: function(topicId, categoryType, difficulty, questionId, isCorrect) {
    try {
      const user = this.getUser();
      if (!user) return false;

      // Initialize progress structure if needed
      if (!user.progress) user.progress = {};
      if (!user.progress.byTopic) user.progress.byTopic = {};
      if (!user.progress.byTopic[topicId]) user.progress.byTopic[topicId] = {};
      if (!user.progress.byTopic[topicId][categoryType]) {
        user.progress.byTopic[topicId][categoryType] = {};
      }
      if (!user.progress.byTopic[topicId][categoryType][difficulty]) {
        user.progress.byTopic[topicId][categoryType][difficulty] = {
          attempted: 0,
          correct: 0,
          completed: [],
        };
      }

      const category = user.progress.byTopic[topicId][categoryType][difficulty];
      category.attempted++;
      if (isCorrect) category.correct++;
      if (!category.completed.includes(questionId)) {
        category.completed.push(questionId);
      }

      // Update overall progress
      user.progress.totalQuestionsAttempted = (user.progress.totalQuestionsAttempted || 0) + 1;
      user.progress.correctAnswers = (user.progress.correctAnswers || 0) + (isCorrect ? 1 : 0);
      user.progress.accuracy = user.progress.correctAnswers / user.progress.totalQuestionsAttempted;

      return this.saveUser(user);
    } catch (e) {
      console.error('Error saving question progress:', e);
      return false;
    }
  },

  // Get completion status for a specific category
  getProgress: function(topicId, categoryType, difficulty) {
    try {
      const user = this.getUser();
      if (!user || !user.progress || !user.progress.byTopic) return null;

      const path = user.progress.byTopic[topicId]?.[categoryType]?.[difficulty];
      return path || { attempted: 0, correct: 0, completed: [] };
    } catch (e) {
      console.error('Error getting progress:', e);
      return null;
    }
  },

  // Clear all data (for testing)
  clearAll: function() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing storage:', e);
      return false;
    }
  },

  // Check if user data exists
  hasUser: function() {
    return this.getUser() !== null;
  },

  // Get storage size estimate
  getStorageSize: function() {
    try {
      const user = JSON.stringify(this.getUser() || {});
      const prefs = JSON.stringify(this.getPreferences());
      return (user.length + prefs.length) / 1024; // KB
    } catch (e) {
      return 0;
    }
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}
