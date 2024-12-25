import { http } from "../http";

type bodySendEmail = {
    toEmail:string;
    subjectEmail:string;
    textEmail:string;
}

//send email
export const sendEmail = async (bodySendEmail:bodySendEmail) => {
    try {
      console.log(bodySendEmail)
      const response = await http.post('/sendEmail', bodySendEmail);

      if (response.status !== 200)
        throw new Error(`${response.status}: Failed to send Email`);

      return response.data;
    } catch (error: any) {
      console.error('Error sending Email:', error);
      throw new Error(`'Error sending Email: ${error.message}`);
    }
};


