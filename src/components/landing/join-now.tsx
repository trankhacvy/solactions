import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { Cta } from "./buttons";

export function JoinNow(): JSX.Element {
  return (
    <Box component="section" bgcolor="background.paper" py={17}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          fontWeight="fontWeightSemiBold"
          color="text.secondary"
          textTransform="uppercase"
        >
          Start today
        </Typography>
        {/* @ts-ignore */}
        <Typography variant="hero" maxWidth={700} mx="auto" my={8}>
          Let's put the crypto on Twitter
        </Typography>
        {/* <Typography
          variant="body2"
          color="text.secondary"
          maxWidth={{
            xs: 310,
            md: 452,
          }}
          mb={4}
        >
          Stacks is a production-ready library of stackable content blocks built
          in React Native.
        </Typography> */}
        <Cta title="Try it now" />
      </Container>
    </Box>
  );
}
