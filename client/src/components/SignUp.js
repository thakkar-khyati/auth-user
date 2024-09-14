import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";

function SignUp({ signup, role }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await signup(formData);
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            })
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: "16px",
            }}
        >
            <Typography variant="h4" gutterBottom>
                {role ? `Sign up for ${role}` : "Sign Up"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: "400px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            fullWidth
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            fullWidth
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                </Box>
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                {success && (
                    <Typography color="success" sx={{ mt: 2 }}>
                        {success}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default SignUp;
