'use client'
import { useState } from "react";
import { http } from '@/services/http'

export default function Register({ closePopup }) {
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
            console.log("Before turning to backend")
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
            console.log("After turning to backend")
            alert("Registration successful!");
            closePopup();
        } catch (error) {
            console.log('ERROR')
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div>
                <label htmlFor="gender">Select Gender:</label>
                <select id="gender" value={gender} onChange={handleChange}>
                    <option value="" disabled>
                        -- Select --
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                {/* {gender && <p>You selected: {gender}</p>} */}
            </div>
            <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
            />
            <input
                type="date"
                placeholder="Birth Date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
}
