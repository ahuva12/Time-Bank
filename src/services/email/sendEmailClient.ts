//send email
// export const postActivity = async (newActivity) => {
//     try {
//       // console.log(newActivity)
//       const response = await http.post('/activities', {...newActivity, status: 'proposed', receiverId: null});

//       if (response.status !== 201)
//         throw new Error(`${response.status}: error posting activitiy`);

//       return response.data;
//     } catch (error: any) {
//       console.error('Error posting activitiy:', error);
//       throw new Error(`'Error posting activitiy: ${error.message}`);
//     }
// };

// const mailOptions = {
//     from: fromEmail, 
//     to: toEmail, 
//     subject: subjectEmail, 
//     text: textEmail,
//   };
