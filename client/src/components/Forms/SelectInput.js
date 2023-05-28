import * as React from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectInput({ label, countries,defaultValue }) {
  const [country, setCountry] = React.useState("");

  const handleChange = (e) => {
    const selectedCountry = countries.find((country) => country.code === e.target.value);
    if (selectedCountry) {
      setCountry(selectedCountry.name);
    }
  };

  if (!Array.isArray(countries) || countries.length === 0) {
    // Handle the case where countries is not an array or is empty
    return <div>Error: Invalid countries data</div>;
  }

  return (
    <div>
      <label className="label">{label}</label>
      <Select
        size={"small"}
        fullWidth={true}
        defaultValue={defaultValue}
        value={country}
        onChange={handleChange}
        input={
          <OutlinedInput
            id="select-multiple-chip"
            label="Choose your country"
          />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            <Chip key={selected} label={selected} />
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {countries.map((country, index) => (
          <MenuItem defaultValue={defaultValue} key={index} value={country.code}>
            {country.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
