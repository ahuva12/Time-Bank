'use client';
import { useState, useRef } from 'react';
import styles from './ForgotPassword.module.css';
import { ResetPassword, ErrorMessage } from '@/components';
import { sendEmail } from '@/services/email/sendEmailClient';
import { getUserByEmail } from '@/services/users';
import { User } from '@/types/user';

//errors 

interface ForgotPasswordProps {
    onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
    const [isTempPassword, setIsTempPassword] = useState<boolean>(false);
    const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null); 
    const resetCodeRef = useRef<number>(0); 
    const dateSendEmailRef = useRef<Date | null>(null); 

      const sendEmailToResetPassword = async (email:string) => {
        try {
          const fetchedUser = await getUserByEmail(email);
          if (fetchedUser.length === 0) {
            console.log('the user not found');
            setError('userNotFound')
            return ;
          } else {
            setUser(fetchedUser[0]); 
            const generatedCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            resetCodeRef.current = generatedCode; 
            const bodySendEmail = {
            toEmail: email,
            subjectEmail: 'איפוס סיסמה - בנק הזמן',
            textEmail: `
            <div style="direction: rtl; text-align: right;">
                היי <strong>${fetchedUser[0].firstName}</strong>,<br /><br />
                הנה הקוד שלך לאיפוס סיסמא באתר "בנק הזמן":<br /><br />
                <strong>${generatedCode}</strong><br /><br />
                הקוד תקף ל5 דקות הקרובות<br /><br />
            </div>
            `,
            };    
            await sendEmail(bodySendEmail); 
          }
        } catch(error) {
            console.error(error);
            setError('catch');
        }
      }

    const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
            setIsTempPassword(true);   
            await sendEmailToResetPassword(email); 
            dateSendEmailRef.current = new Date; 
        } catch(error) {
            console.error(error);
            setError('catch');
        }
    };

    const handleResetCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            const dateSubmitResetCode = new Date;
            const fiveMinutesInMs = 5 * 60 * 1000;
            if (dateSendEmailRef.current && dateSubmitResetCode.getTime() - dateSendEmailRef.current.getTime() > fiveMinutesInMs) {
                console.log("עבר יותר מידי זמן מאז ששלחנו את הקוד אימות. נסה שוב");
                setError('overTime');
                return;
            }
            const form = event.target as HTMLFormElement;
            const resetCodeUserEntered = Number((form.elements.namedItem('password') as HTMLInputElement).value);
            if (resetCodeUserEntered !== resetCodeRef.current) {
                console.log('the reset code is uncorrect');
                setError('codeUncorrect');
                return;
            } else {
                setIsResetPassword(true);
            }
        } catch(error) {
            console.error(error);
            setError('catch');
        }
    };

    if (error) {
        let message_line1='';
        let message_line2='';
        switch (error) {
            case 'catch':
                message_line1 = 'אופס... משהו השתבש';
                message_line2 = 'נסה שוב במועד מאוחר יותר';
                break;
            case 'userNotFound':
                message_line1 = 'המייל לא קיים במערכת';
                message_line2 = 'נסה מייל אחר';
                break;
            case 'overTime':
                message_line1 = 'עבר יותר מידי זמן מאז ששלחנו לך את קוד האימות';
                message_line2 = 'נסה שוב';
                break;
            case 'codeUncorrect':
                message_line1 = 'הקוד שגוי';
                message_line2 = 'נסה שוב';
                break;
            }
        return (
          <ErrorMessage
            message_line1={message_line1}
            message_line2={message_line2}
          />
        );
      }

    return isResetPassword && user ? (
            <ResetPassword user={user} 
                            onClose={onClose}
            />
        ) : (
            <div className={styles.ForgotPassword}>
                <h1>איפוס סיסמא</h1>    
                <div onClick={onClose}>X</div>
                <form onSubmit={handleEmailSubmit}>
                    <label htmlFor="email">אימייל:</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="הכנס כתובת מייל"
                        required
                    />
                    <button type="submit">שלח איפוס סיסמא</button>
                </form>
                {isTempPassword && 
                    <div>
                    <form onSubmit={handleResetCodeSubmit}>
                    <label htmlFor="password">קוד איפוס:</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="הכנס קוד איפוס"
                        required
                    />
                    <button type="submit">אפס סיסמא</button>
                    </form>
                    <button type="submit">לא קיבלתי. שלח שוב</button>
                    </div>
                }
            </div>
        );
};

export default ForgotPassword;
