"use client"

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, IconButton } from "@mui/material";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";
import { api } from "@/trpc/react";
import { SelectKolProfileSchema } from "@/types";

export function MeetingsTable({ profile }: { profile: SelectKolProfileSchema }) {
  const [copying, setCopying] = useState(false);
  const [_, copy] = useCopyToClipboard();

  console.log("profile", profile);
  console.log("id", profile.id);

  const { data: meeting = [], isLoading: isLoadingMeetings } =
    api.talkwithmeTransactions.getByProfileId.useQuery(
      {
        profileId: profile?.id!,
      },
      {
        enabled: !!profile,
        refetchOnWindowFocus: false,
      },
    );

  console.log("meeting", meeting);

  const isLoading = isLoadingMeetings;
  
  if (meeting.length === 0 && !isLoading) {
    return <></>;
  }

  const meetings = [
    {
      id: 1,
      email: "coderhopham@gmail.com",
      title: "Hi Iam Anh",
      duration: "1 h",
      link: "https://example.com/meeting1",
      description: "Description for meeting 1",
    },
    {
      id: 2,
      email: "coderhopham@gmail.com",
      title: "Hi Iam Anh",
      duration: "1 h",
      link: "https://example.com/meeting1",
      description: "Description for meeting 1",
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Meetings table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow
              key={meeting.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography fontWeight="fontWeightSemiBold">{meeting.email}</Typography>
              </TableCell>
              <TableCell>{meeting.title}</TableCell>
              <TableCell>{meeting.duration}</TableCell>
              <TableCell>{meeting.description}</TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  aria-label="Copy"
                  onClick={async () => {
                    setCopying(true);
                    copy(meeting.link);
                    setTimeout(() => {
                      setCopying(false);
                    }, 1500);
                  }}
                >
                  {copying ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}