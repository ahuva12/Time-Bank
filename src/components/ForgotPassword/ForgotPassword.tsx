'use client';
import { useState, useRef } from 'react';
import styles from './ForgotPassword.module.css';
import { ResetPassword, ErrorMessage, MiniLoader } from '@/components';
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
    const [isLoader, setIsLoader] = useState(false);

    const sendEmailToResetPassword = async (email:string) => {
    try {
        const fetchedUser = await getUserByEmail(email);
        if (fetchedUser.length === 0) {
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
        setError('catch');
    }
    }

    const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            setIsLoader(true);
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
            await sendEmailToResetPassword(email); 
            dateSendEmailRef.current = new Date; 
            setIsTempPassword(true);   
        } catch(error) {
            setError('catch');
        } finally {
            setIsLoader(false);
        }
    };

    const handleResetCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        try {
            setIsLoader(true);
            event.preventDefault();
            const dateSubmitResetCode = new Date;
            const fiveMinutesInMs = 5 * 60 * 1000;
            if (dateSendEmailRef.current && dateSubmitResetCode.getTime() - dateSendEmailRef.current.getTime() > fiveMinutesInMs) {
                setError('overTime');
                return;
            }
            const form = event.target as HTMLFormElement;
            const resetCodeUserEntered = Number((form.elements.namedItem('password') as HTMLInputElement).value);
            if (resetCodeUserEntered !== resetCodeRef.current) {
                setError('codeUncorrect');
                return;
            } else {
                setIsResetPassword(true);
            }
        } catch(error) {
            setError('catch');
        } finally {
            setIsLoader(false);
        }
    };

    const sendResetCodeAgain = async () => {
        try {
            setIsLoader(true);
            await sendEmailToResetPassword(user?.email as string);
        } catch(error) {
            setError('catch');
        } finally {
            setIsLoader(false);
        }
    }

    if (error) {
        let message_line1='';
        let message_line2='';
        const onOkClick = () => {
            setIsTempPassword(false);
            setError(null)
        };
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
            onOkClick={onOkClick}
          />
        );
      }

    return isResetPassword && user ? (
            <ResetPassword user={user} 
                            onClose={onClose}
            />
        ) : (
            <div className={styles.ForgotPassword}>
                <div onClick={onClose}>&times;</div>
                <h1>איפוס סיסמא</h1> 
                {isLoader && (
                <div className={styles.loader}>
                <MiniLoader />
                </div>
                )}   
                <form className={styles.formEmail} onSubmit={handleEmailSubmit}>
                    <input
                        id="email"
                        type="email"
                        placeholder="הכנס כתובת מייל"
                        required
                    />
                    <button type="submit">שלח קוד לאיפוס סיסמא</button>
                </form>
                {isTempPassword && 
                    <>
                        <form onSubmit={handleResetCodeSubmit}>
                        <label htmlFor="password">קוד אימות:</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="הזן קוד אימות"
                            required
                        />
                        <button type="submit">אפס סיסמא</button>
                        </form>
                        <button className={styles.noSendButton} onClick={sendResetCodeAgain}>לא קיבלתי. שלח שוב</button>
                    </>
                }
            </div>
        );
};

export default ForgotPassword;
