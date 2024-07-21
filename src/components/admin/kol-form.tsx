"use client"
import { Typography, TextField, Button, Box, RadioGroup, FormControlLabel, Radio, MenuItem, Select } from "@mui/material";
import React, { useState, FormEvent } from 'react';

function FormComponent() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [type, setType] = useState<string>('calendy');
    const [duration, setDuration] = useState<string>('45min');
    const [customDuration, setCustomDuration] = useState<string>('');

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
        // ...
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
        {!showForm ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
            fullWidth
            sx={{ mt: 2 }}
          >
            I want to create a KOL link
          </Button>
        ) : (
          <>
            <form onSubmit={onSubmit}>
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                label="Title"
                name="title"
                required
              />
              <Select
                fullWidth
                margin="normal"
                variant="outlined"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                displayEmpty
                name="duration"
                required
              >
                <MenuItem value="45min">45min</MenuItem>
                <MenuItem value="1h">1h</MenuItem>
                <MenuItem value="2h">2h</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
              {duration === 'custom' && (
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Custom Duration"
                  name="customDuration"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  required
                />
              )}
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                label="Price"
                name="price"
                required
              />
              <RadioGroup
                row
                value={type}
                onChange={(e) => setType(e.target.value)}
                name="type"
                required
              >
                <FormControlLabel value="calendy" control={<Radio />} label="Calendy" />
                <FormControlLabel value="telegram" control={<Radio />} label="Telegram" />
              </RadioGroup>
              {type === 'calendy' && (
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Calendy URL"
                  name="calendyUrl"
                  required
                />
              )}
              {type === 'telegram' && (
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Telegram Username"
                  name="telegramUsername"
                  required
                />
              )}
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                label="Description"
                name="description"
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
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowForm(false)}
              fullWidth
              sx={{ mt: 2 }}
            >
              Close your form
            </Button>
          </>
        )}
      </Box>
    );
  }

export default FormComponent;