import axios from 'axios';

const submitQuiz = async (questions, answers) => {

    try {
        console.log('Submitting quiz:', questions, answers);
        const response = await axios.post('/quiz/batch', {
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


export default submitQuiz;