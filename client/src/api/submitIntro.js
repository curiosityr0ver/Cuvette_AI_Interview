import axios from 'axios';


const ENV = import.meta.VITE_ENV || "development";
const SERVER_ORIGIN = ENV === "development" ? "http://localhost:3000" : "";

const submitIntro = async (formData) => {

    try {
        const response = await axios.post('/intro', formData, {
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