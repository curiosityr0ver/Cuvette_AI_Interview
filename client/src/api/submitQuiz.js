import axios from 'axios';

const submitQuiz = async (
    recordedBlobs,

) => {
    const formData = new FormData();
    recordedBlobs.forEach((blob, index) => {
        if (blob && blob !== "skipped") {
            formData.append(`question_${index + 1}`, blob, `question_${index + 1}.webm`);
        } else {
            formData.append(`question_${index + 1}`, "skipped");
        }
    });

    try {
        const response = await axios.post('http://localhost:5000/api/evaluation', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Submission successful:', response.data);
    } catch (error) {
        console.error('Error submitting quiz:', error);
    }
};


export default submitQuiz;