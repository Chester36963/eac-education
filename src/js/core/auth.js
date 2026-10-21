/* ============================================================================
   EAC EDUCATION - AUTH SYSTEM
   auth.js - User authentication and session management
   ============================================================================ */

const Auth = {
  // A local study profile is the existing browser record, not a cloud account.
  ensureLocalSession: function() {
    const existing = Storage.getUser();
    if (existing) {
      sessionStorage.setItem('currentUserId', existing.id);
      return existing;
    }
    const result = this.register('preview@example.invalid', crypto.randomUUID(), 'Student');
    return result.success ? result.user : null;
  },
  // Simple hash function for password (client-side)
  hashPassword: function(password) {
    let hash = 0;
    if (password.length === 0) return hash.toString();
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  },

  // Validate email format
  validateEmail: function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate password strength
  validatePassword: function(password) {
    return password.length >= 6;
  },

  // Register new user
  register: function(email, password, username) {
    email = email.trim().toLowerCase();
    username = username.trim();
    // Validation
    if (!this.validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (!this.validatePassword(password)) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    if (!username || username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }

    // The preview supports one profile per browser; never silently overwrite progress.
    const existingUser = Storage.getUser();
    if (existingUser) {
      return { success: false, error: '此瀏覽器已有試用帳戶，請登入或按「直接試用」繼續。' };
    }

    // Create new user object
    const user = {
      id: 'user_' + Date.now() + Math.random().toString(36).substr(2, 9),
      email: email,
      username: username,
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      plan: 'free',
      language: 'en',
      theme: 'light',
      profile: {
        avatar: null,
        bio: '',
      },
      progress: {
        totalQuestionsAttempted: 0,
        correctAnswers: 0,
        accuracy: 0,
        streak: {
          current: 0,
          longest: 0,
          lastActivityDate: null,
        },
        questionsCompletedToday: 0,
        dailyLimit: CONFIG.USER.DAILY_LIMIT_FREE,
        lastReset: new Date().toDateString(),
        byTopic: {},
      },
      achievements: {
        unlocked: [],
        progress: {},
      },
    };

    // Save to storage
    const saved = Storage.saveUser(user);
    if (saved) {
      sessionStorage.setItem('currentUserId', user.id);
      return { success: true, user: user, message: 'Account created successfully' };
    } else {
      return { success: false, error: 'Failed to create account' };
    }
  },

  // Login user
  login: function(email, password) {
    email = email.trim().toLowerCase();
    const user = Storage.getUser();

    if (!user) {
      return { success: false, error: 'User not found. Please register first.' };
    }

    if (user.email.toLowerCase() !== email) {
      return { success: false, error: 'Email not found' };
    }

    const passwordHash = this.hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Incorrect password' };
    }

    // Successful login
    sessionStorage.setItem('currentUserId', user.id);
    return { success: true, user: user, message: 'Login successful' };
  },

  // Logout user
  logout: function() {
    sessionStorage.removeItem('currentUserId');
    return true;
  },

  // Get current logged-in user
  getCurrentUser: function() {
    const userId = sessionStorage.getItem('currentUserId');
    if (!userId) return null;

    const user = Storage.getUser();
    return user && user.id === userId ? user : null;
  },

  // Check if user is authenticated
  isAuthenticated: function() {
    return this.getCurrentUser() !== null;
  },

  // Check if session is still valid
  isSessionValid: function() {
    const user = this.getCurrentUser();
    if (!user || !user.createdAt) return false;

    const createdTime = new Date(user.createdAt).getTime();
    const now = Date.now();
    const sessionAge = now - createdTime;

    return sessionAge < CONFIG.USER.SESSION_TIMEOUT;
  },

  // Update user profile
  updateProfile: function(updates) {
    const user = this.getCurrentUser();
    if (!user) return false;

    Object.assign(user, updates);
    return Storage.saveUser(user);
  },

  // Change password
  changePassword: function(oldPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in' };

    const oldHash = this.hashPassword(oldPassword);
    if (user.passwordHash !== oldHash) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (!this.validatePassword(newPassword)) {
      return { success: false, error: 'New password must be at least 6 characters' };
    }

    user.passwordHash = this.hashPassword(newPassword);
    if (Storage.saveUser(user)) {
      return { success: true, message: 'Password changed successfully' };
    } else {
      return { success: false, error: 'Failed to change password' };
    }
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Auth;
}
