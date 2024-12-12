"use client";

import React, { useState } from "react";

interface TagSelectorProps {
    existingTags: string[];
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ existingTags, tags, onTagsChange }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>(tags);
    const [inputValue, setInputValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        // Filter suggestions based on input value
        if (value) {
            const suggestions = existingTags.filter(
                (tag) => tag.toLowerCase().includes(value.toLowerCase()) && !selectedTags.includes(tag)
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
        setSelectedTags(newTags);
        onTagsChange(newTags);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputValue.trim()) {
            handleAddTag(inputValue.trim());
        }
    };

    return (
        <div style={{ /* width: "100%", */ maxWidth: "375px", margin: "0 auto" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {selectedTags.map((tag, index) => (
                    <div
                        key={index}
                        style={{

                            // padding: 2px 4px;
                            // margin-left: 5px;
                            // font-size: 15px;
                            // margin-top: 5px;

                            padding: "5px 10px",
                            borderRadius: "5px",
                            backgroundColor: "#effdff",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#048ebc",

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
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            {/* <div style={{ marginTop: "10px", position: "relative" }}> */}
            <div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="הוסף תגיות"
                    style={{
                        // width: "100%",
                        // padding: "8px",
                        // borderRadius: "4px",
                        // border: "1px solid #ddd",
                        width: "375px",
                        height: "50px",
                        alignSelf: "center",
                        backgroundColor: "#e0f5f8",
                        borderBottom: "2px solid #048ebc",
                        marginTop: "0.5rem",
                    }}
                />

                {filteredSuggestions.length > 0 && (
                    <ul
                        style={{
                            margin: 0,
                            padding: "10px",
                            listStyle: "none",
                            position: "absolute",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            zIndex: 1000,
                            width: "100%",
                            maxHeight: "150px",
                            overflowY: "auto",
                        }}
                    >
                        {filteredSuggestions.map((tag, index) => (
                            <li
                                key={index}
                                onClick={() => handleAddTag(tag)}
                                style={{
                                    padding: "5px",
                                    cursor: "pointer",
                                    backgroundColor: "#f9f9f9",
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
