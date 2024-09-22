
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { SyntheticEvent, useState } from 'react';
import { useAirportOptions, useInputWidth } from './hooks';
import { Airport } from './types';

export default function AirportInput({
    label,
    selectedAirport,
    setSelectedAirport,
}: {
    label: "departure" | "arrival";
    selectedAirport: Airport | null;
    setSelectedAirport: (airport: Airport | null) => void;
}) {
    const [search, setSearch] = useState<string>("");
    const options = useAirportOptions(search);
    const width = useInputWidth();

    function getLabel(option: Airport) {
        return `${option.name}${option.city ? `, ${option.city}`: ""}${option.iata ? ` (${option.iata})` : ""}`;
    }

    function handleInputChange(event: SyntheticEvent<Element, Event>, newValue: string) {
        setSearch(newValue);
    };

    function handleSelect(event: SyntheticEvent<Element, Event>, newValue: Airport | null) {
        setSelectedAirport(newValue);
    };

    return (
        <Autocomplete
            className='input-box'
            value={selectedAirport}
            onChange={handleSelect}
            inputValue={search}
            onInputChange={handleInputChange}
            options={options.length === 0 && selectedAirport ? [selectedAirport] : options}
            getOptionLabel={getLabel}
            sx={{ width }}
            renderInput={(params) => <TextField {...params} label={label === "departure" ? "Departure" : "Arrival"} />}
            filterOptions={ option => option }
            aria-label={`${label}-search`}
        />
    );
}
