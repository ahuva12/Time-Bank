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

  // const onSubmit: SubmitHandler<User> = async (data: User) => {
  //   try {
  //   //   const response = await http.post("/register", data);
  //     const response = await registerUser(data);
  //     alert("Registration successful!");
  //     closePopup();
  //     router.push('home');
  //   } catch (error: any) {
  //     setError(error.response?.data?.message || "An error occurred");
  //   }
  // };
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
    closePopup(); // Close the register popup
    router.push('home'); // Redirect to home page
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={Styles.container}>
          <h1 className={Styles.title}>הרשמה</h1>
          <input
            className={Styles.inputFields}
            type="text"
            placeholder="שם פרטי"
            {...register("firstName")}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}

          <input
            className={Styles.inputFields}
            type="text"
            placeholder="שם משפחה"
            {...register("lastName")}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}

          <input
            className={Styles.inputFields}
            type="text"
            placeholder="כתובת"
            {...register("address")}
          />
          {errors.address && <p>{errors.address.message}</p>}

          <input
            className={Styles.inputFields}
            type="email"
            placeholder="אמייל"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}

          <div className={Styles.selectGender}>
            <label htmlFor="gender" style={{ marginLeft: "10px" }}>
              מגדר
            </label>
            <select id="gender" {...register("gender")}>
              <option value="" disabled>
                -- בחר --
              </option>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
            {errors.gender && <p>{errors.gender.message}</p>}
          </div>

          <input
            className={Styles.inputFields}
            type="text"
            placeholder="טלפון"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}

          <input
            className={Styles.inputFields}
            type="date"
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && <p>{errors.dateOfBirth.message}</p>}

          <input
            className={Styles.inputFields}
            type="password"
            placeholder="סיסמא"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div className={Styles.innerDiv}>
          <button className={Styles.button} type="submit">
            הרשמה
          </button>
          <div style={{ marginLeft: "50px" }}>
            <p className={Styles.loginText}>
              כבר חבר?{" "}
              <span
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={goLogin}
              >
                היכנס
              </span>{" "}
              במקום.
            </p>
          </div>
        </div>

        {error && <p>{error}</p>}
      </form>
    </>
  );
};

export default Register;
