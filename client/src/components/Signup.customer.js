import axios from "axios";
import SignUp from "./SignUp";

function SignUpCustomer() {

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
            <SignUp signup={signUpForCustomer} role="Customer" />
        </>
    )
}

export default SignUpCustomer;