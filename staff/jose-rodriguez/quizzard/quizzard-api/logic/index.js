module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    createQuiz: require('./create-quiz'),
    startQuiz: require('./start-quiz'),
    enrollQuiz: require('./enroll-quiz'),
    retrieveQuiz: require('./retrieve-quiz'),
    questionStarted: require('./question-started'),
    enableQuestion: require('./enable-next-question'),
    nextQuestion: require('./next-question'),
    retrieveQuestion: require('./retrieve-question'),
    modifyQuiz: require('./modify-quiz'),
    listQuizs: require('./list-quizs'),
    submitAnswer: require('./submit-answer'),
    retrieveResults: require('./retrieve-results'),
    disableQuestion: require('./disable-question')
}   