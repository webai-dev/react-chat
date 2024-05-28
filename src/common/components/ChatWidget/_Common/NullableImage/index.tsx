import React from "react";
import Person from "../../../../images/Person.png";

interface NullableImageProps {
  src: string | null | undefined;
  className: string;
}

/**
 * NullableImage component
 * @param {NullableImageProps} props Properties
 * @description NullableImage component consists of placeholder image for null value
 */
const NullableImage: React.FC<NullableImageProps> = ({
  src = "",
  className = "",
}) => {
  return (
    <img
      data-testid="nullable-image"
      alt="nullable"
      className={className}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).src = Person;
      }}
      src={src || Person}
    />
  );
};

export default NullableImage;
