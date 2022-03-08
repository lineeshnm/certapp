import React from 'react'
import Dashboard from '../components/Dashboard'
import AdminDashboard from '../components/AdminDashboard'
import { isAuth } from '../actions/auth';

const URL = process.env.URL

export default function Renewed({certs}) {
  // console.log({certs})
  return (
    <>
    { isAuth() ? (<AdminDashboard certs={certs} pageName="Admin Renewed" />) :  (<Dashboard certs={certs} pageName="Renewed" />)}
    </>
  )
}

export const getStaticProps = async (context) => {

  const res = await fetch(`${URL}/api/certs`)
  const data = await res.json()
  // console.log({data})
  if (!data.success) {
    return {
      notFound: true,
      revalidate: 10
    }
  }
  return {
    props: { certs: data.data.filter(row => row.renewed) }, // will be passed to the Name component as props
    revalidate: 10
  }
}