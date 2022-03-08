import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Button from '@mui/material/Button';
import Router , { useRouter } from 'next/router';
import { isAuth } from '../../actions/auth';
import CertificateCard from '../../components/CertificateCard';
import Background from '../../components/Background';

const APP_NAME = process.env.APP_NAME
const URL = process.env.URL

const Server = ({cert}) => {
    // console.log(cert)
    const [serverName, setServerName] = useState(cert ? cert.serverName ? cert.serverName : '' : '');
    const [crNumber, setCrNumber] = useState(cert ? cert.crNumber ? cert.crNumber : '' : '')
    const [cTask, setCTask] = useState(cert ? cert.cTask ? cert.cTask : '' : '')
    const [approver, setApprover] = useState(cert ? cert.approver ? cert.approver : '' : '')
    const [logedinUser, setLogedinUser] = useState('');
    const [renewedBy, setRenewedBy] = useState(cert ? cert.renewedBy ? cert.renewedBy : '' : '');
    const [renew, setRenew] = useState(cert ? cert.renew? cert.renew: false : false)
    const [renewed, setRenewed] = useState(cert ? cert.renewed ? cert.renewed : false : false);
    const [renewDate, setRenewDate] = useState(cert ? cert.renewDate ? cert.renewDate : new Date() : new Date())
    const [validTo, setValidTo] = useState(cert ? cert.validTo ? cert.validTo : new Date() : new Date());
    const [renewedDate, setRenewedDate] = useState(cert ? cert.renewedDate ? cert.renewedDate : new Date() : new Date());
    const [resource, setResource] = useState(cert ? cert.resource ? cert.resource : '': '');
    const [errors, setErrors] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [modified, setModified] = useState(false);
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        let errs = validate()
        // console.log({errs})
        setErrors(errs)
        // console.log(renew, crNumber, cTask, date, approver, errors)
        setSubmitting(true)
    }

    useEffect(() => {
        if (submitting) {
            if (Object.keys(errors).length === 0) {
                // alert('Submit')
                updateDB()
            } else {
                setSubmitting(false)
            }
        }
        return () => {
            console.log("unmounted from errors")
        }
    }, [errors])

    useEffect(() => {
        if (process.browser) {
            const user = JSON.parse(localStorage.getItem('user'))
            setLogedinUser(user)
            // console.log(user, logedinUser)
        }
        return () => {
            console.log("unmounted from localstorage")
        };
    }, []);

    useEffect(() => {
        if (renewedBy === '') {
            isAuth() && logedinUser && setRenewedBy(logedinUser.name)
        }
        return () => {
            console.log("unmounted from logged in User")
        };
    }, [logedinUser]);

    // console.log({logedinUser})
    const updateDB = async () => {
        let id = cert._id
        if (renewed) {
            console.log("Renewed updating")
            try {
                const res =  await fetch(`${URL}/api/certs/${id}`, {
                    method: 'PUT',
                    headers: {
                        "Accept" : "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({validTo, renewed, renewedBy, renewedDate})
                })
                const data = await res.json()
                // console.log({data})
                // router.push("/torenew")
                Router.back()
            } catch (error) {
                console.log({error})
            }
        } else if(modified) {
            console.log("Modified updating")
            try {
                const res =  await fetch(`${URL}/api/certs/${id}`, {
                    method: 'PUT',
                    headers: {
                        "Accept" : "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({resource, serverName, crNumber})
                })
                const data = await res.json()
                // console.log({data})
                // router.push("/")
                Router.back()
            } catch (error) {
                console.log({error})
            }
        } else {
            console.log("Torenew updating")
            try {
                const res =  await fetch(`${URL}/api/certs/${id}`, {
                    method: 'PUT',
                    headers: {
                        "Accept" : "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({renew, crNumber, cTask: cTask, approver: approver, renewDate})
                })
                const data = await res.json()
                // console.log({data})
                // router.push("/")
                Router.back()
            } catch (error) {
                console.log({error})
            }
        }
        // console.log("inside update DB", id)
        

    }

    const validate = () => {
        let err = {}
        console.log("Inside validate ", renew, "crNumber:", crNumber, "ct:",cTask, "ap:", approver, renewedBy)
        if (renew) {
            if (crNumber === '') {
                err.crNumber = 'Please enter a Change Number'
            } 
            if (cTask === '') {
                err.cTask = 'Please enter a change task'
            } 
            if (approver === '') {
                err.approver = 'Please enter your Name'
            }
        } else if (modified) {
            if (resource === '') {
                err.resource = 'Please enter a Resource Name'
            } 
            if (serverName === '') {
                err.serverName = 'Please enter a Server Name'
            }
            if (crNumber === '') {
                err.crNumber = 'Please enter a Change Number'
            }
        } else if (renewed) {
            if (renewedBy === '') {
                err.renewedBy = 'Please enter your Name'
            }
        } else {
            if (approver === '') {
                err.approver = 'Please enter your Name'
            }
        }
        return err;
    }

    return (
        <div className='flex-grow px-12'>
            <div className="text-center text-4xl font-semibold text-white mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-widest">
                {APP_NAME} - Update Single Certificate
            </div>
            <div className='h-screen w-full relative overflow-hidden flex justify-center py-6'>
                <Background />
            { 
                !isAuth() && cert && (
                    <div sx={{ minWidth: 275 }} className='h-screen w-full px-12 mb-8 bg-white bg-opacity-10 rounded-2xl text-white shadow-5xl relative z-2 border border-opacity-30 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm'>
                        <Box sx={{ flexGrow: 1 }} >
                            <CertificateCard cert={cert} button={false} edit={false} />
                            <Grid container spacing={1} className='py-20'>
                                <Grid item xs={2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography sx={{ fontSize: 14 }} className='px-2'>Renew Certificate ?</Typography>
                                        <FormControlLabel control={<Switch checked={renew} />} label={renew? "Yes": "No"} onChange={(event) => setRenew(event.target.checked)}/>
                                    </Stack>
                                </Grid>
                                {
                                    renew &&
                                    <>
                                        <Grid item xs={2}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography sx={{ fontSize: 14 }} className='px-2'>Change Request</Typography>
                                                <TextField value={crNumber} placeholder="Change Number" color="primary" error={errors.crNumber ? true: false} onChange={(event) => setCrNumber(event.target.value)} />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography sx={{ fontSize: 14 }} className='px-2'>Change Task</Typography>
                                                <TextField value={cTask} placeholder="Change Task Number" color="primary" error={errors.cTask ? true: false} onChange={(event) => setCTask(event.target.value)} />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography sx={{ fontSize: 14 }} className='px-2'>Target Date</Typography>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Stack spacing={3}>
                                                    <DesktopDatePicker
                                                        label="Date"
                                                        inputFormat="MM/dd/yyyy"
                                                        value={renewDate}
                                                        onChange={(newDate) => setRenewDate(newDate)}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </Stack>
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography sx={{ fontSize: 14 }} className='px-2'>Approver Name</Typography>
                                        <TextField value={approver} placeholder="Enter Your Name" color="primary" error={errors.approver ? true: false} onChange={(event) => setApprover(event.target.value)} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography sx={{ fontSize: 14 }} className='px-2'>Are you Sure?</Typography>
                                        <Button variant="contained" onClick={handleSubmit} className='bg-blue-400' >Confirm</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </div>
                )

            }
            { isAuth() && cert && (
                    <div sx={{ minWidth: 275 }} className='h-screen w-full px-12 mb-8 bg-white bg-opacity-10 rounded-2xl text-white shadow-5xl relative z-2 border border-opacity-30 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm' >
                        <Box sx={{ flexGrow: 1 }} >
                            <div className='py-6'>
                            <CertificateCard cert={cert} button={false} edit={true} />
                            </div>
                            <Grid container spacing={1} className='py-20'>
                                <Grid item xs={2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography sx={{ fontSize: 14 }} className='px-2'>Certificate Renewed?</Typography>
                                        <FormControlLabel control={<Switch checked={renewed} />} label={renewed? "Yes": "No"} onChange={(event) => setRenewed(event.target.checked)}/>
                                    </Stack>
                                </Grid>
                                {
                                    renewed &&
                                    <>
                                        <Grid item xs={2}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography sx={{ fontSize: 14 }} className='px-2'>Renewed Date</Typography>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Stack spacing={3}>
                                                    <DesktopDatePicker
                                                        label="Date"
                                                        inputFormat="MM/dd/yyyy"
                                                        value={renewedDate}
                                                        onChange={(newDate) => setRenewedDate(newDate)}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography sx={{ fontSize: 14 }} className='px-2'>New Expiry Date</Typography>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Stack spacing={3}>
                                                    <DesktopDatePicker
                                                        label="Date"
                                                        inputFormat="MM/dd/yyyy"
                                                        value={validTo}
                                                        onChange={(newDate) => setValidTo(newDate)}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography sx={{ fontSize: 14 }} className='px-2'>Confirmed By</Typography>
                                                <TextField value={renewedBy} placeholder="Enter Your Name" color="primary" error={errors.renewedBy ? true: false} onChange={(event) => setRenewedBy(event.target.value)} />
                                            </Stack>
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography sx={{ fontSize: 14 }} className='px-2'>Are you Sure?</Typography>
                                        <Button variant="contained" onClick={handleSubmit} className='bg-blue-400' >Update</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default Server

export const getStaticProps = async ({params}) => {
    let id = params.id
    const res = await fetch(`${URL}/api/certs/${id}`)
    const data = await res.json()
    // console.log({data})
    if (!data.success) {
      return {
        notFound: true,
        revalidate: 10
      }
    }
    return {
      props: { cert: data.data }, // will be passed to the page component as props
      revalidate: 10
    }
}

export async function getStaticPaths() {
    // const posts = await getPosts();
    return {
      paths: [],
      fallback: true,
    };
  }
