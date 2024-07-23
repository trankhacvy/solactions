"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Link, Skeleton, Stack, Typography } from "@mui/material";
import { api } from "@/trpc/react";
import { getExplorerUrl } from "@/lib/explorer";
import { truncateWallet } from "@/lib/wallet";
import { tokenList } from "@/config/tokens";
import { formatDateByPattern } from "@/lib/format-date";
import { twitterLink } from "@/utils/twitter";
import { getDonationLink } from "@/utils/links";
import { SelectDonationProfile } from "@/types";

export function DonationTable() {
  const { data: profile, isLoading: isLoadingProfile } =
    api.donation.me.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const { data: donations = [], isLoading: isLoadingDonations } =
    api.donationTransaction.getByProfileId.useQuery(
      {
        profileId: profile?.id!,
      },
      {
        enabled: !!profile,
        refetchOnWindowFocus: false,
      },
    );

  const isLoading = isLoadingProfile || isLoadingDonations;

  if (donations.length === 0 && !isLoading) {
    return <EmptyUI profile={profile} />;
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="Donations table">
        <TableHead>
          <TableRow>
            <TableCell>Donator</TableCell>
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

          {donations.map((donation) => (
            <TableRow
              key={donation.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link
                  target="_blank"
                  rel="noopener"
                  href={getExplorerUrl("mainnet", donation.sender)}
                >
                  {truncateWallet(donation.sender, 16, true)}
                </Link>
              </TableCell>
              <TableCell>
                {donation.amount} {(donation.currency ?? tokenList[0])?.symbol}
              </TableCell>
              <TableCell align="right">
                {formatDateByPattern(
                  donation.createdAt!,
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

function EmptyUI({ profile }: { profile?: SelectDonationProfile }) {
  if (!profile) return null;

  return (
    <Stack alignItems="center">
      <Typography mb={2} fontWeight="fontWeightSemiBold" color="text.secondary">
        No donation yet
      </Typography>
      <a
        href={twitterLink(getDonationLink(profile?.slug), {
          title: "Donate me on ",
          hashtags: ["solactions", "actions", "blinks", "opos"],
        })}
        target="_blank"
        rel="noopener"
      >
        <Button>Shill your link</Button>
      </a>
    </Stack>
  );
}
