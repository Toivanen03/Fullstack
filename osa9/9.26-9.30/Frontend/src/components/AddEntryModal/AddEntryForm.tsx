import { useState, SyntheticEvent, useEffect } from "react";
import { TextField, Grid, Button, InputLabel, Select, MenuItem, SelectChangeEvent, FormControl, OutlinedInput, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Entry, NewEntry, Diagnosis } from "../../types";
import Fields from "./additionalEntryFields";
import diagnoses from "../../services/diagnoses";
import '../PatientData/entriesStyle.css';

interface Props {
  onCancel: () => void;
  onSubmit: (values: NewEntry) => void;
}

interface TypeOption {
  type: Entry["type"];
  label: string;
}

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [type, setType] = useState<Entry["type"]>('Hospital');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [specialist, setSpecialist] = useState('');
  const [diagnosisOptions, setDiagnosisOptions] = useState<Diagnosis[]>([]);
  const [diagnosisCodes, setDiagCodes] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [dischargeDate, setDischargeDate] = useState(new Date().toISOString().split('T')[0]);
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState(new Date().toISOString().split('T')[0]);
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(4);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setDiagnosisOptions(await diagnoses.getAll());
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };
    fetchDiagnoses();
  }, []);

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    let newEntry: NewEntry;
  
    switch (type) {
      case "Hospital":
        newEntry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          discharge: { date: dischargeDate, criteria: dischargeCriteria }
        };
        break;
  
      case "OccupationalHealthcare":
        newEntry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          employerName,
          ...(sickLeaveStart && sickLeaveEnd ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } } : {})
        };
        break;
  
      case "HealthCheck":
        newEntry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          healthCheckRating: Number(healthCheckRating)
        };
        break;
  
      default:
        throw new Error("Invalid entry type");
    }
    onSubmit(newEntry);
  };
  
  const typeOptions: TypeOption[] = [
    { type: "Hospital", label: "Hospital" },
    { type: "OccupationalHealthcare", label: "Occupational Healthcare" },
    { type: "HealthCheck", label: "Health Check" }
  ];
  
  const onTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const type = typeOptions.find(g => g.type === value);
      if (type) {
        setType(type.type);
      }
    }
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const value = event.target.value;
    if (Array.isArray(value)) {
      setDiagCodes(value.filter(v => v !== undefined && v.trim() !== ""));
    } else if (typeof value === "string") {
      setDiagCodes(value ? value.split(",").map(v => v.trim()).filter(v => v !== "") : []);
    } else {
      setDiagCodes([]);
    }
  };
  
  const diagsOptions = () => {
    setMenuOpen(true);
  };

  const closeDiags = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
  };
  
  return (
    <div>
      <form onSubmit={addEntry}>
        <FormControl fullWidth>
          <InputLabel>Medical care unit:</InputLabel>
            <Select sx={{ mb: 2 }}
              label="Type"
              fullWidth
              value={type}
              input={<OutlinedInput label="Medical care unit:" />}
              onChange={onTypeChange}
            >
            {typeOptions.map(option => (
              <MenuItem key={option.label} value={option.type}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      
        <TextField sx={{ mb: 2 }}
          label="Description"
          fullWidth 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField sx={{ mb: 2 }}
          label="Examination date:"
          type="date"
          fullWidth 
          value={date}
          onChange={({ target }) => setDate(target.value)}
          />
        
        <TextField sx={{ mb: 2 }}
          label="Specialist"
          fullWidth 
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth sx={{ mb: 2 }} onClick={diagsOptions}>
          <InputLabel shrink>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisChange}
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => selected.join(", ")}
            open={menuOpen}
          >
            <IconButton onClick={closeDiags} style={{ position: "absolute", right: "10px", top: "10px", zIndex: 1 }}>
              <div className="closeButton">Close <CloseIcon className="closeButtonIcon" /></div>
            </IconButton>
            {diagnosisOptions.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} - {diagnosis.name}
                {diagnosisCodes?.includes(diagnosis.code) && (
                  <span style={{ color: 'green', marginLeft: '10px' }}>✔</span>
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <Fields
          type={type}
          dischargeDate={dischargeDate}
          setDischargeDate={setDischargeDate}
          dischargeCriteria={dischargeCriteria}
          setDischargeCriteria={setDischargeCriteria}
          employerName={employerName}
          setEmployerName={setEmployerName}
          sickLeaveStart={sickLeaveStart}
          setSickLeaveStart={setSickLeaveStart}
          sickLeaveEnd={sickLeaveEnd}
          setSickLeaveEnd={setSickLeaveEnd}
          healthCheckRating={healthCheckRating}
          setHealthCheckRating={setHealthCheckRating}
        />

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;