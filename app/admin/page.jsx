"use client"
import React, { useEffect, useState } from 'react'
import { message, Layout, Skeleton, Dropdown, Modal } from 'antd';
const { Header, Sider } = Layout
import { UserOutlined, LogoutOutlined, MailOutlined } from '@ant-design/icons'
import { auth, db } from '@/firebase';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import MenuAdmin from '@/components/admin/MenuAdmin';

const PageUpdate = dynamic(() => import('../../components/admin/PageUpdate'), { ssr: false, loading: () => <Skeleton /> })
const GeneralInfo = dynamic(() => import('../../components/admin/what2see/AddUpdateW2S'), { ssr: false, loading: () => <Skeleton /> })
const W2sList = dynamic(() => import('../../components/admin/what2see/w2sList'), { ssr: false, loading: () => <Skeleton /> })

const AttractionList = dynamic(() => import('../../components/admin/what2see/attraction/AttractionList'), { ssr: false, loading: () => <Skeleton /> })

const RentalList = dynamic(() => import('../../components/admin/rentals/RentalList'), { ssr: false, loading: () => <Skeleton /> })

// const Dashboard = dynamic(() => import('../../components/admin/Dashboard'), { ssr: false, loading: () => <Skeleton /> })
const Hompage = dynamic(() => import('../../components/admin/homepageAdmin/Hompage'), { ssr: false, loading: () => <Skeleton /> })
const AdminLogin = dynamic(() => import('../../components/admin/AdminLogin'), { ssr: false, loading: () => <Skeleton /> })
const AddPackage = dynamic(() => import('../../components/admin/packages/AddPackage'), { ssr: false, loading: () => <Skeleton /> })
const PackagesDetails = dynamic(() => import('../../components/admin/packages/AddPackageDetail'), { ssr: false, loading: () => <Skeleton /> })
const Ferry = dynamic(() => import('../../components/admin/ferry/Ferry'), { ssr: false, loading: () => <Skeleton /> })
// const Island = dynamic(() => import('../../components/admin/Island'), { ssr: false, loading: () => <Skeleton /> })
const Media = dynamic(() => import('../../components/admin/media/Media'), { ssr: false, loading: () => <Skeleton /> })

const Activity = dynamic(() => import('../../components/admin/activity/Activity'), { ssr: false, loading: () => <Skeleton /> })
const TestiMonials = dynamic(() => import('../../components/admin/AddTestimonials'), { ssr: false, loading: () => <Skeleton /> })


export default function Admin() {

  const [messageApi, contextHolder] = message.useMessage();

  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState([])
  const [content, setContent] = useState(<>Now You can Edit All the pages from here</>)

  const [open, setOpen] = useState(false)


  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user.providerData[0])
        setIsLogin(true);
      } else {
        console.log("User Not found");
      }
    })
  }, [])

  const items = [
    {
      label: user.email,
      key: 'email',
      icon: <MailOutlined />,
    },
    {
      label: 'Logout',
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: (e) => {
        auth.signOut()
          .then(() => {
            setIsLogin(false);
          });
      }
    },
  ]

  function onMenuClick(e) {
    if (e == 'homepage') {
      setContent(<Hompage />)
    }
    // else if (e == 'dashboard') {
    //   setContent(<Dashboard />)
    // }
    else if (e == 'addcruises') {
      setContent(<Ferry />)
    }
    else if (e == 'cruiseslist') {
      alert(e)
    }
    else if (e == "packageAndaman") {
      setContent(<AddPackage packageFor={e} />)
    }
    else if (e == 'packageBaliDetail' || e == "packageAndmanDetail") {
      setContent(<PackagesDetails packageFor={e == 'packageBaliDetail' ? 'packageBali' : 'packageAndaman'} />)
    }
    
    else if (e == 'activityBali' || e == "activityAndaman") {
      setContent(<Activity activityFor={e} />)
    }
    else if (e == 'Testimonials') {
      setContent(<TestiMonials />)
    }
    else if (e == 'generalInfo' || e == "destinationAndaman" || e == "destinationBali" ) {
      setContent(<W2sList pageName={e} />)
    }
    else if (e == "attractionAndaman" || e == "attractionBali") {
      setContent(<AttractionList pageName={e} />)
    }
    else if (e == "rentalAndaman" || e == "rentalBali") {
      setContent(<RentalList pageName={e} />)
    }

    else if (e == 'media') {
      setOpen(true)
    }

    else {
      setContent(<PageUpdate pageName={e} />)
      
    }
  }

  function Login(email, password) {
    setIsLoading(true)
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        messageApi.success("Signed In Successfully!");
        setIsLogin(true);
        setIsLoading(false)
      })
      .catch((error) => {
        messageApi.error(error.message, 5);
        setIsLoading(false)
      })


  }

  if (!isLogin) {
    return (
      <>
        {contextHolder}
        <AdminLogin
          login={(email, password) => Login(email, password)}
          isloading={isLoading}
        />
      </>
    )
  }

  return (
    <main >
      <div className='flex  h-screen'>
        <div className='bg-black'>
        <MenuAdmin menuClick={(e) => onMenuClick(e)} />

        </div>
        
        <div className='w-full'>
          <Header style={{ background: 'inherit', display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <Dropdown.Button
                menu={{ items }}
                icon={<UserOutlined />}
                placement='bottomRight'
                size='large'

              >
                Admin
              </Dropdown.Button>
            </div>

          </Header>
          <div style={{ padding: '0% 2%' }}>
            {content}
          </div>
        </div>

      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
      >
        <Media />
      </Modal>
    </main>
  )
}
