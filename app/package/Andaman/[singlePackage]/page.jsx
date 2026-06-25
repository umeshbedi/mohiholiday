import dynamic from 'next/dynamic'
import Image from 'next/image'
import React from 'react'
import style from '@/styles/packageName.module.css'
import { mobile } from '@/components/utils/variables'
import { Collapse, Divider, Skeleton } from 'antd'
import { ClockCircleFilled } from '@ant-design/icons'
import { db } from '@/firebase'
import String2Html from '@/components/master/String2Html'
import ContactForm from '@/components/master/ContactForm'
import PackageEnquiryWidget from '@/components/master/PackageEnquiryWidget'
import { FaBed, FaTag, FaTags } from 'react-icons/fa'
import FAQ from '@/components/master/FAQ'
import SingleTile from '../../SingleTile'

const Menu = dynamic(() => import("@/components/master/header"), { ssr: true })
const HeadImage = dynamic(() => import("@/components/master/HeadImage"), { ssr: true })


export default async function SinglePackage({ params, searchParams }) {


    const { singlePackage } = await params;

    // console.log(singlePackage)

    const res = await db.collection(`packageAndaman`).get()
    const entry = res.docs.map((entry) => {
        return ({ id: entry.id })
    });
    // console.log(entry)
    let finalData = []
    for (let i = 0; i < entry.length; i++) {
        const getData = await db.doc(`packageAndaman/${entry[i].id}`).collection("singlePackage").where("slug", "==", `/package/Andaman/${singlePackage}`).get()
        const data = getData.docs.map((d) => ({ id: d.id, ...d.data() }))
        if (data.length != 0) {
            finalData = data
            break
        }
    }

    let allData = []
    for (let i = 0; i < entry.length; i++) {
        const getData = await db.doc(`packageAndaman/${entry[i].id}`).collection("singlePackage").where("status", "==", "published").get()
        const data = getData.docs.map((d) => ({ id: d.id, ...d.data() }))
        data.map((item) => {
            allData.push(item)
        })
        // allData.push({ parentID: entry[i].id, childData: data })
    }


    let sortedData = []

    function GetRand(num) {
        var ran = Math.floor(Math.random() * num)
        if (num > 4 && num - ran >= 4) {
            for (let index = 0; index < 4; index++) {
                sortedData.push(allData[ran])
                ran += 1

            }
        }
        else if (num <= 4) {
            for (let index = 0; index < num; index++) {
                sortedData.push(allData[index])
            }
        }
        else { GetRand(num) }
    }

    GetRand(allData.length)




    function Include({ icon, name }) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexWrap: 'wrap' }}>
                <Image src={icon} alt={name} width={35} height={35} />
                <p style={{ fontSize: '.8rem' }}>{name}</p>
            </div>
        )
    }

    function CostSection() {
        return (
            <>
                <div style={{ background: 'white', width: '100%' }}>
                    <img src='/images/tripadvisor.jpg' alt='tripadvisor' style={{ width: '100%' }} loading='lazy' />
                    {/* <div style={{ background: "var(--primaryColor)", padding: '5%', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <h4 style={{ fontSize: '15px', color: "rgba(255,255,255,.7)", textDecoration: 'line-through' }}>{query.packageName == "Bali" ? "IDR" : "₹"} {(Number(data.price) + (Number(data.price) * 30 / 100)).toFixed(0)}</h4>
                            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Package Cost : {query.packageName == "Bali" ? "IDR" : "₹"}{data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h4>
                            <h4 style={{ fontSize: '15px', color: "rgba(255,255,255,.7)" }}>{"(inclusive 5% GST)"}</h4>
                        </div>
                        <div style={{ padding: "3px 12px", background: style.primaryColor, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content', fontWeight: 'bold', borderRadius: 20 }}>
                            <h4 style={{ fontSize: 16 }}>Save 30%</h4>
                        </div>
                    </div> */}
                    <div style={{ padding: '5%' }}>
                        <p style={{ fontWeight: '800', color: "var(--primaryColor)", fontSize: 20, marginBottom: 5 }}><FaTags /> Without Hotel</p>
                        {data.hotelExName != undefined &&
                            data.hotelExName.map((item, index) => (
                                <p key={index}>{item}</p>
                            ))}
                        <Divider style={{ backgroundColor: style.lightGrey, margin: "10px 0" }} />
                        {/* <p style={{ fontWeight: '800', color: "var(--primaryColor)", fontSize:20, marginBottom:5 }}>Without Hotel</p>
                        <Divider style={{ backgroundColor: style.lightGrey, margin: "10px 0" }} /> */}
                        <p style={{ fontWeight: '800', color: "var(--primaryColor)", fontSize: 20, marginBottom: 5 }}><FaBed /> Include Hotel</p>
                        {data.hotelName && data.hotelName.map((item, index) => (
                            <p key={index}>{item}</p>
                        ))}
                    </div>
                </div>

                <Divider style={{ backgroundColor: style.lightGrey, height: 1 }} />
            </>
        )
    }

    const data = finalData[0]


    if (data == undefined) return (<div style={{ height: '30vh', padding: '2%' }}><Skeleton active /></div>)

    let travelArr = []
    data.travelJourney.map((d, i) => { travelArr.push(i) })

    console.log('[SinglePackage] data.images:', data.images)
    console.log('[SinglePackage] image[0]:', data.images?.[0])

    return (

        <main style={{ backgroundColor: "#f1f1f1" }}>


            <div>
                <Menu />
                <HeadImage image={data.images[0]} />

                <div
                    className='backCurve5'
                    style={{ display: 'flex', justifyContent: 'center', }} id='packageContainer'>
                    <div className={style.packageLayout}>
                        <div className={style.mainContent}>
                            <h1 className="sm:text-3xl text-2xl">
                                {data.title}
                            </h1>

                            <h3 id='packageDetail' ><ClockCircleFilled /> {data.subtitle}</h3>
                            <Divider style={{ margin: '2%' }} />

                            {data.isPrice == true && <div className={style.mobileCostSection}><CostSection /></div>}

                            <div>
                                <h2>Includes</h2>
                                <div className={style.includeGrid}>
                                    {data.includeIcon.map((item, i) => (
                                        <Include key={i} icon={item.icon} name={item.name} />
                                    ))}

                                </div>
                            </div>

                            <Divider style={{ margin: '2%' }} />

                            <h2>Overview</h2>
                            <String2Html id={'overview'} string={data.overview} />

                            <Divider style={{ margin: '2%' }} />

                            <h2>Highlights</h2>
                            <String2Html id={'highlights'} string={data.highlights} />

                            <Divider style={{ margin: '2%' }} />

                            <h2>Travel Journey</h2>
                            <Collapse
                                className={style.travelCollapse}
                                size='large'
                                defaultActiveKey={travelArr}
                                accordion={false}
                                items={data.travelJourney.map((tj, i) => {
                                    return {
                                        key: i,
                                        label: <h4 style={{ margin: 0 }}>{tj.heading}</h4>,
                                        children: <div>
                                            <p>{tj.content}</p>
                                            {tj.image &&
                                                <img src={tj.image} alt={tj.heading} loading='lazy' style={{ width: '100%', borderRadius: '20px', marginTop: 10 }} />
                                            }
                                        </div>
                                    }
                                })}
                            />

                            <Divider style={{ margin: '2%' }} />

                            <h2>Inclusion</h2>
                            <String2Html id={'inclusion'} string={data.inclusion} />

                            <Divider style={{ margin: '2%' }} />

                            <h2>Exclusions</h2>
                            <String2Html id={'exclusion'} string={data.exclusion} />

                            <FAQ />
                        </div>

                        <div className={style.mobileDivider}><Divider /></div>


                        <div className={style.sidebar}>

                            <img src='/images/tripadvisor.jpg' alt='tripadvisor' style={{ width: '100%' }} loading='lazy' />

                            <PackageEnquiryWidget
                                packageName={data.title}
                                packageDetail={data.subtitle}
                                price={data.price}
                                originalPrice={data.originalPrice}
                                hotelName={data.hotelName}
                            />
                            <Divider style={{ backgroundColor: style.lightGrey, height: 1 }} />

                            <div style={{ background: 'white', width: '100%', padding: '5%', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>

                                <h2 style={{ textAlign: 'center', padding: "0 10px 20px 10px", fontWeight: 800 }}>Explore more packages from Andaman</h2>
                                {sortedData.map((item, i) => {
                                    if (item.id !== data.id) {
                                        return (
                                            <div key={i} style={{ width: '100%', maxWidth: '350px', marginBottom: '2rem' }}>
                                                <SingleTile 
                                                    thumbnail={item.thumbnail} 
                                                    name={item.title} 
                                                    slug={item.slug} 
                                                    price={item.price} 
                                                    type={item.type} 
                                                />
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>



    )
}


