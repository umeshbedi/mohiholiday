"use client"
import React, { useState, useEffect } from 'react'
import { HomeOutlined, PlusOutlined, MenuOutlined, MedicineBoxOutlined, BookOutlined, WechatFilled } from '@ant-design/icons';
import { FaCar, FaEye, FaGoogleDrive, FaImage, FaList, FaMountain, FaNewspaper, FaShip, FaSwimmer } from 'react-icons/fa'
import { Menu } from 'antd';

export default function MenuAdmin({ menuClick }) {

const items = [
    {
      key: 'homepage',
      icon: <HomeOutlined />,
      label: 'Homepage',
    },
    {
      key: 'activityAndaman',
      icon: <FaSwimmer />,
      label: 'Activities',
    },

    {
      key: 'island',
      icon: <FaSwimmer />,
      label: 'Popular Islands',
    },

    {
      key: 'rentalAndaman',
      icon: <FaCar />,
      label: 'Rentals',
    },

    {
      key: 'addcruises',
      icon: <FaShip />,
      label: 'Cruises',
    },
    {
      key: 'packages',
      label: 'Packages',
      icon: <BookOutlined />,
      children: [
        {
          key: 'packageAndaman',
          icon: <MedicineBoxOutlined />,
          label: 'Add Package',
        },
        {
          key: 'packageAndmanDetail',
          icon: <MedicineBoxOutlined />,
          label: 'Add/Update Details',
        }
      ],
    },
    {
      key: 'Know',
      label: 'Know',
      icon: <FaNewspaper />,
      children: [
        {
          key: 'about-us',
          label: 'About Us',
        },
        {
          key: 'about-andman',
          label: 'About Andaman',
        },
        {
          key: 'dos-and-dont',
          label: `${"Do's & Don't"}`,
        },
        {
          key: 'generalInfo',
          label: `General information`,
        },
      ],
    },
    {
      key: 'Testimonials',
      icon: <WechatFilled />,
      label: 'Testimonials',
    },
    {
      key: 'media',
      icon: <FaImage />,
      label: 'Media',
    },
    
  ]

  return (
    <div style={{ width: 256 }} className='relative'>
      <Menu
        defaultSelectedKeys={['homepage']}
        defaultOpenKeys={['packages']}
        mode="inline"
        theme="dark"
        items={items}
        onClick={(e) => menuClick(e.key)}
      />
    </div>
  )
}
