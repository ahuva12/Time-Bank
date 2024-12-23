"use client";
import { useState } from "react";
import { http } from "@/services/http";
import styles from "./Register.module.css";
import { useRouter } from "next/navigation";
import { userSchema } from "@/validations/validationsClient/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, } from "react-hook-form";
import { registerUser } from "@/services/users";
import { User } from "@/types/user";
import { SuccessMessage, MiniLoader , ErrorMessage } from "@/components";

interface RegisterProps {
  closePopup: () => void;
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegisterProps> = ({ closePopup, setIsLoginOpen }) => {
  const [successMessage, setSuccessMessage] = useState<string>(""); 
  const [errorServer, setErrorServer] = useState(false);
  const [errorUser, setErrorUser] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (data: User) => {
    setIsLoader(true);
    try {
      const response = await registerUser(data);
      setSuccessMessage("ההרשמה בוצעה בהצלחה!"); 
    } catch (error: any) {
      if (error.toString().includes("User already exists")) {
        setErrorUser(true);
      } else {
        setErrorServer(true)
      }
    } finally {
      setIsLoader(false);
    }
  };

  const goLogin = () => {
    closePopup();
    setIsLoginOpen(true);
  };

  const handleOkClick = () => {
    closePopup(); 
    router.push("home"); 
  };

  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

  const handleAddressInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value;
    if (input.length > 2) {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            input
          )}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
        );
        const data = await response.json();
        setAddressSuggestions(
          data.features.map((feature: any) => feature.properties.formatted)
        );
      } catch (err) {
        console.error("Error fetching address suggestions:", err);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAddressSuggestions([]);
    setValue("address", suggestion);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.closeButton} onClick={closePopup}>
          &times;
        </div>
        <div className={styles.heading}>הרשמה</div>
        {isLoader && (
        <div className={styles.loader}>
          <MiniLoader />
        </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.fieldContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder="שם פרטי"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className={styles.errorMessage}>{errors.firstName.message}</p>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder="שם משפחה"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className={styles.errorMessage}>{errors.lastName.message}</p>
            )}
          </div>
          <div className={styles.fieldContainer}  style={{ position: "relative" }}>
            <input
              className={styles.input}
              type="text"
              placeholder="כתובת"
              {...register("address", {
                onChange: (e) => {
                  handleAddressInputChange(e);
                },
              })}
            />
            {errors.address && (
              <p className={styles.errorMessage}>{errors.address.message}</p>
            )}
            {addressSuggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {addressSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <input
              className={styles.input}
              type="email"
              placeholder="אמייל"
              {...register("email")}
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <select
              id="gender"
              className={styles.input}
              {...register("gender")}
            >
              <option value="" disabled selected>
                מגדר
              </option>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
            {errors.gender && (
              <p className={styles.errorMessage}>{errors.gender.message}</p>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder="טלפון"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className={styles.errorMessage}>
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <input
              className={styles.input}
              type="date"
              {...register("dateOfBirth")}
            />
            {errors.dateOfBirth && (
              <p className={styles.errorMessage}>
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <input
              className={styles.input}
              type="password"
              placeholder="סיסמא"
              {...register("password")}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <input className={styles.loginButton} type="submit" value="הרשמה" />
        </form>

        <span className={styles.agreement}>
          <a onClick={goLogin}>כבר חבר? היכנס</a>
        </span>
      </div>
      {successMessage && (
        <SuccessMessage
          message_line1={successMessage}
          message_line2="כעת תוכל להתחבר ולהתחיל לגלוש:)"
          onOkClick={handleOkClick}
        />
      )}
       {errorServer && (
        <ErrorMessage
          message_line1="אופס... משהו השתבש"
          message_line2="נסה שוב בעוד מספר דקות"
          onOkClick={()=>setErrorServer(false)}
        />
      )}
      {errorUser && (
        <ErrorMessage
          message_line1="המשתמש כבר קיים במערכת"
          message_line2="תוכל לנסות שוב עם כתובת מייל אחרת"
          onOkClick={()=>setErrorUser(false)}
        />
      )}

    </>
  );
};

export default Register;

