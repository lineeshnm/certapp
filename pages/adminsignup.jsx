import React, { useState, useEffect } from 'react';
import { signup, isAuth } from '../actions/auth';
import { useRouter } from 'next/router';
import Link from 'next/link'
import Tilt from 'react-parallax-tilt';
import Background from '../components/Background';
const APP_NAME = process.env.APP_NAME

const SignUp = () => {
    const [name, setName] = useState('Lineesh');
    const [email, setEmail] = useState('lineesh1@gmail.com');
    const [password, setPassword] = useState('acbd1234');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(true);
    const router = useRouter();
    useEffect(() => {
        // console.log(isAuth())
        isAuth() && router.push("/signin");
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true)
        setShowForm(false)
        setError(false)
        const user = { name, email, password };

        signup(user).then(data => {
            // console.log(data)
            if (data.error) {
                setError("Signup failed")
                setLoading(false)
                setShowForm(true)
            } else {
                setName('')
                setEmail('')
                setPassword('')
                setError('')
                setLoading(false)
                setMessage('Signup Completed')
                setShowForm(false)
                router.push(`/signin`);
            }
        });
    };

    const showLoading = () => (loading ? <div className="bg-red-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">Loading...</div> : '');
    const showError = () => (error ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div> : '');
    const showMessage = () => (message ? <div className="bg-red-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">{message}</div> : '');

    const signUpForm = () => {
        return (
            <div className="w-full relative flex justify-center items-center py-12">
                <Background />
                <Tilt>
                    <div className="container h-96 w-96 bg-white bg-opacity-10 rounded-2xl shadow-5xl relative z-2 border border-opacity-30 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm">
                        <form className='h-full flex flex-col justify-evenly items-center' onSubmit={handleSubmit} > 
                            <div className='text-white font-poppins text-2xl tracking-widest'>SignUp form</div>
                            <label className="text-white font-poppins text-1xl tracking-widest" name="username">
                                User Name
                            </label>
                            <input type="text" name="email" id="email" placeholder='Email Address' className='input-text' value={name} onChange={e => setName(e.target.value)} />
                            
                            <label className="text-white font-poppins text-1xl tracking-widest" name="emailid">
                                Email ID
                            </label>
                            <input type="text" name="email" id="email" placeholder='Email Address' className='input-text' value={email} onChange={e => setEmail(e.target.value)} />
                            <label className="text-white font-poppins text-1xl tracking-widest" name="password">
                                Password
                            </label>
                            <input type="password" id="password"  placeholder='Password' className='input-text' value={password} onChange={e => setPassword(e.target.value)} />
                            <div className='flex space-x-9'>
                                <input type="Submit" className='cursor-pointer font-poppins rounded-full px-5 py-1 bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-80 '/>
                                <Link href="/signin">
                                    <span className="cursor-pointer inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Sign In?</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </Tilt>
            </div>
        );
    };

    return (
        <div className='flex-grow px-12'>
            <div className="text-center text-4xl font-semibold text-white mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-widest">{`${APP_NAME} - SignUp`}</div>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signUpForm()}
        </div>
    );
};

export default SignUp;