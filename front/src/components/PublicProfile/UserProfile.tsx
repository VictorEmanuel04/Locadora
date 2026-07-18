import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Rating,
  Typography
} from "@mui/material";

import { api, getApiError } from "../../services/api";
import {
  MoviePoster,
  MovieRow,
  SectionContainer,
  SectionTitle
} from "../Home/Home.styles";
import { PageContainer } from "../Profile/Profile.styles";

interface UserProfileData {
  id: string;
  name: string;
  createdAt: string;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    movie: {
      id: string;
      title: string;
      posterUrl: string | null;
      genre: string;
      releaseYear: number | null;
    };
  }>;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get(`/users/${userId}/profile`, {
        signal: controller.signal
      })
      .then((response) => {
        setProfile(response.data.data);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            getApiError(requestError, "Não foi possível carregar o perfil.")
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [userId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <PageContainer>
        <Alert severity="error">
          {error ?? "Perfil não encontrado."}
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          mb: 5
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "primary.main",
            fontSize: "2rem"
          }}
        >
          {profile.name.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography variant="h4" fontWeight={800}>
            {profile.name}
          </Typography>

          <Typography color="text.secondary">
            {profile.reviews.length} avaliação(ões)
          </Typography>
        </Box>
      </Box>

      <SectionContainer>
        <SectionTitle>Filmes avaliados</SectionTitle>

        {profile.reviews.length === 0 ? (
          <Typography color="text.secondary">
            Este usuário ainda não avaliou nenhum filme.
          </Typography>
        ) : (
          <MovieRow>
            {profile.reviews.map((review) => (
              <Box
                key={review.id}
                onClick={() => navigate(`/filme/${review.movie.id}`)}
                sx={{ cursor: "pointer", minWidth: 200 }}
              >
                <MoviePoster bgimage={review.movie.posterUrl ?? undefined} />

                <Typography fontWeight={700} sx={{ mt: 1 }} noWrap>
                  {review.movie.title}
                </Typography>

                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                  sx={{ color: "warning.main" }}
                />
              </Box>
            ))}
          </MovieRow>
        )}
      </SectionContainer>
    </PageContainer>
  );
}