"use client";

import {
  Badge,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

// Dữ liệu các cuộc họp gặp gỡ của KOL
const meetings = [
  {
    name: "John Doe",
    link: "https://meet.google.com/owa-ygkv-mop",
    description: "Discussing marketing strategies",
    date: "2023-10-15",
    time: "10:00 AM",
  },
  {
    name: "Jane Smith",
    link: "https://meet.google.com/owa-ygkv-mop",
    description: "Reviewing project milestones",
    date: "2023-10-16",
    time: "2:00 PM",
  },
  // Thêm các cuộc họp khác nếu cần
];

export function KolCalendar() {
  return (
    <Box>
      <Typography mb={2} variant="h6">
        Kol Calendar
      </Typography>
      <Grid container spacing={3}>
        {meetings.map((meeting) => (
          <Grid key={meeting.name} item xs={12} md={6} xl={4}>
            <MeetingCard {...meeting} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function MeetingCard({
  name,
  link,
  description,
  date,
  time,
}: {
  name: string;
  link: string;
  description: string;
  date: string;
  time: string;
}) {
  return (
    <Card>
      <CardActionArea href={link} target="_blank">
        <CardContent component={Stack} gap={1}>
          <Stack flexDirection="row" gap={1}>
            <Typography fontWeight="fontWeightSemiBold">{name}</Typography>
            <Chip label="Meet" color="primary" size="small" />
          </Stack>
          <Typography color="text.secondary">{description}</Typography>
          <Typography color="text.secondary">
            {date} at {time}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}