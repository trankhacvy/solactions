"use client"
import { TextField, Button, Box, RadioGroup, FormControlLabel, Radio, MenuItem, Select, Avatar } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { type Profile } from "./kol-stream-card";
import React, { useEffect, useRef } from "react";

function FormComponent({ onFormChange, initialProfile }: { onFormChange: (formValues: Profile) => void, initialProfile: Profile }) {
    const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Profile>({
        defaultValues: initialProfile
    });

    const watchedValues = watch();
    const previousValues = useRef(watchedValues);

    useEffect(() => {
        if (JSON.stringify(watchedValues) !== JSON.stringify(previousValues.current)) {
            onFormChange(watchedValues);
            previousValues.current = watchedValues;
        }
    }, [watchedValues, onFormChange]);

    const onSubmit = async (data: Profile) => {
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Unable to send data. Please try again.');
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            setValue('image', result.image);
            // Handle successful
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    return (
        <Box component="div" sx={{ borderRadius: '8px', padding: '16px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                        <Avatar src={field.value} alt={watchedValues.title} sx={{ width: 56, height: 56, mb: 2 }} />
                    )}
                />
                
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Title"
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                    )}
                />
                
                <Controller
                    name="duration"
                    control={control}
                    rules={{ required: "Duration is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Duration"
                            error={!!errors.duration}
                            helperText={errors.duration?.message}
                        >
                            <MenuItem value="45min">45 minutes</MenuItem>
                            <MenuItem value="1h">1 hour</MenuItem>
                            <MenuItem value="2h">2 hours</MenuItem>
                            <MenuItem value="custom">Custom</MenuItem>
                        </TextField>
                    )}
                />

                {watchedValues.duration === 'custom' && (
                    <Controller
                        name="customDuration"
                        control={control}
                        rules={{ required: "Custom duration is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Custom Duration"
                                error={!!errors.customDuration}
                                helperText={errors.customDuration?.message}
                            />
                        )}
                    />
                )}

                <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Price is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Price"
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />
                    )}
                />

                <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Type is required" }}
                    render={({ field }) => (
                        <RadioGroup {...field} row>
                            <FormControlLabel value="calendy" control={<Radio />} label="Calendy" />
                            <FormControlLabel value="telegram" control={<Radio />} label="Telegram" />
                        </RadioGroup>
                    )}
                />

                {watchedValues.type === 'calendy' && (
                    <Controller
                        name="calendyUrl"
                        control={control}
                        rules={{ required: "Calendy URL is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Calendy URL"
                                error={!!errors.calendyUrl}
                                helperText={errors.calendyUrl?.message}
                            />
                        )}
                    />
                )}

                {watchedValues.type === 'telegram' && (
                    <Controller
                        name="telegramUsername"
                        control={control}
                        rules={{ required: "Telegram username is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Telegram Username"
                                error={!!errors.telegramUsername}
                                helperText={errors.telegramUsername?.message}
                            />
                        )}
                    />
                )}

                <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Description"
                            multiline
                            rows={4}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {isSubmitting ? 'Loading...' : 'Create KOL Stream'}
                </Button>
            </form>
        </Box>
    );
}

export default FormComponent;