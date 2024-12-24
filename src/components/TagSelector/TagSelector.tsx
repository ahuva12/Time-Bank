"use client";

import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./TagSelector.module.css"; // הייבוא של ה-CSS Module

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
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false); // מצב גלילת התגים

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
    setIsSuggestionsOpen(false); // סגירת הגלילה לאחר הוספת תג
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    onTagsChange(newTags);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const tag = (event.currentTarget.value || "").trim();
    if (event.key === "Enter" && tag) {
      event.preventDefault();
      handleAddTag(inputValue.trim());
      event.currentTarget.value = "";
    } else if (event.key === "Enter" && !tag) {
      event.preventDefault();
    }
  };

  const handleToggleSuggestions = () => {
    setIsSuggestionsOpen((prevState) => !prevState); // הפיכת מצב גלילת התגים
    if (!isSuggestionsOpen) {
      // אם הגלילה לא פתוחה, נבצע חיפוש מחדש של תגים ממוקדים
      const suggestions = existingTags.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setFilteredSuggestions(suggestions);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tagList}>
        {selectedTags.map((tag, index) => (
          <div key={index} className={styles.tagItem}>
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className={styles.removeButton}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputFieldWrapper}>
          <div
            onClick={handleToggleSuggestions}
            className={styles.toggleButton}
          >
            {isSuggestionsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="הוסף תגיות"
            className={styles.inputField}
          />
        </div>
        {isSuggestionsOpen && filteredSuggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {filteredSuggestions.map((tag, index) => (
              <li
                key={index}
                onClick={() => handleAddTag(tag)}
                className={styles.suggestionItem}
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
