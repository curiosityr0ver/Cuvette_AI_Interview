import axios from 'axios';



const SERVER_ORIGIN = "";
const SERVER_ORIGIN_DEV = "http://localhost:3000";


const submitQuiz = async (questions, answers) => {
    console.log(SERVER_ORIGIN);
    try {
        console.log('Submitting quiz:', questions, answers);
        const response = await axios.post(`${SERVER_ORIGIN}/quiz/batch`, {
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