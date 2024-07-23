"use client"
import { Typography, TextField, Button, Box, RadioGroup, FormControlLabel, Radio, MenuItem, Select, Avatar } from "@mui/material";
import { FormEvent, useState, useEffect } from "react";
import { Profile } from "./kol-stream-card";

function FormComponent({ onFormChange, initialProfile }: { onFormChange: (formValues: Profile) => void, initialProfile: Profile }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(true); // Show form by default

    const [formValues, setFormValues] = useState<Profile>(initialProfile);

    useEffect(() => {
        onFormChange(formValues);
    }, [formValues]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        const updatedFormValues = {
            ...formValues,
            [name!]: value
        };
        setFormValues(updatedFormValues);
        onFormChange(updatedFormValues); // Notify parent component of form changes
    };

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData(event.currentTarget);
        const response = await fetch('/api/submit', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to submit the data. Please try again.');
        }

        const data = await response.json();
        setFormValues(data); // Store form data in state
        // Handle success
      } catch (error) {
        setError(error as string);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    return (
      <Box
        component="div"
        sx={{
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={onSubmit}>
          <Avatar src={formValues.image} alt={formValues.title} sx={{ width: 56, height: 56, mb: 2 }} />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Title"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            required
          />
          <Select
            fullWidth
            margin="normal"
            variant="outlined"
            value={formValues.duration}
            onChange={(e) => {
                handleInputChange(e);
            }}
            displayEmpty
            name="duration"
            required
          >
            <MenuItem value="45min">45min</MenuItem>
            <MenuItem value="1h">1h</MenuItem>
            <MenuItem value="2h">2h</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
          {formValues.duration === 'custom' && (
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Custom Duration"
              name="customDuration"
              value={formValues.customDuration}
              onChange={handleInputChange}
              required
            />
          )}
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Price"
            name="price"
            value={formValues.price}
            onChange={handleInputChange}
            required
          />
          <RadioGroup
            row
            value={formValues.type}
            onChange={(e) => {
                handleInputChange(e);
            }}
            name="type"
            required
          >
            <FormControlLabel value="calendy" control={<Radio />} label="Calendy" />
            <FormControlLabel value="telegram" control={<Radio />} label="Telegram" />
          </RadioGroup>
          {formValues.type === 'calendy' && (
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Calendy URL"
              name="calendyUrl"
              value={formValues.calendyUrl}
              onChange={handleInputChange}
              required
            />
          )}
          {formValues.type === 'telegram' && (
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Telegram Username"
              name="telegramUsername"
              value={formValues.telegramUsername}
              onChange={handleInputChange}
              required
            />
          )}
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Loading...' : 'Create KOL Stream'}
          </Button>
        </form>
      </Box>
    );
  }

export default FormComponent;