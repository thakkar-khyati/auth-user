import SignUp from "./SignUp";
import axios from "axios";

function SignUpAdmin() {

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
            <SignUp signup={signUpForAdmin} role="Admin" />
        </>
    )
}

export default SignUpAdmin;