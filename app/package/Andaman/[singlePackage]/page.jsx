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
import { FaBed, FaTag, FaTags } from 'react-icons/fa'

const Menu = dynamic(() => import("@/components/master/header"), { ssr: true })
const HeadImage = dynamic(() => import("@/components/master/HeadImage"), { ssr: true })


export default async function SinglePackage({ params, searchParams }) {
    // { data, sortedData }

    // const { query } = useRouter()

    // const [packageName, setPackageName] = useState(null)
    // const [packageDetail, setPackageDetail] = useState(null)

    // const [isMobile, setIsMobile] = useState(false)

    // // console.log(sortedData)

    // useEffect(() => {
    //     setIsMobile(mobile())
    // }, [isMobile])

    const { singlePackage } = params

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


    function Tile({ thumbnail, name, slug }) {
        return (
            <div
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-duration="1000"
                className={style.tile} style={{ height: 350, width: 250, position: 'relative', borderRadius: 40, overflow: 'hidden', marginBottom: '2rem' }}>
                <a href={slug}>

                    <Image
                        src={thumbnail}
                        alt={name}
                        fill
                        style={{ objectFit: 'cover' }}
                        loading='lazy'
                        placeholder='blur'
                        blurDataURL={thumbnail + '?blur'}
                    />
                </a>
                <h1 style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    bottom: 20,
                    textAlign: 'center',
                    position: 'absolute',
                    width: '100% '
                }}
                >
                    {name}
                </h1>
            </div>
        )
    }

    function Include({ icon, name }) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Image src={icon} alt={name} width={40} height={40} />
                <p >{name}</p>
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
                        {data.hotelName.map((item, index) => (
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

    return (

        <main style={{ backgroundColor: "#f1f1f1" }}>


            <div>
                <Menu />
                <HeadImage image={data.images[0]}/>

                <div
                    className='backCurve5'
                    style={{ display: 'flex', justifyContent: 'center', }} id='packageContainer'>
                    <div style={{ width: '90%', display: "flex", gap: '4%', marginTop: '3%', flexDirection: mobile() ? "column" : "row" }}>
                        <div style={{ width: mobile() ? "100%" : "65%", background: 'white', padding: '3%', display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <h1 id='packageTitle'>
                                {data.title}
                            </h1>

                            <h3 id='packageDetail' ><ClockCircleFilled /> {data.subtitle}</h3>
                            <Divider style={{ margin: '2%' }} />

                            {mobile() && data.isPrice == true && <CostSection />}

                            <div>
                                <h2>Includes</h2>
                                <div style={{ display: 'grid', gridGap: 20, gridTemplateColumns: `repeat(${mobile() ? "2" : "4"}, auto)`, marginTop: '3%' }}>
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
                            size='large' 
                            defaultActiveKey={travelArr} 
                            accordion={false} style={{ background: 'none' }} 
                            items={data.travelJourney.map((tj, i)=>{
                                return {
                                    key:i, 
                                    label:<h4>{tj.heading}</h4>,
                                    children:<div>
                                    <p>{tj.content}</p>
                                    <img src={tj.image} alt={tj.heading} loading='lazy' style={{ width: '100%', borderRadius: '20px', marginTop: 10 }} />
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


                        </div>

                        {mobile() && <Divider />}


                        <div style={{ width: mobile() ? '100%' : '35%', height: 'fit-content', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>

                            {!mobile() && data.isPrice == true && <CostSection />}

                            <div style={{ background: 'white', width: '100%', padding: '5%', }}>

                                <ContactForm
                                    packageName={data.title}
                                    packageDetail={data.subtitle}
                                />
                            </div>
                            <Divider style={{ backgroundColor: style.lightGrey, height: 1 }} />

                            <div style={{ background: 'white', width: '100%', padding: '5%', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>

                                <h2 style={{ textAlign: 'center', padding: "0 10px 20px 10px" }}>Explore more packages from Andaman</h2>
                                {sortedData.map((item, i) => {
                                    if (item.id !== data.id) {
                                        return (
                                            <Tile key={i} name={item.title} slug={item.slug} thumbnail={item.thumbnail} />
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


// export async function getStaticProps(context) {

//     const { packageName, singlePackage } = context.params

//     const packagegroup = `${packageName == "Andaman" ? "packageAndaman" : packageName == "Bali" ? "packageBali" : null}`

//     const res = await db.collection(`package${packageName}`).get()
//     const entry = res.docs.map((entry) => {
//         return ({ id: entry.id })
//     });
//     // console.log(entry)
//     let finalData = []
//     for (let i = 0; i < entry.length; i++) {
//         const getData = await db.doc(`package${packageName}/${entry[i].id}`).collection("singlePackage").where("slug", "==", `/package/${packageName}/${singlePackage}`).get()
//         const data = getData.docs.map((d) => ({ id: d.id, ...d.data() }))
//         if (data.length != 0) {
//             finalData = [...data]
//             break
//         }
//     }

//     let allData = []
//     for (let i = 0; i < entry.length; i++) {
//         const getData = await db.doc(`${packagegroup}/${entry[i].id}`).collection("singlePackage").where("status", "==", "published").get()
//         const data = getData.docs.map((d) => ({ id: d.id, ...d.data() }))
//         data.map((item) => {
//             allData.push(item)
//         })
//         // allData.push({ parentID: entry[i].id, childData: data })
//     }

//     let sortedData = []

//     function GetRand(num) {
//         var ran = Math.floor(Math.random() * num)
//         if (num > 4 && num - ran >= 4) {
//             for (let index = 0; index < 4; index++) {
//                 sortedData.push(allData[ran])
//                 ran += 1

//             }
//         }
//         else if (num <= 4) {
//             for (let index = 0; index < num; index++) {
//                 sortedData.push(allData[index])
//             }
//         }
//         else { GetRand(num) }
//     }

//     GetRand(allData.length)



//     if (finalData.length == 0) {
//         return {
//             notFound: true
//         };
//     }

//     return {
//         props: {
//             data: finalData[0],
//             sortedData
//         },
//         revalidate: 10,
//     }
// }