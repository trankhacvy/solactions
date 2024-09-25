"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { api } from "@/trpc/react";
import { formatDateByPattern } from "@/lib/format-date";
import { CheckIcon, CopyIcon, PlusIcon } from "lucide-react";
import { Routes } from "@/config/routes";
import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-clipboard";
import { env } from "@/env";

export function getCNFTDispenserBlinkUrl(id: string) {
  return `https://dial.to/devnet?action=solana-action:${encodeURI(`${env.NEXT_PUBLIC_FE_BASE_URL}/api/c-nft-dispenser/${id}`)}`;
}

export function CNFTDispenserTable() {
  const { data: dispensers = [], isLoading } = api.cnftDispenser.mine.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const [copying, setCopying] = useState(false);
  const [_, copy] = useCopyToClipboard();

  if (dispensers.length === 0 && !isLoading) {
    return <EmptyUI />;
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="Tiplinks table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 96 }}>Image</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Claimed</TableCell>
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

          {dispensers?.map((dispenser) => (
            <TableRow
              key={dispenser.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box
                  component="img"
                  src={dispenser.media ?? ""}
                  sx={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              </TableCell>
              <TableCell align="left">
                {dispenser.name}{" "}
                <IconButton
                  size="small"
                  aria-label="Copy"
                  onClick={async () => {
                    setCopying(true);
                    copy(getCNFTDispenserBlinkUrl(dispenser.id));
                    setTimeout(() => {
                      setCopying(false);
                    }, 1500);
                  }}
                >
                  {copying ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
              </TableCell>
              <TableCell align="center">0</TableCell>
              <TableCell align="right">
                {formatDateByPattern(
                  dispenser.createdAt!,
                  "hh:mm:A DD MMM YYYY",
                )}
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
        No CNFT Dispenser
      </Typography>
      <NextLink href={Routes.ADMIN_NEW_C_NFT_DISPENSER}>
        <Button startIcon={<PlusIcon />}>Create new CNFT Dispenser</Button>
      </NextLink>
    </Stack>
  );
}
