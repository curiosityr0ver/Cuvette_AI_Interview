import axios from 'axios';

const submitQuiz = async (
    questions,
    answers

) => {
    const formData = new FormData();
    formData.append('questions', JSON.stringify(questions));
    formData.append('answers', JSON.stringify(answers));

    try {
        const response = await axios.post('http://localhost:3000/quiz', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Submission successful:', response.data);
        return response;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return error;
    }
};


export default submitQuiz;