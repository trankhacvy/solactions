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
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    {
        name: "John Doe",
        link: "https://meet.google.com/owa-ygkv-mop",
        description: "Discussing marketing strategies",
        date: "2023-10-17",
        time: "10:00 AM",
    },
    {
        name: "Jane Smith",
        link: "https://meet.google.com/owa-ygkv-mop",
        description: "Reviewing project milestones",
        date: "2023-10-18",
        time: "2:00 PM",
  },
];

export function MoreMeetings() {
  return (
    <Box>
      <Typography mb={2} variant="h6">
        More meetings
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
  const router = useRouter();
  const [showLink, setShowLink] = useState(false);

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          setShowLink(true);
          router.push(link);
        }}
      >
        <CardContent component={Stack} gap={1}>
          <Stack flexDirection="row" gap={1}>
            <Typography fontWeight="fontWeightSemiBold">{name}</Typography>
            <Chip label="Meeting" color="primary" size="small" />
          </Stack>
          <Typography color="text.secondary">{description}</Typography>
          <Typography color="text.secondary">
            {date} at {time}
          </Typography>
          {showLink ? (
            <Typography color="primary">{link}</Typography>
          ) : (
            <Typography color="primary">🔗 Click to open link</Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}