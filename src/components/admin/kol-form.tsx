"use client"
import { TextField, Button, Box, RadioGroup, FormControlLabel, Radio, MenuItem, Select, Avatar } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { type Profile } from "./kol-stream-card";
import React, { useEffect } from "react";

function FormComponent({ onFormChange, initialProfile }: { onFormChange: (formValues: Profile) => void, initialProfile: Profile }) {
    const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Profile>({
        defaultValues: initialProfile
    });

    const watchedValues = watch();

    useEffect(() => {
        onFormChange(watchedValues);
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
                throw new Error('Không thể gửi dữ liệu. Vui lòng thử lại.');
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            setValue('image', result.image);
            // Xử l thành công
        } catch (error) {
            console.error(error);
            // Xử lỗi
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
                    rules={{ required: "Tiêu đề là bắt buộc" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Tiêu đề"
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                    )}
                />

                <Controller
                    name="duration"
                    control={control}
                    rules={{ required: "Thời lượng là bắt buộc" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            displayEmpty
                            error={!!errors.duration}
                        >
                            <MenuItem value="45min">45 phút</MenuItem>
                            <MenuItem value="1h">1 giờ</MenuItem>
                            <MenuItem value="2h">2 giờ</MenuItem>
                            <MenuItem value="custom">Tùy chỉnh</MenuItem>
                        </Select>
                    )}
                />

                {watchedValues.duration === 'custom' && (
                    <Controller
                        name="customDuration"
                        control={control}
                        rules={{ required: "Thời lượng tùy chỉnh là bắt buộc" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Thời lượng tùy chỉnh"
                                error={!!errors.customDuration}
                                helperText={errors.customDuration?.message}
                            />
                        )}
                    />
                )}

                <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Giá là bắt buộc" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Giá"
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />
                    )}
                />

                <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Loại là bắt buộc" }}
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
                        rules={{ required: "URL Calendy là bắt buộc" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="URL Calendy"
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
                        rules={{ required: "Tên người dùng Telegram là bắt buộc" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Tên người dùng Telegram"
                                error={!!errors.telegramUsername}
                                helperText={errors.telegramUsername?.message}
                            />
                        )}
                    />
                )}

                <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Mô tả là bắt buộc" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Mô tả"
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
                    {isSubmitting ? 'Đang tải...' : 'Tạo KOL Stream'}
                </Button>
            </form>
        </Box>
    );
}

export default FormComponent;