"use client";
import { useState } from "react";
import { http } from "@/services/http";
import Styles from "./Register.module.css";
import { useRouter } from "next/navigation";
import { userSchema } from "@/validations/validationsClient/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { registerUser } from "@/services/users";
import { User } from "@/types/user";
import SuccessMessage from "../SuccessMessage/SuccessMessage";

interface RegisterProps {
  closePopup: () => void;
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegisterProps> = ({ closePopup, setIsLoginOpen }) => {
  const [successMessage, setSuccessMessage] = useState<string>(""); // State for success message
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (data: User) => {
    try {
      const response = await registerUser(data);
      setSuccessMessage("ההרשמה בוצעה בהצלחה!"); // Set success message
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
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
  };

  return (
    <>
      {successMessage && (
        <SuccessMessage
          message_line1={successMessage}
          message_line2=""
          onOkClick={handleOkClick}
        />
      )}

      <div className={Styles.container}>
        <div className={Styles.closeButton} onClick={closePopup}>
          &times;
        </div>
        <div className={Styles.heading}>הרשמה</div>
        <form onSubmit={handleSubmit(onSubmit)} className={Styles.form}>
          <div className={Styles.fieldContainer}>
            <input
              className={Styles.input}
              type="text"
              placeholder="שם פרטי"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className={Styles.errorMessage}>{errors.firstName.message}</p>
            )}
          </div>
          <div className={Styles.fieldContainer}>
            <input
              className={Styles.input}
              type="text"
              placeholder="שם משפחה"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className={Styles.errorMessage}>{errors.lastName.message}</p>
            )}
          </div>
          <div className={Styles.fieldContainer}>
            <input
              className={Styles.input}
              type="text"
              placeholder="כתובת"
              {...register("address", {
                onChange: (e) => {
                  handleAddressInputChange(e);
                },
              })}
            />
            {errors.address && (
              <p className={Styles.errorMessage}>{errors.address.message}</p>
            )}
            {addressSuggestions.length > 0 && (
              <ul className={Styles.suggestions}>
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
          <div className={Styles.fieldContainer}>
            <input
              className={Styles.input}
              type="email"
              placeholder="אמייל"
              {...register("email")}
            />
            {errors.email && (
              <p className={Styles.errorMessage}>{errors.email.message}</p>
            )}
          </div>
          <div className={Styles.fieldContainer}>
            <select
              id="gender"
              className={Styles.input}
              {...register("gender")}
            >
              <option value="" disabled selected>
                מגדר
              </option>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
            {errors.gender && (
              <p className={Styles.errorMessage}>{errors.gender.message}</p>
            )}
          </div>
          <div className={Styles.fieldContainer}>
            <input
              className={Styles.input}
              type="text"
              placeholder="טלפון"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className={Styles.errorMessage}>
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className={Styles.fieldContainer}>
            <input
              className={Styles.input}
              type="date"
              {...register("dateOfBirth")}
            />
            {errors.dateOfBirth && (
              <p className={Styles.errorMessage}>
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div className={Styles.fieldContainer}>
            <input
              className={Styles.input}
              type="password"
              placeholder="סיסמא"
              {...register("password")}
            />
            {errors.password && (
              <p className={Styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>
          <input className={Styles.loginButton} type="submit" value="הרשמה" />
        </form>
        <div className={Styles.socialAccountContainer}>
          <span className={Styles.title}>או הירשם עם</span>
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
          <a onClick={goLogin}>כבר חבר? היכנס</a>
        </span>
      </div>
    </>
  );
};

export default Register;

