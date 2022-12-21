import type { FC } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormHelperText } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';

export const Auth0Register: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { loginWithRedirect } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (): Promise<void> => {
    try {
      await loginWithRedirect({
        returnUrl: (router.query.returnUrl as string | undefined) || '/dashboard'
      });
    } catch (err) {
      console.error(err);

      if (isMounted()) {
        setError(err.message);
      }
    }
  };

  return (
    <div {...props}>
      {error && (
        <Box sx={{ my: 3 }}>
          <FormHelperText error>
            {error}
          </FormHelperText>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          onClick={handleRegister}
          variant="contained"
        >
          Register
        </Button>
      </Box>
    </div>
  );
};
