'use client';
import { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { ResetPassword } from '@/components';

const ForgotPassword = () => {
    const [isTempPassword, setIsTempPassword] = useState<boolean>(false);
    const [isResetPassword, setIsResetPassword] = useState<boolean>(false);

    const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add logic to handle email submission
        const form = event.target as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
        console.log(email); 
        setIsTempPassword(true);   
    };

    const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const resetCode = (form.elements.namedItem('password') as HTMLInputElement).value;
        // Add logic to handle password reset
        //check if the code is that i send to user
        setIsResetPassword(true);
    };

    return isResetPassword ? (
            <ResetPassword/>
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
                    <form onSubmit={handlePasswordSubmit}>
                    <label htmlFor="password">סיסמא חדשה:</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="הכנס סיסמא חדשה"
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
