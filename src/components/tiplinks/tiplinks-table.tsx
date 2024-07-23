"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Button,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { api } from "@/trpc/react";
import { formatDateByPattern } from "@/lib/format-date";
import { CheckIcon, CopyIcon, PlusIcon } from "lucide-react";
import { Routes } from "@/config/routes";
import { getTiplinkBlinkUrl } from "@/lib/tiplink";
import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";

export function TiplinksTable() {
  const { data: tiplinks = [], isLoading } = api.tiplink.mine.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const [copying, setCopying] = useState(false);
  const [_, copy] = useCopyToClipboard();

  if (tiplinks.length === 0 && !isLoading) {
    return <EmptyUI />;
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="Tiplinks table">
        <TableHead>
          <TableRow>
            <TableCell>Link</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell align="center">Claimant</TableCell>
            <TableCell align="right">Created at</TableCell>
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
                <TableCell>
                  <Skeleton width="100%" height={24} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton width="100%" height={24} />
                </TableCell>
              </TableRow>
            ))}

          {tiplinks?.map((tiplink) => (
            <TableRow
              key={tiplink.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Stack flexDirection="row" alignItems="center" gap={2}>
                  {tiplink.id}{" "}
                  <IconButton
                    size="small"
                    aria-label="Copy"
                    onClick={async () => {
                      setCopying(true);
                      copy(getTiplinkBlinkUrl(tiplink.id));
                      setTimeout(() => {
                        setCopying(false);
                      }, 1500);
                    }}
                  >
                    {copying ? <CheckIcon /> : <CopyIcon />}
                  </IconButton>
                </Stack>
              </TableCell>
              <TableCell align="center">
                {tiplink.amount} {tiplink.token.symbol}
              </TableCell>
              <TableCell align="center">
                {tiplink.claimed ? tiplink.claimant : "N/A"}
              </TableCell>
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
