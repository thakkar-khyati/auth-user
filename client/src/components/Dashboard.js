const { Container, Typography } = require("@mui/material");

function Dashboard() {
    return (
        <>
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
                    Hello Admin
                </Typography>
            </Container>
        </>
    )
}

export default Dashboard