import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography, Container, Box } from "@mui/material";

function VerifyUser() {
    const navigate = useNavigate();
    const { token, id } = useParams();
    const [error, setError] = useState("");

    const handleVerify = async () => {
        try {
            await axios.get(`http://localhost:3001/users/validate/${id}/${token}`);

            navigate("/signin");
        } catch (error) {
            console.error("Verification failed:", error);
            setError(error.response?.data?.message);
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}
        >
            <Typography variant="h4" gutterBottom>
                Verify Your Account
            </Typography>
            <Typography variant="body1">
                Click the button below to verify your account. If the verification is successful, you will be redirected to the login page.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleVerify}
                sx={{ mb: 2 }} // Margin bottom for spacing
            >
                Verify Account
            </Button>
            {error && (
                <Box sx={{ color: 'red', mt: 2 }}>
                    <Typography variant="body2">{error}</Typography>
                </Box>
            )}
        </Container>
    );
}

export default VerifyUser;
