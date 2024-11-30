import React, { useState, useEffect } from "react";
import { MdCancel, MdOutlineDragIndicator } from "react-icons/md";
import {
  TagsInputWrapper,
  Tag,
  AutoCompleteList,
  AutoCompleteItem,
  StyledTagContainer,
  StyledInput,
  StyledErrorMessage,
  InputLabel
} from "./style";

// Tipagem das props do componente
interface Option {
  id: number;
  title: string;
}

interface NewTagsInputProps {
  id: string;
  placeholder?: string;
  label: string;
  options: Option[];
  onChange: (selectedTags: Option[]) => void;
  selectedTags: Option[];
  errorMessage?: string;
}

// Componente NewTagsInput com tipagem
const TagsInput: React.FC<NewTagsInputProps> = ({
  id,
  placeholder,
  label,
  options,
  onChange,
  selectedTags,
  errorMessage,
}) => {
  const [text, setText] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);

  useEffect(() => {
    if (options) {
      setFilteredOptions(options);
      setSelectedOptionIndex(-1);
    }
  }, [options]);

  useEffect(() => {
    if (selectedOptionIndex !== null && filteredOptions[selectedOptionIndex]) {
      scrollToAnchor(`tagOption_${filteredOptions[selectedOptionIndex].id}`);
    }
  }, [selectedOptionIndex]);

  const handleInputChange = (value: string) => {
    setText(value);
    if (value === "") {
      return setFilteredOptions(options);
    }
    return setFilteredOptions(
      options.filter((option) =>
        option.title.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const addTag = (e: React.MouseEvent, option: Option) => {
    e.stopPropagation();
    handleInputChange("");
    if (!selectedTags) return onChange([option]);
    if (selectedTags.find((t) => t.id === option.id)) return
    onChange([...selectedTags, option]);
  };

  const removeTag = (index: number) => {
    onChange([...selectedTags.filter((t, i) =>  i !== index)]);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showOptions) return;
    if (e.key === "Enter" && filteredOptions[selectedOptionIndex]) {
      addTag(e as unknown as React.MouseEvent, filteredOptions[selectedOptionIndex]);
      return;
    }

    if (e.key === "ArrowDown" && filteredOptions.length > 0) {
      const nextIndex =
        selectedOptionIndex < filteredOptions.length - 1
          ? selectedOptionIndex + 1
          : 0;
      setSelectedOptionIndex(nextIndex);
      return;
    }

    if (e.key === "ArrowUp" && filteredOptions.length > 0) {
      const nextIndex =
        selectedOptionIndex > 0
          ? selectedOptionIndex - 1
          : filteredOptions.length - 1;
      setSelectedOptionIndex(nextIndex);
      return;
    }
  };

  function scrollToAnchor(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
      e.dataTransfer.setData("dragIndex", index.toString());
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, dropIndex: number) {
      e.preventDefault();
      const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);
      const newTags: Option[] = [...selectedTags];
      const draggedTag = newTags[dragIndex];
      newTags.splice(dragIndex, 1);
      newTags.splice(dropIndex, 0, draggedTag);
      onChange(newTags);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault();
  }


  return (
    <StyledTagContainer>
       <InputLabel>{label}</InputLabel>
      <TagsInputWrapper>
        {selectedTags &&
          selectedTags.length > 0 &&
          selectedTags.map((tag, i) => (
            <Tag 
              key={i}
              $isPresident={i === 0}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
            >
              <div>
                <MdOutlineDragIndicator />
                <p>
                  {tag.title}
                </p>
              </div>
              
              {
                i === 0 && (
                  <span>
                    (Presidente)
                  </span>
                )
              }

              <MdCancel
                className="iconCancel"
                onClick={() => removeTag(i)}
              />
            </Tag>
          ))}
      </TagsInputWrapper>
       
      <StyledInput
        id={id}
        type="text"
        value={text}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onFocus={() => {
          setShowOptions(true);
          setTimeout(() => {
            scrollToAnchor(id);
          }, 100);
        }}
        onBlur={() => setTimeout(() => setShowOptions(false), 500)}
        placeholder={placeholder || "Adicione uma tag"}
      />
      <AutoCompleteList>
        {showOptions &&
          filteredOptions.map((option, index) => (
            <AutoCompleteItem
              key={index}
              id={`tagOption_${option.id}`}
              $selected={index === selectedOptionIndex}
              onClick={(e) => addTag(e, option)}
            >
              {option.title}
            </AutoCompleteItem>
          ))}
      </AutoCompleteList>
      {errorMessage && (
        <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
      )}
    </StyledTagContainer>
  );
};

export default TagsInput;
