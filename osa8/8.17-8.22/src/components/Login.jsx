import LoginForm from './LoginForm'

const Login = ({ show, setToken, setError, setPage }) => {

    if (!show) return null

    return (
        <div>
            <h2>Login</h2>
            <LoginForm
            setToken={setToken}
            setError={setError}
            setPage={setPage}
            />
        </div>
    )
}

export default Login