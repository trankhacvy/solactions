"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Divider, Stack } from "@mui/material";

export function Features2(): JSX.Element {
  return (
    <Box
      id="features"
      sx={{
        py: 17,
        backgroundColor: "background.paper",
      }}
    >
      <Container>
        <Box>
          <Typography
            sx={{
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "text.secondary",
            }}
            variant="caption"
          >
            Our services
          </Typography>
          <Typography
            mb={2.5}
            mt={{ xs: 2, lg: 4 }}
            variant="h2"
            component="h3"
            maxWidth={{
              lg: 650,
            }}
          >
            The easiest way to onboard <br /> the masses to Web3
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth={{
              lg: 480,
            }}
          >
            Onboarding the masses to Web3 presents a significant challenge. We
            address this issue by providing you with many tools that allow you
            to engage with your customers, including Web2 users.
          </Typography>
        </Box>

        <Stack mt={10} gap={14}>
          <FeatureItem
            num="1."
            title="Gasless minting"
            subtitle="Your users don't need to pay anything to claim the NFT, including the gas fee."
            image="./gasless.png"
          />
          <FeatureItem
            num="2."
            title="Web2 users"
            subtitle="Your Web2 users can claim the NFT using their email. Once their wallets are ready, they can retrieve it without any fees, ever."
            image="./feature-web2.png"
          />
          <FeatureItem
            num="3."
            title="Easy-to-use templates"
            subtitle="You don't need to start from scratch; we provide templates to help you start the airdrop right away."
            image="./feature-template.png"
          />
        </Stack>
      </Container>
    </Box>
  );
}

type FeatureItemProps = {
  num: string;
  title: string;
  subtitle: string;
  image: string;
};

function FeatureItem({
  num,
  title,
  subtitle,
  image,
}: FeatureItemProps): JSX.Element {
  return (
    <Stack
      direction={{
        xs: "column",
        lg: "row",
      }}
      gap={4}
      alignItems={{
        xs: "flex-start",
        lg: "center",
      }}
    >
      <Box
        flex={{
          xs: "none",
          lg: 1,
        }}
      >
        <Box
          maxWidth={{
            lg: 320,
          }}
        >
          <Typography variant="h4">{num}</Typography>
          <Divider sx={{ my: 3 }} />
          <Typography fontWeight="bold" variant="h6">
            {title}
          </Typography>
          <Typography mt={1} color="text.secondary" variant="body1">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Box
        width={{
          xs: "100%",
          lg: 544,
        }}
        height={420}
        borderRadius={5}
        bgcolor="primary.main"
      >
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </Box>
    </Stack>
  );
}
