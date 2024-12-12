'use client';
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from '@/store/authStore';
import styles from './Login.module.css'
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from '@/validations/validationsClient/user';
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from '@/services/users';
import { SuccessMessage, MiniLoader } from '@/components';

interface LoginProps {
  closePopup: () => void;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoginOpen: (value: boolean) => void;
}

type LoginFormFileds = {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ closePopup, setIsRegisterOpen, setIsLoginOpen }) => {
  const { login } = useAuthStore();
  const { setUser } = useUserStore();
  const [error, setError] = useState("");
  const [isLoader, setIsLoader] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFileds>({
      resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFileds> = async (data: LoginFormFileds, event?: React.BaseSyntheticEvent) => {
    setIsLoader(true);
    try {  
      const user = await loginUser(data.email, data.password);
      console.log(user);
      setUser(user);
      setShowSuccessMessage(true); 
    } catch (error: any) {
      console.log(error);
      setError(error.data?.message || "An error occurred");
    } finally {
      setIsLoader(false);
    }
  };

  const handleOkClick = () => {
    setShowSuccessMessage(false);
    setIsLoginOpen(false)
    login(); 
  };

  const goRegister = () => {
    closePopup();
    setIsRegisterOpen(true); 
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.container}>
        <h1 className={styles.title}>התחברות</h1>
      <input className={styles.inputFields}
        type="email"
        placeholder="אמייל"
        {...register("email")}
      />
      {errors.email && <p>{String(errors.email.message)}</p>}
      <input className={styles.inputFields}
        type="password"
        placeholder="סיסמא"
        {...register("password")}
      />
      {errors.password && <p>{String(errors.password.message)}</p>}
      <div className={styles.innerDiv}>
        <button className={styles.button} type="submit">כניסה</button>
        <div style={{marginLeft: '50px'}}>
      <p className={styles.registerText}>
          אין לך חשבון?{' '}
          <span
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={goRegister}
          >
            הירשם
          </span>{' '}
          במקום.
        </p>
        </div>
      </div>
      {error && <p>{error}</p>}
      </div>
    </form>
    {showSuccessMessage && (
      <SuccessMessage
        message_line1="התחברת בהצלחה!"
        message_line2="מוזמן להתחיל לגלוש ולראות מה חדש:)"
        onOkClick={handleOkClick}
      />
    )}
    {isLoader && (
      <div className={styles.loader}>
          <MiniLoader/>
      </div>
    )}
    </>
  );
}

export default Login;