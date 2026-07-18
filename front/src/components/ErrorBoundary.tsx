import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro ao renderizar a aplicação:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ minHeight: "100vh", p: 4, bgcolor: "background.default" }}>
          <Alert severity="error" sx={{ mx: "auto", maxWidth: 720 }}>
            <Typography fontWeight={700}>Não foi possível carregar a interface.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {this.state.error.message}
            </Typography>
            <Button sx={{ mt: 2 }} variant="outlined" color="inherit" onClick={() => window.location.reload()}>
              Recarregar
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
