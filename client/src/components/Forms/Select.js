import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";

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

const countries = [
  { name: "Ghana", value: "GH" },
  { name: "Kenya", value: "KE" },
  { name: "Nigeria", value: "NG" },
  { name: "South Africa", value: "ZA" },
  { name: "Tanzania", value: "TZ" },
  { name: "Uganda", value: "UG" },
];

export default function SelectInput(props) {
  const [destination, setDestination] = React.useState("");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setDestination(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    props.setDestination(event.target.value);
  };

  return (
    <div className="selectContainer">
      <label>Select Destination</label>
      <FormControl sx={{ width: "100%" }} size="small">
        <Select
          value={destination}
          onChange={handleChange}
          label="Select Destination"
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          labelId="demo-select-small"
          id="demo-select-small"
          variant="outlined"
        >
          {countries.map((country, i) => (
            <MenuItem key={i} value={country.value}>
              <ListItemText primary={country.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
