'use client';

import React, { use, useState } from 'react';
import styles from './profile.module.css';
import useUserStore from '@/store/useUserStore';
import { User } from '@/types/user';
import { FaEdit } from "react-icons/fa";
import { updateUser } from '@/services/users';

interface EditableFields {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
}

const Profile: React.FC = () => {
    const { user, setUser } = useUserStore();
    console.log(user);
    const [isEditing, setIsEditing] = useState({
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
        address: false
    });
    const [editableFields, setEditableFields] = useState<EditableFields>({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
    });
    const fieldMappings: { [key in keyof EditableFields]: string } = {
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        email: "אימייל",
        phoneNumber: "טלפון",
        address: "כתובת",
    };

    const renderField = (
        field: keyof EditableFields,
        isEditing: { [key: string]: boolean },
        editableFields: EditableFields,
        user: EditableFields,
        handleEditClick: (field: keyof EditableFields) => void,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof EditableFields) => void,
        handleBlur: (field: keyof EditableFields) => void,
        handleUpdate: (field: keyof EditableFields) => void
    ) => {

        return (
            <div className={styles.field} key={field}>
                <span className={styles.wrapperRow}>
                    <p className={styles.label}>{fieldMappings[field]}</p>
                    <FaEdit className={styles.editIcon} onClick={() => handleEditClick(field)} />
                </span>
                <div className={styles.wrapperRow}>
                    <input
                        type="text"
                        value={editableFields[field]}
                        onChange={(e) => handleChange(e, field)}
                        onBlur={() => handleBlur(field)}
                        autoFocus
                        className={styles.editInput}
                    />
                    <button className={styles.cancelBtn}>בטל</button>
                    <button
                        className={styles.saveBtn}
                        onClick={(e) => {
                            e.preventDefault();
                            handleUpdate(field);
                        }}
                    >
                        שמור
                    </button>
                </div>
                {/* {isEditing[field] ? (
                    <div className={styles.wrapperRow}>
                        <input
                            type="text"
                            value={editableFields[field]}
                            onChange={(e) => handleChange(e, field)}
                            onBlur={() => handleBlur(field)}
                            autoFocus
                            className={styles.editInput}
                        />
                        <button className={styles.cancelBtn}>בטל</button>
                        <button
                            className={styles.saveBtn}
                            onClick={(e) => {
                                e.preventDefault();
                                handleUpdate(field);
                            }}
                        >
                            שמור
                        </button>
                    </div>
                ) : (
                    <div className={styles.beforeEdit}>
                        {user[field]}
                    </div>
                )} */}
            </div>
        );
    };


    const handleEditClick = (field: keyof EditableFields) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
        setEditableFields((prev) => ({ ...prev, [field]: user[field] })); // Set initial value for editing
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof EditableFields) => {
        setEditableFields((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleBlur = (field: keyof EditableFields) => {
        setIsEditing((prev) => ({ ...prev, [field]: false }));
    };

    const handleUpdate = async (field: keyof EditableFields) => {
        // Update Zustand store
        console.log("here");
        const updatedUser = { ...user, [field]: editableFields[field as keyof EditableFields] };
        // const updatedUser = { ...user, [field]: editableFields[field] };
        setTimeout(() => {
            setUser(updatedUser);
        }, 0);
        // setUser(updatedUser); // Zustand method to set user state
        // console.log(updatedUser);

        try {
            const data = await updateUser(updatedUser);
            // setUser(data.updatedUser); // Update Zustand with the latest user data
            setTimeout(() => {
                setUser(updatedUser);
            }, 0);

        } catch (error) {
            console.error("Error updating user:", error);
            // Optionally revert Zustand state in case of failure
            setTimeout(() => {
                setUser(user);
            }, 0);
            // setUser(user); // Restore previous state if needed
        }

        // End editing mode
        setIsEditing((prev) => ({ ...prev, [field]: false }));
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.logoContainer}>
                    <div className={styles.logo}></div>
                    <h2 className={styles.welcome}>שלום, {user.firstName}!</h2>
                </div>

                <div className={styles.form}>
                    {/* editable fields */}
                    <div className={styles.column}>
                        <div className={styles.profilePage}>
                            {Object.keys(editableFields).map((field) =>
                                renderField(
                                    field as keyof EditableFields,
                                    isEditing,
                                    editableFields,
                                    user,
                                    handleEditClick,
                                    handleChange,
                                    handleBlur,
                                    handleUpdate
                                )
                            )}
                        </div>

                    </div>

                    {/* wallet stuff */}
                    <div className={styles.column}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>מספר שעות שתרמת</label>
                            <input className={styles.input} type="text" disabled />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>מספר שעות שקיבלת</label>
                            <input className={styles.input} type="text" disabled />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>מספר שעות שאותר לך לקבל</label>
                            <input className={styles.input} type="text" disabled />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
