/* ============================================================================
   EAC EDUCATION - QUESTION ENGINE
   question-engine.js - Core question display and validation logic
   ============================================================================ */

const QuestionEngine = {
  questions: [],
  filteredQuestions: [],
  currentIndex: 0,
  currentQuestion: null,
  currentTopic: null,
  currentCategory: null,
  currentDifficulty: null,

  // Initialize with questions data
  init: function(questionsData) {
    this.questions = questionsData.topics || [];
    return true;
  },

  // Filter questions by topic, category, and difficulty
  filterQuestions: function(topicId, categoryType, difficulty) {
    this.currentTopic = topicId;
    this.currentCategory = categoryType;
    this.currentDifficulty = difficulty;
    this.currentIndex = 0;

    // Find topic
    const topic = this.questions.find(t => t.id === topicId);
    if (!topic) {
      console.error('Topic not found:', topicId);
      this.filteredQuestions = [];
      return [];
    }

    // Find category
    const category = topic.categories.find(c => c.type === categoryType);
    if (!category) {
      console.error('Category not found:', categoryType);
      this.filteredQuestions = [];
      return [];
    }

    // Filter by difficulty
    this.filteredQuestions = category.questions.filter(q => q.difficulty === difficulty);

    console.log(`Loaded ${this.filteredQuestions.length} questions for ${topicId}/${categoryType}/${difficulty}`);
    return this.filteredQuestions;
  },

  // Get next question
  getNextQuestion: function() {
    if (this.currentIndex >= this.filteredQuestions.length) {
      return null; // No more questions
    }

    this.currentQuestion = this.filteredQuestions[this.currentIndex];
    this.currentIndex++;
    return this.currentQuestion;
  },

  // Get current question
  getCurrentQuestion: function() {
    return this.currentQuestion;
  },

  // Validate user's answer
  validateAnswer: function(userAnswer) {
    if (!this.currentQuestion) return false;
    return userAnswer === this.currentQuestion.answer;
  },

  // Get hint for current question
  getHint: function() {
    if (!this.currentQuestion) return null;
    return this.currentQuestion.hint || 'No hint available';
  },

  // Get solution for current question
  getSolution: function() {
    if (!this.currentQuestion) return null;
    return this.currentQuestion.solution || 'No solution available';
  },

  // Get question count for this filter
  getQuestionCount: function() {
    return this.filteredQuestions.length;
  },

  // Get progress through current set
  getProgress: function() {
    return {
      current: this.currentIndex,
      total: this.filteredQuestions.length,
      percentage: Math.round((this.currentIndex / this.filteredQuestions.length) * 100),
    };
  },

  // Reset to beginning
  reset: function() {
    this.currentIndex = 0;
    this.currentQuestion = null;
  },

  // Search questions by text
  searchQuestions: function(query) {
    if (!query || !this.filteredQuestions) return [];
    const lowerQuery = query.toLowerCase();
    return this.filteredQuestions.filter(q =>
      q.stem.toLowerCase().includes(lowerQuery) ||
      q.solution.toLowerCase().includes(lowerQuery)
    );
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionEngine;
}
