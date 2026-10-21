/* ============================================================================
   EAC EDUCATION - GAMIFICATION
   gamification.js - Streak tracking, achievements, and game mechanics
   ============================================================================ */

const Gamification = {
  // Update streak after answering question
  updateStreak: function(user, isCorrect) {
    if (!user || !user.progress || !user.progress.streak) {
      return false;
    }

    const today = new Date().toDateString();
    const lastDate = user.progress.streak.lastActivityDate;

    // A streak measures days spent practising, including mistakes and self-review.
    if (today === lastDate) return true;
    const yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toDateString();
    user.progress.streak.current = lastDate===yesterday ? user.progress.streak.current+1 : 1;
    user.progress.streak.longest = Math.max(user.progress.streak.longest, user.progress.streak.current);
    user.progress.streak.lastActivityDate = today;
    return true;
  },

  // Check daily limit for free users
  canAttemptQuestion: function(user) {
    if (!user) return false;

    // Premium users have unlimited
    if (user.plan === 'premium') return true;

    // Check daily limit
    const today = new Date().toDateString();
    if (user.progress.lastReset !== today) {
      user.progress.questionsCompletedToday = 0;
      user.progress.lastReset = today;
    }

    return user.progress.questionsCompletedToday < user.progress.dailyLimit;
  },

  // Increment questions completed today
  incrementDailyCount: function(user) {
    if (!user) return false;

    const today = new Date().toDateString();
    if (user.progress.lastReset !== today) {
      user.progress.questionsCompletedToday = 0;
      user.progress.lastReset = today;
    }

    user.progress.questionsCompletedToday++;
    return true;
  },

  // Get remaining questions for today
  getDailyRemaining: function(user) {
    if (!user) return 0;
    if (user.plan === 'premium') return 999;

    const today = new Date().toDateString();
    if (user.progress.lastReset !== today) {
      return user.progress.dailyLimit;
    }

    return Math.max(0, user.progress.dailyLimit - user.progress.questionsCompletedToday);
  },

  // Check and unlock achievements
  checkAchievements: function(user) {
    if (!user || !user.achievements) return [];

    const newAchievements = [];
    const unlocked = user.achievements.unlocked || [];

    // First Step - Attempt first question
    if (user.progress.totalQuestionsAttempted >= 1 && !unlocked.includes('first-step')) {
      newAchievements.push('first-step');
      unlocked.push('first-step');
    }

    // Momentum - 5-day streak
    if (user.progress.streak.current >= 5 && !unlocked.includes('momentum')) {
      newAchievements.push('momentum');
      unlocked.push('momentum');
    }

    // Excellence - 10 consecutive correct
    if (user.progress.correctAnswers >= 10 && !unlocked.includes('excellence')) {
      newAchievements.push('excellence');
      unlocked.push('excellence');
    }

    // Master - 50 questions
    if (user.progress.totalQuestionsAttempted >= 50 && !unlocked.includes('master')) {
      newAchievements.push('master');
      unlocked.push('master');
    }

    // Expert - 100 questions
    if (user.progress.totalQuestionsAttempted >= 100 && !unlocked.includes('expert')) {
      newAchievements.push('expert');
      unlocked.push('expert');
    }

    user.achievements.unlocked = unlocked;
    return newAchievements;
  },

  // Get current streak status
  getStreakStatus: function(user) {
    if (!user || !user.progress) return null;

    const streak = user.progress.streak;
    const today = new Date().toDateString();
    const isStreakActive = streak.lastActivityDate === today ||
                          streak.lastActivityDate === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();

    return {
      current: streak.current,
      longest: streak.longest,
      isActive: isStreakActive && streak.current > 0,
      lastActivityDate: streak.lastActivityDate,
    };
  },

  // Calculate accuracy percentage
  getAccuracy: function(user) {
    if (!user || !user.progress) return 0;
    if (user.progress.totalQuestionsAttempted === 0) return 0;

    const attempts = user.progress.autoAttempted ?? user.progress.totalQuestionsAttempted;
    const correct = user.progress.autoCorrect ?? user.progress.correctAnswers;
    return attempts ? Math.round((correct / attempts) * 100) : 0;
  },

  // Get statistics for dashboard
  getStats: function(user) {
    if (!user) return null;

    return {
      totalAttempted: user.progress.totalQuestionsAttempted || 0,
      totalCorrect: user.progress.correctAnswers || 0,
      accuracy: this.getAccuracy(user),
      streak: this.getStreakStatus(user),
      dailyRemaining: this.getDailyRemaining(user),
      achievements: user.achievements.unlocked || [],
    };
  },

  // Reset daily count (called at midnight)
  resetDaily: function(user) {
    if (!user) return false;

    const today = new Date().toDateString();
    user.progress.questionsCompletedToday = 0;
    user.progress.lastReset = today;

    // Check if streak should be reset
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();
    if (user.progress.streak.lastActivityDate !== yesterday &&
        user.progress.streak.lastActivityDate !== today) {
      user.progress.streak.current = 0;
    }

    return true;
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Gamification;
}
