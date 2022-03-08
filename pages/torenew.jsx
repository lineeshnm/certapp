import React from 'react'
import Dashboard from '../components/Dashboard'
import AdminRenew from '../components/AdminRenew'
import { isAuth } from '../actions/auth';

const URL = process.env.URL

export default function ToRenew({certs}) {
  // console.log({certs})
  return (
    <>
    { isAuth() ? (<AdminRenew certs={certs} pageName="To Renew" />) :  (<Dashboard certs={certs} pageName="To Renew" />)}
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
    props: { certs: data.data.filter(row => row.renew && !row.renewed) }, // will be passed to the page component as props
    revalidate: 10
  }
}