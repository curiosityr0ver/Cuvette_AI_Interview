import axios from 'axios';

const submitIntro = async (formData) => {

    try {
        const response = await axios.post('http://localhost:3000/intro', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return error;
    }
};


export default submitIntro;