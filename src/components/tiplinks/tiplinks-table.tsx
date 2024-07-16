"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Link, Skeleton, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { api } from "@/trpc/react";
import { formatDateByPattern } from "@/lib/format-date";
import { PlusIcon } from "lucide-react";
import { Routes } from "@/config/routes";

export function TiplinksTable() {
  const { data: tiplinks = [], isLoading } = api.tiplink.all.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  if (tiplinks.length === 0 && !isLoading) {
    return <EmptyUI />;
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="Tiplinks table">
        <TableHead>
          <TableRow>
            <TableCell>Link</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading &&
            Array.from({ length: 2 }).map((_, idx) => (
              <TableRow
                key={idx}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Skeleton width="100%" height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton width="100%" height={24} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="100%" height={24} />
                </TableCell>
              </TableRow>
            ))}

          {tiplinks.map((tiplink) => (
            <TableRow
              key={tiplink.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link target="_blank" rel="noopener" href="">
                  {tiplink.name} - {tiplink.id}
                </Link>
              </TableCell>
              <TableCell>{tiplink.amount}</TableCell>
              <TableCell align="right">
                {formatDateByPattern(tiplink.createdAt!, "hh:mm:A DD MMM YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function EmptyUI() {
  return (
    <Stack alignItems="center">
      <Typography mb={2} fontWeight="fontWeightSemiBold" color="text.secondary">
        No link yet
      </Typography>
      <NextLink href={Routes.ADMIN_NEW_TIPLINKS}>
        <Button startIcon={<PlusIcon />}>Create new tiplink</Button>
      </NextLink>
    </Stack>
  );
}
