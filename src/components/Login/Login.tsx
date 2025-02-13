"use client";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/authStore";
import styles from "./Login.module.css";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from "@/validations/validationsClient/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, getUserByEmail, updateUser } from "@/services/users";
import {
  SuccessMessage,
  MiniLoader,
  ErrorMessage,
  ForgotPassword,
} from "@/components";
import { googleSignIn } from "@/services/auth";
import { baseObjectInputType } from "zod";
interface LoginProps {
  closePopup: () => void;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoginOpen: (value: boolean) => void;
}

type LoginFormFileds = {
  email: string;
  password: string;
};

const Login: React.FC<LoginProps> = ({
  closePopup,
  setIsRegisterOpen,
  setIsLoginOpen,
}) => {
  const { setLogin } = useAuthStore();
  const [errorServer, setErrorServer] = useState(false);
  const [errorUser, setErrorUser] = useState(false);
  const { setUser } = useUserStore();
  const router = useRouter();
  const [isLoader, setIsLoader] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFileds>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFileds> = async (
    data: LoginFormFileds,
    event?: React.BaseSyntheticEvent
  ) => {
    setIsLoader(true);
    try {
      const user = await loginUser(data.email, data.password, false);
      setUser(user);
      setShowSuccessMessage(true);
    } catch (error: any) {
      if (
        error.toString().includes("The password is uncorrect") ||
        error.toString().includes("The user not found")
      ) {
        setErrorUser(true);
      } else {
        setErrorServer(true);
      }
    } finally {
      setIsLoader(false);
    }
  };

  const handleOkClick = () => {
    setIsLoginOpen(false);
    setLogin();
  };

  const goRegister = () => {
    closePopup();
    setIsRegisterOpen(true);
  };

  const handleGoogleLogin = async () => {
    try {
      const data = await googleSignIn();
      setIsLoader(true);
      const user = await getUserByEmail(data.user.email);

      if (user.length === 0) {
        throw new Error("user not found");
      }

      setUser({ ...user[0], photoURL: data.user.photoURL });
      if (!user[0].photoURL) {
        const updatedUserWithPhoto = {
          _id: user[0]._id,
          photoURL: data.user.photoURL,
        };
        await updateUser(updatedUserWithPhoto);
      }
      setShowSuccessMessage(true);
    } catch (error: any) {
      if (error.message.includes("Error updating user")) {
        setShowSuccessMessage(true);
      } else {
        setErrorServer(true);
      }
    } finally {
      setIsLoader(false);
    }
  };

  return isForgotPassword ? (
    <ForgotPassword onClose={() => setIsForgotPassword(false)} />
  ) : (
    <div className={styles.container}>
      <div className={styles.closeButton} onClick={closePopup}>
        &times;
      </div>
      <div className={styles.heading}>התחברות</div>
      {isLoader && (
        <div className={styles.loader}>
          <MiniLoader />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.fieldContainer}>
          <input
            className={styles.input}
            id="email"
            type="email"
            placeholder="אמייל"
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.errorMessage}>
              {String(errors.email.message)}
            </p>
          )}
        </div>
        <div className={styles.fieldContainer}>
          <input
            className={styles.input}
            id="password"
            type="password"
            placeholder="סיסמא"
            {...register("password")}
          />
          {errors.password && (
            <p className={styles.errorMessage}>
              {String(errors.password.message)}
            </p>
          )}
        </div>
        <div className={styles.forgotPassword}>
          <a onClick={() => setIsForgotPassword(true)}>שכחת סיסמא?</a>
        </div>
        <input className={styles.loginButton} type="submit" value="כניסה" />
      </form>
      <div className={styles.socialAccountContainer}>
        <span className={styles.title}>או התחבר עם</span>
        <div className={styles.socialAccounts}>
          <button className={styles.socialButton} onClick={handleGoogleLogin}>
            <svg
              viewBox="0 0 488 512"
              height="1em"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.svg}
            >
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
          </button>
        </div>
      </div>
      <span className={styles.agreement}>
        <a onClick={goRegister}>אין לך חשבון? הירשם</a>
      </span>
      {showSuccessMessage && (
        <SuccessMessage
          message_line1="התחברת בהצלחה!"
          message_line2="כעת תוכל להתחיל לגלוש ולראות מה חדש:)"
          onOkClick={handleOkClick}
        />
      )}
      {errorServer && (
        <ErrorMessage
          message_line1="שגיאה בהתחברות"
          message_line2="נסה שוב בעוד מספר דקות"
          message_line3="או נסה להתחבר עם מייל אחר"
          onOkClick={() => setErrorServer(false)}
        />
      )}
      {errorUser && (
        <ErrorMessage
          message_line1="שם המשתמש או הסיסמא שגויים"
          message_line2="נסה שוב..."
          onOkClick={() => setErrorUser(false)}
        />
      )}
    </div>
  );
};

export default Login;
