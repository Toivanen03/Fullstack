import { Entry } from "../../types";
import { TextField, FormControl, MenuItem, Select, InputLabel } from "@mui/material";

interface FieldsProps {
    type: Entry["type"];
    dischargeDate: string;
    setDischargeDate: (value: string) => void;
    dischargeCriteria: string;
    setDischargeCriteria: (value: string) => void;
    employerName: string;
    setEmployerName: (value: string) => void;
    sickLeaveStart: string;
    setSickLeaveStart: (value: string) => void;
    sickLeaveEnd: string;
    setSickLeaveEnd: (value: string) => void;
    healthCheckRating: number;
    setHealthCheckRating: (value: number) => void;
}
  
  const Fields: React.FC<FieldsProps> = ({
    type,
    dischargeDate,
    setDischargeDate,
    dischargeCriteria,
    setDischargeCriteria,
    employerName,
    setEmployerName,
    sickLeaveStart,
    setSickLeaveStart,
    sickLeaveEnd,
    setSickLeaveEnd,
    healthCheckRating,
    setHealthCheckRating,
  }) => {
    const fieldsByTypes = () => {
        switch (type) {
            case "Hospital":
                return (
                    <div>
                        <TextField sx={{ mb: 2 }}
                            label="Discharge date:"
                            type="date"
                            value={dischargeDate}
                            fullWidth 
                            onChange={({ target }) => setDischargeDate(target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    
                        <TextField sx={{ mb: 2 }}
                            label="Discharge criteria:"
                            value={dischargeCriteria}
                            fullWidth 
                            onChange={({ target }) => setDischargeCriteria(target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>);

            case "OccupationalHealthcare":
                return (
                    <div>
                        <TextField sx={{ mb: 2 }}
                            label="Employer name:"
                            value={employerName}
                            fullWidth 
                            onChange={({ target }) => setEmployerName(target.value)}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField sx={{ mb: 2 }}
                            label="Sick leave start:"
                            type="date"
                            value={sickLeaveStart}
                            fullWidth 
                            onChange={({ target }) => setSickLeaveStart(target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    
                        <TextField sx={{ mb: 2 }}
                            label="Sick leave end:"
                            type="date"
                            value={sickLeaveEnd}
                            fullWidth 
                            onChange={({ target }) => setSickLeaveEnd(target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>);

          
            case "HealthCheck":
                return (
                    <div>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Health check rating</InputLabel>
                            <Select
                                value={healthCheckRating}
                                onChange={(event) => setHealthCheckRating(Number(event.target.value))}
                                label="Health risk rating"
                            >
                                <MenuItem value="0">0 - Healthy</MenuItem>
                                <MenuItem value="1">1 - Low risk</MenuItem>
                                <MenuItem value="2">2 - High risk</MenuItem>
                                <MenuItem value="3">3 - Critical risk</MenuItem>
                            </Select>
                        </FormControl>
                    </div>);

            default:
            throw new Error("Invalid entry type");
        }
    };
    return fieldsByTypes();
};

export default Fields;