import axios from "axios";
import SignUp from "./SignUp";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SignUpCustomer() {
    const navigate = useNavigate();
    const signUpForCustomer = async (userData) => {
        const response = await axios.post(
            `http://localhost:3001/users/signup`,
            userData,
            {
                params: {
                    role: "customer",
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
                    onClick={() => { navigate("/signup/admin"); }}
                >
                    Sign up for Admin
                </Button>
            </Box>
            <SignUp signup={signUpForCustomer} role="Customer" />
        </>
    )
}

export default SignUpCustomer;