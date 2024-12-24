'use client';
import { useState, useRef } from 'react';
import styles from './ForgotPassword.module.css';
import { ResetPassword } from '@/components';
import { sendEmail } from '@/services/email/sendEmailClient';
import { getUserByEmail } from '@/services/users';
import { User } from '@/types/user';

//timer of 5 minutes
//errors 
//x to close the popup

interface ForgotPasswordProps {
    onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
    const [isTempPassword, setIsTempPassword] = useState<boolean>(false);
    const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null); 
    const resetCodeRef = useRef<number>(0); 
    const dateSendEmailRef = useRef<Date | null>(null); 

      const sendEmailToResetPassword = async (email:string) => {
        try {
          const fetchedUser = await getUserByEmail(email);
          if (fetchedUser.length === 0) {
            console.log('the user not found');
            return 'the user not found';
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
          console.error(error)
        }
      }

    const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
            await sendEmailToResetPassword(email); 
            dateSendEmailRef.current = new Date; 
            setIsTempPassword(true);   
        } catch(error) {
            console.error(error)
        }
    };

    const handleResetCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            //check timer
            const dateSubmitResetCode = new Date;
            const fiveMinutesInMs = 5 * 60 * 1000;
            if (dateSendEmailRef.current && dateSubmitResetCode.getTime() - dateSendEmailRef.current.getTime() > fiveMinutesInMs) {
                console.log("עבר יותר מידי זמן מאז ששלחנו את הקוד אימות. נסה שוב");
                return;
            }
            const form = event.target as HTMLFormElement;
            const resetCodeUserEntered = Number((form.elements.namedItem('password') as HTMLInputElement).value);
            if (resetCodeUserEntered !== resetCodeRef.current) {
                console.log('the reset code is uncorrect');
                return 'the reset code is uncorrect';
            } else {
                setIsResetPassword(true);
            }
        } catch(error) {
            console.error(error)
        }
    };

    return isResetPassword && user ? (
            <ResetPassword user={user} 
                            onClose={onClose}
            />
        ) : (
            <div className={styles.ForgotPassword}>
                <h1>איפוס סיסמא</h1>          
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
