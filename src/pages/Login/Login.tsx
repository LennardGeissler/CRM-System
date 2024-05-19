import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

interface LoginProps {
    handleLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [isName, setIsName] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [isPassword, setIsPassword] = useState(false);

    const handleClick = async (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        try {
            const response = await fetch('http://localhost:3000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameInput,
                    password: passwordInput,
                }),
            });
            const data = await response.json();
            console.log(data);

            if (data.success) {
                handleLogin();
                navigate('/deals'); // Assuming the token is hardcoded for this example
            } else {
                setIsName(false);
                setIsPassword(false);
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }

    }

    const handleNameInput = (e: any) => {
        setNameInput(e.target.value);
        setIsName(!!e.target.value);
    }

    const handlePasswordInput = (e: any) => {
        setPasswordInput(e.target.value);
        setIsPassword(!!e.target.value);
    }

    return (
        <div>
            <section className="login">
                <h1>Welcome back!</h1>
                <p>Log in to your account to continue</p>
                <form action="">
                    <div className="name">
                        <div>
                            <span className="material-symbols-outlined">
                                mail
                            </span>
                        </div>
                        <input type="text" name="name" id="name" placeholder="Max Mustermann" onChange={handleNameInput} value={nameInput} style={{ border: (submitted && !isName) ? '1px solid red' : (submitted && isName) ? '1px solid green' : '' }} />
                    </div>

                    <div className="password">
                        <div>
                            <span className="material-symbols-outlined">
                                lock
                            </span>
                        </div>
                        <input type="password" name="password" id="password" placeholder="passwort123" onChange={handlePasswordInput} value={passwordInput} style={{ border: (submitted && !isPassword) ? '1px solid red' : (submitted && isPassword) ? '1px solid green' : '' }} />
                    </div>

                    <button onClick={handleClick} type="button">Log In</button>
                    {submitted && !isName ? <span style={{ display: "block", marginTop: 10 }}>Invalid name!</span> : ''}
                    {submitted && !isPassword ? <span style={{ display: "block", marginTop: 10 }}>Invalid password!</span> : ''}
                </form>

                <div className="line"></div>


            </section>
        </div>
    );
}

export default Login;