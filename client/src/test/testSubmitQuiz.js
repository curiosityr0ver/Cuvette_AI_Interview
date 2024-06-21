import axios from 'axios';

const submitQuiz = async (
    questions,
    answers

) => {

    try {
        const response = await axios.post('http://localhost:3000/quiz/batch', {
            questions,
            answers,
        });
        console.log('Submission successful:', response.data);
        return response;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return error;
    }
};
const testSubmitQuiz = async () => {
    // Mock data
    const questions = [
        "What is your name?",
        "How old are you?",
        "What is your favorite programming language?"
    ];

    const answers = [
        "John Doe",
        "25",
        "JavaScript"
    ];

    try {
        const result = await submitQuiz(questions, answers);
        console.log('Test submission result:', result.data);
    } catch (error) {
        console.error('Test submission error:', error);
    }
};

testSubmitQuiz();
