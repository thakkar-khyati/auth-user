import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Typography, Container, Box } from "@mui/material";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/users/signin/admin", { email, password });
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            setError(error.response?.data?.message);
        }
    };

    return (
        <Container 
            maxWidth="xs" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100vh'
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <Typography variant="body1" paragraph>
                Please enter your email and password to login.
            </Typography>
            <Box 
                component="form" 
                onSubmit={handleLogin} 
                sx={{ width: '100%', mt: 1 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField 
                            variant="outlined"
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            variant="outlined"
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Grid>
                </Grid>
                <Button 
                    type="submit"
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    Don't have an account? <Link to="/">Sign up</Link>
                </Typography>
                {error && (
                    <Box sx={{ color: 'red', mt: 2 }}>
                        <Typography variant="body2">{error}</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default SignIn;
