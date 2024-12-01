'use client'
import { useState } from "react";
import { http } from '@/services/http'
import Styles from './Register.module.css'

export default function Register({ closePopup, setIsLoginOpen }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setGender(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await http.post("/register", {
                firstName,
                lastName,
                address,
                gender,
                email,
                phoneNumber,
                birthDate,
                password,
            });
            alert("Registration successful!");
            closePopup();
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    const goLogin = () => {
        closePopup();
        setIsLoginOpen(true); 
      };

    return (
        <form onSubmit={handleSubmit}>
            <div className={Styles.container}>
            <h1 className={Styles.title}>הרשמה</h1>
            <input className={Styles.inputFields}
                type="text"
                placeholder="שם פרטי"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <input className={Styles.inputFields}
                type="text"
                placeholder="שם משפחה"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            <input className={Styles.inputFields}
                type="text"
                placeholder="כתובת"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />
            <input className={Styles.inputFields}
                type="email"
                placeholder="אמייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div className={Styles.selectGender}>
                <label htmlFor="gender" style={{marginLeft: '10px'}}>מגדר</label>
                <select id="gender" value={gender} onChange={handleChange}>
                    <option value="" disabled>
                        -- בחר --
                    </option>
                    <option value="male">זכר</option>
                    <option value="female">נקבה</option>
                </select>
                {/* {gender && <p>You selected: {gender}</p>} */}
            </div>
            <input className={Styles.inputFields}
                type="text"
                placeholder="טלפון"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
            />
            <input className={Styles.inputFields}
                type="date"
                placeholder="תאריך לידה"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
            />
            <input className={Styles.inputFields}
                type="password"
                placeholder="סיסמא"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
            <div className={Styles.innerDiv}>
        <button className={Styles.button} type="submit">הרשמה</button>
        <div style={{marginLeft: '50px'}}>
      <p className={Styles.registerText}>
          כבר חבר?{' '}
          <span
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={goLogin}
          >
            היכנס
          </span>{' '}
          במקום.
        </p>
        </div>
      </div>
            {error && <p>{error}</p>}
        </form>
    );
}
