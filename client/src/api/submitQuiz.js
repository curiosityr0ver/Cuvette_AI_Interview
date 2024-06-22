import axios from 'axios';



const SERVER_ORIGIN = "";
const SERVER_ORIGIN_DEV = "http://localhost:3000";


const submitQuiz = async (questions, answers) => {
    console.log(SERVER_ORIGIN);
    try {
        const zipPairs = questions.map((question, index) => {
            if (answers[index].length < 10) {
                answers[index] = "skipped";
            }
            return { question, answer: answers[index] };
        });

        console.log('Submitting quiz:', questions, answers);
        const response = await axios.post(`${SERVER_ORIGIN}/quiz/dev`, {
            prompt: "\nRate and review each of the answers on a scale of [1-10]\n\nUsing this JSON schema:\n\n  Ratings = {\"rating\": number, \n\"remark\": string }\n\nReturn a `list[Rating]`\n      ",
            payload: zipPairs,
        });
        console.log('Submission successful:', response.data);
        return response;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return error;
    }
};


export default submitQuiz;