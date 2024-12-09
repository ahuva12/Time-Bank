
'use client';
import { useState } from "react";
import useUserStore from "@/store/useUserStore";
import { useAuthStore } from '@/store/authStore';
import Styles from './Login.module.css'
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from '@/validations/validationsClient/user';
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from '@/services/users';
import SuccessMessage from '../SuccessMessage/SuccessMessage'; // Import the SuccessMessage component

interface LoginProps {
  closePopup: () => void;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type LoginFormFields = {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ closePopup, setIsRegisterOpen }) => {
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (data: LoginFormFields) => {
    try {
      const user = await loginUser(data.email, data.password);
      console.log(user)
      setUser(user); 
      login();
      setSuccessMessage("התחברת בהצלחה!"); 
    } catch (error: any) {
      console.log(error)
      setError(error.data?.message || "An error occurred");
    }
  };

  const goRegister = () => {
    closePopup();
    setIsRegisterOpen(true); 
  };

  // Function to handle the OK button click (close the success message and navigate to home)
  const handleOkClick = () => {
    closePopup(); // Close the login popup
    router.push('home'); // Redirect to home page
  };

  return (
    <>
      {successMessage && <SuccessMessage 
        message_line1={successMessage} 
        message_line2="" 
        onOkClick={handleOkClick} 
      />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={Styles.container}>
          <h1 className={Styles.title}>התחברות</h1>
          <input className={Styles.inputFields}
            type="email"
            placeholder="אמייל"
            {...register("email")}
          />
          {errors.email && <p>{String(errors.email.message)}</p>}
          <input className={Styles.inputFields}
            type="password"
            placeholder="סיסמא"
            {...register("password")}
          />
          {errors.password && <p>{String(errors.password.message)}</p>}
          <div className={Styles.innerDiv}>
            <button className={Styles.button} type="submit">כניסה</button>
            <div style={{ marginLeft: '50px' }}>
              <p className={Styles.registerText}>
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
    </>
  );
}

export default Login;
