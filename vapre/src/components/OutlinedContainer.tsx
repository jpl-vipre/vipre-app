import { FC, CSSProperties } from "react";
import { FormGroup, FormLabel } from "@mui/material";

interface OutlinedContainerProps {
  label: string;
  style?: CSSProperties;
  labelStyle?: CSSProperties;
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

const OutlinedContainer: FC<OutlinedContainerProps> = ({
  label,
  children,
  style = {},
  labelStyle = {},
  className = "",
}) => {
  return (
    <FormGroup
      style={{
        flex: 1,
        padding: "5px",
        margin: "5px",
        border: "1px solid rgba(255, 255, 255, 0.23)",
        borderRadius: "4px",
        ...style,
      }}
      className={className}
    >
      <FormLabel
        style={{
          marginBottom: "10px",
          marginTop: "-17.5px",
          marginLeft: "10px",
          background: "#202e46",
          width: "fit-content",
          padding: "0 5px",
          ...labelStyle,
        }}
      >
        {label}
      </FormLabel>
      {children}
    </FormGroup>
  );
};

export default OutlinedContainer;
