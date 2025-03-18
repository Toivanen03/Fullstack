import LoginForm from './LoginForm'

const Login = ({ show, setToken, setMessage, setMessageType, setPage }) => {

    if (!show) return null

    return (
        <div>
            <h2>Login</h2>
            <LoginForm
                setToken={setToken}
                setMessage={setMessage}
                setMessageType={setMessageType}
                setPage={setPage}
            />
        </div>
    )
}

export default Login