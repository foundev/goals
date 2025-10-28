import { useState } from 'react';
import { Avatar, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await register(fullName, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Unable to create account. Please try again.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <PersonAddAlt1Icon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
                helperText="Use at least 8 characters."
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button type="submit" fullWidth variant="contained" color="secondary">
                Sign Up
              </Button>
              <Typography variant="body2" textAlign="center">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Sign In
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Register;
