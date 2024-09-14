import { Box, Button } from "@mui/material";
import SignUp from "./SignUp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpAdmin() {
    const navigate = useNavigate();
    const signUpForAdmin = async (userData) => {
        const response = await axios.post(
            `http://localhost:3001/users/signup`,
            userData,
            {
                params: {
                    role: "admin",
                },
            }
        );
        return response
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    padding: 2,
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => { navigate("/signup/customer"); }}
                >
                    Sign up for Customer
                </Button>
            </Box>
            <SignUp signup={signUpForAdmin} role="Admin" />
        </>
    )
}

export default SignUpAdmin;