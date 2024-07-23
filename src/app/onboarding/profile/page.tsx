import Container from "@mui/material/Container";
import { ProfileFormWrapper } from "@/components/onboarding/form-wrapper";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Typography mb={5} variant="h4">
        Setup your profile
      </Typography>
      <ProfileFormWrapper />
    </Container>
  );
}
