"use client";
import { useState, FormEvent } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/authStore";
import Styles from "./Login.module.css";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from "@/validations/validationsClient/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/services/users";

interface LoginProps {
  closePopup: () => void;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type LoginFormFileds = {
  email: string;
  password: string;
};

const Login: React.FC<LoginProps> = ({ closePopup, setIsRegisterOpen }) => {
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  // const setUser = useUserStore((state) => state.setUser);
  const { setUser } = useUserStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFileds>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFileds> = async (
    data: LoginFormFileds
  ) => {
    try {
      const user = await loginUser(data.email, data.password);
      console.log(user);
      setUser(user);
      login();
      closePopup();
      router.push("home");
    } catch (error: any) {
      console.log(error);
      setError(error.data?.message || "An error occurred");
    }
  };

  const goRegister = () => {
    closePopup();
    setIsRegisterOpen(true);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.closeButton} onClick={closePopup}>
        &times;
      </div>
      <div className={Styles.heading}>התחברות</div>
      <form onSubmit={handleSubmit(onSubmit)} className={Styles.form}>
        <div className={Styles.fieldContainer}>
          <input
            className={Styles.input}
            id="email"
            type="email"
            placeholder="אמייל"
            {...register("email")}
          />
          {errors.email && (
            <p className={Styles.errorMessage}>
              {String(errors.email.message)}
            </p>
          )}
        </div>
        <div className={Styles.fieldContainer}>
          <input
            className={Styles.input}
            id="password"
            type="password"
            placeholder="סיסמא"
            {...register("password")}
          />
          {errors.password && (
            <p className={Styles.errorMessage}>
              {String(errors.password.message)}
            </p>
          )}
        </div>
        <input className={Styles.loginButton} type="submit" value="כניסה" />
      </form>
      <div className={Styles.socialAccountContainer}>
        <span className={Styles.title}>או התחבר עם</span>
        <div className={Styles.socialAccounts}>
          <button className={Styles.socialButton}>
            <svg
              viewBox="0 0 488 512"
              height="1em"
              xmlns="http://www.w3.org/2000/svg"
              className={Styles.svg}
            >
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
          </button>
        </div>
      </div>
      <span className={Styles.agreement}>
        <a onClick={goRegister}>אין לך חשבון? הירשם</a>
      </span>
    </div>
  );
};

export default Login;
