'use client';
import { useState, FormEvent  } from "react";
import useUserStore from "@/store/useUserStore";
import { useAuthStore } from '@/store/authStore';
import Styles from './Login.module.css'
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler} from "react-hook-form";
import { loginSchema } from '@/validations/validationsClient/user';
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from '@/services/users';

interface LoginProps {
  closePopup: () => void;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type LoginFormFileds = {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ closePopup, setIsRegisterOpen }) => {
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFileds>({
      resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFileds> = async (data:LoginFormFileds) => {
    try {
      const user = await loginUser(data.email, data.password);
      console.log(user)
      setUser(user); 
      login();
      closePopup();
      router.push('home'); 
    } catch (error:any) {
      console.log(error)
      setError(error.data?.message || "An error occurred");
    }
  };

  const goRegister = () => {
    closePopup();
    setIsRegisterOpen(true); 
  };

  return (
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
        <div style={{marginLeft: '50px'}}>
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
  );
}

export default Login;