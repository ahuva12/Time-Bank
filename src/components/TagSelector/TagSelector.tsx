"use client";

import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


interface TagSelectorProps {
    existingTags: string[];
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
    existingTags,
    tags,
    onTagsChange,
}) => {
    const [selectedTags, setSelectedTags] = useState<string[]>(tags);
    const [inputValue, setInputValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        // Filter suggestions based on input value

        if (value) {
            const suggestions = existingTags.filter(
                (tag) =>
                    tag.toLowerCase().includes(value.toLowerCase()) &&
                    !selectedTags.includes(tag)
            );
            setFilteredSuggestions(suggestions);
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleAddTag = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            const newTags = [...selectedTags, tag];
            setSelectedTags(newTags);
            onTagsChange(newTags);
        }
        setInputValue("");
        setFilteredSuggestions([]);
    };

    const handleRemoveTag = (tag: string) => {
        const newTags = selectedTags.filter((t) => t !== tag);
        console.log(newTags);
        setSelectedTags(newTags);
        onTagsChange(newTags);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const tag = (event.currentTarget.value || "").trim();
        console.log(tag);
        if (event.key === "Enter" && tag) {
            console.log("Enter");
            event.preventDefault();
            handleAddTag(inputValue.trim());
            event.currentTarget.value = "";
        } else if (event.key === "Enter" && !tag) {
            console.log("Space");
            event.preventDefault();
        }
    };

    const handleToggleSuggestions = () => {
        if (filteredSuggestions.length > 0) {
            setFilteredSuggestions([]);
        }
        else {
            setFilteredSuggestions(existingTags);
        }
    }

    return (
        <div style={{ maxWidth: "375px", margin: "0" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {selectedTags.map((tag, index) => (
                    <div
                        key={index}
                        style={{
                            padding: "5px 10px",
                            borderRadius: "20px",
                            backgroundColor: "#effdff",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#048ebc",
                            boxShadow: "#cff0ff 0px 10px 10px -5px",
                            border: "2px solid transparent",
                        }}
                    >
                        {tag}
                        <button
                            onClick={() => handleRemoveTag(tag)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#555",
                                fontSize: "18px",
                                fontWeight: "bold",
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "10px", position: "relative" }}>

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    // onClick={() => setFilteredSuggestions(existingTags)}
                    // onBlur={() => setFilteredSuggestions([])}
                    placeholder="הוסף תגיות"
                    style={{
                        width: "85%",
                        background: "white",
                        border: "none",
                        padding: "15px 20px",
                        borderRadius: "20px",
                        boxShadow: "#cff0ff 0px 10px 10px -5px",
                        borderInline: "2px solid transparent",
                        color: "rgb(170, 170, 170)",
                        fontSize: "16px",
                        outline: "none",
                        marginTop: "0.5rem",
                    }}
                />
                <div
                    onClick={handleToggleSuggestions}
                    style={{
                        width: "10%",
                        backgroundColor: "rgb(239, 253, 255)",
                        border: "none",
                        // padding: "15px 20px",
                        borderRadius: "35%",
                        boxShadow: "#cff0ff 0px 10px 10px -5px",
                        borderInline: "2px solid transparent",
                        color: "rgb(170, 170, 170)",
                        fontSize: "16px",
                        outline: "none",
                        marginTop: "0.5rem",
                    }}>{filteredSuggestions ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
                {filteredSuggestions.length > 0 && (
                    <ul
                        style={{
                            margin: 0,
                            padding: "10px",
                            listStyle: "none",
                            position: "absolute",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "20px",
                            zIndex: 1000,
                            width: "100%",
                            maxHeight: "150px",
                            overflowY: "auto",
                            boxShadow: "#cff0ff 0px 10px 10px -5px",
                        }}
                    >
                        {filteredSuggestions.map((tag, index) => (
                            <li
                                key={index}
                                onClick={() => handleAddTag(tag)}
                                style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "10px",
                                    marginBottom: "5px",
                                }}
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TagSelector;
