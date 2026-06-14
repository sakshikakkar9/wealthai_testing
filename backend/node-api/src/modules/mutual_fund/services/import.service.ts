import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const processCAS = async (
    file: Express.Multer.File
) => {

    const formData = new FormData();

    formData.append(
        'file',
        fs.createReadStream(file.path)
    );

    formData.append(
        'provider',
        'cams'
    );

    const response = await axios.post(
        'http://localhost:8000/mf-imports/cas',
        formData,
        {
            headers: formData.getHeaders()
        }
    );

    return response.data;
};