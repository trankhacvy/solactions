"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function DonationTable() {
  const { data: session } = useSession();

  const { data: donations = [], isLoading } =
    api.donation.getUserDonations.useQuery(
      {
        wallet: session?.user.wallet!,
      },
      {
        refetchOnWindowFocus: false,
      },
    );

  return (
    <Box>
      <Typography mb={2} variant="h6">
        Donations
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Donator</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow
                key={donation.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {donation.sender}
                </TableCell>
                <TableCell align="right">{donation.amount}</TableCell>
                <TableCell align="right">
                  {donation.createdAt?.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function ActionOption({
  title,
  subtitle,
  enable,
}: {
  title: string;
  subtitle: string;
  enable: boolean;
}) {
  return (
    <Card>
      <CardActionArea disabled>
        <CardContent component={Stack} gap={1}>
          <Stack flexDirection="row" gap={1}>
            <Typography fontWeight="fontWeightSemiBold">{title}</Typography>
            <Chip label="Soon" color="info" size="small" />
          </Stack>
          <Typography color="text.secondary">{subtitle}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];
