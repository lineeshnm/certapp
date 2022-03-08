import React from 'react'
import Link from 'next/link'
import { signout, isAuth } from '../actions/auth';
import { useRouter } from 'next/router';
const APP_NAME = process.env.APP_NAME

const Header = () => {
    const router = useRouter();
    return (
        <>
        <div className="flex-grow px-12 lg:flex-row overflow-hidden max-w-[95%]  m-12 bg-white bg-opacity-10 rounded-2xl shadow-5xl relative z-2 border border-opacity-30 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm">
            <div className="flex justify-between w-full py-8 ">
                <div className="md:float-left block">
                    <Link href="/">
                        <a className="cursor-pointer font-bold text-4xl text-white drop-shadow-2xl">MCA</a>
                    </Link>
                </div>
                <div className="hidden md:float-left md:contents">
                <Link key='dashboard' href={`/`}>
                    <a className="header-item">
                        Expring Certificates
                    </a>
                </Link>
                <Link key='review' href={`/bulk`}>
                    <a className="header-item">
                        Update Multiple
                    </a>
                </Link>
                <Link key='torenew' href={`/torenew`}>
                    <a className="header-item">
                        Marked for Renew
                    </a>
                </Link>
                <Link key='nottorenew' href={`/nottorenew`}>
                    <a className="header-item">
                        Marked NotRequired
                    </a>
                </Link>
                <Link key='renewed' href={`/renewed`}>
                    <a className="header-item">
                        Renewed List
                    </a>
                </Link>
                { isAuth() && (
                    <>
                        <Link key='modify' href={`/modify`}>
                            <a className="header-item">
                                DB Modify
                            </a>
                        </Link>
                        <Link key='uploadtoDB' href={`/uploadtodb`}>
                            <a className="header-item">
                                UploadtoDB
                            </a>
                        </Link>
                    </>
                )}
                </div>
                {
                    !isAuth() && (
                        <div className="md:float-right block">
                            <Link href="/signin">
                                <a className="header-item text-2xl">Sign In</a>
                            </Link>
                        </div>
                    )
                }
                {
                    isAuth() && (
                        <div className="md:float-right block">
                            <Link href="/">
                                <a 
                                    className="header-item text-2xl" 
                                    onClick={() => signout(() => router.push(`/`))}
                                >Logout</a>
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
        </>
    )
}

export default Header
