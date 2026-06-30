import dynamic from 'next/dynamic'
import SHome from '@/components/skeleton/SHome'
import { db } from '@/firebase'
import Activities from '@/components/homepage/Activities'
import QuotePopup from '@/components/homepage/QuotePopup'

const DivCarousel2 = dynamic(() => import('@/components/homepage/DivCarousel2'), { ssr: true, loading: () => <SHome /> })
const AdaptiveCarousel = dynamic(() => import("@/components/homepage/AdaptiveCarousel"), { ssr: true, loading: () => <SHome /> })
const Menu = dynamic(() => import("@/components/master/header"))
const Slider = dynamic(() => import("@/components/homepage/Slider"), { ssr: true, loading: () => <SHome /> })
const Journey = dynamic(() => import('@/components/homepage/Journey'), { ssr: true, loading: () => <SHome /> })
// const Counter = dynamic(() => import('@/components/homepage/Counter'), { ssr: false, loading: () => <SHome /> })
const Testimonials = dynamic(() => import('@/components/homepage/Testimonials'), { ssr: true, loading: () => <SHome /> })
const Authorities = dynamic(() => import("@/components/homepage/Authorities"), { ssr: true, loading: () => <SHome /> })
const WhatTheySay = dynamic(() => import("@/components/homepage/WhatSay"), { ssr: true, loading: () => <SHome /> })
const FerryPartners = dynamic(() => import("@/components/homepage/FerryPartners"), { ssr: true, loading: () => <SHome /> })


export default async function Home() {

  const res = await db.doc(`pages/homepage`).get();

  const InsightBanner = (await db.doc(`pages/allPageBanner`).get()).data();

  const desAndaman = await db.collection('destinationAndaman').get()

  const desEntryAndaman = desAndaman.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  //Getting Activity
  const actvtyAndaman = await db.collection("activity").get();
  const activityDataAndaman = [];
  actvtyAndaman.docs.forEach((act) => {
    const data = act.data();
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((item) => {
        activityDataAndaman.push({
          title: item.title || "",
          thumbnail: item.thumbnail || item.headerImage || data.headerImage || "",
          slug: item.slug || "",
          about: item.about || "",
          metaDescription: item.metaDescription || data.metaDescription || "",
          categoryName: data.name || ""
        });
      });
    }
  });


  //Getting Ferry
  const ferry = await db.collection("ferry").get();
  const ferryData = ferry.docs.map((fer) => {
    const data = fer.data()
    return { name: data.name, thumbnail: data.image, slug: data.slug }
  })

  //Getting Island Destination

  const resIsland = await db.collection("island").get()
  const entryIsland = resIsland.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  const portBlair = entryIsland.find(e => e.slug?.toLowerCase() === "/island/port-blair")
  const haveLock = entryIsland.find(e => e.slug?.toLowerCase() === "/island/havelock-island")
  const neilIsland = entryIsland.find(e => e.slug?.toLowerCase() === "/island/neil-island")

  //Getting Testimonials
  const testimonials = (await db.doc(`pages/testimonials`).get()).data().testimonials

  //Getting Travel Journey
  const tarvelJourney = (await db.doc(`pages/travelJourney`).get()).data()


// console.log(activityDataAndaman)

  return (

    <main>
      <Menu />
      <QuotePopup />
      <div >
        <Slider sliderData={res.data().banner} />

        <div style={{ marginTop: "3rem" }}>
          <AdaptiveCarousel
            mobileProps={{
              lightHead: "Handpicked Destination in Port Blair",
              button: { name: "All Destination", slug: portBlair?.slug || "/island/Port-Blair" },
              sliderContent: portBlair?.data,
              category: 'destination',
              backgroundImage: InsightBanner?.HomeBaliInsight
            }}
            desktopProps={{
              lightHead: "Handpicked Destination ",
              darkHead: "in Port Blair",
              button: { name: "All Destination", slug: portBlair?.slug || "/island/Port-Blair" },
              backgroundImage: InsightBanner.HomeBaliInsight,
              category: 'destination',
              sliderContent: portBlair?.data
            }}
          />


          <AdaptiveCarousel
            mobileProps={{
              lightHead: "Handpicked Destination in Havelock Island",
              button: { name: "All Destination", slug: haveLock?.slug || "/island/havelock-island" },
              sliderContent: haveLock?.data,
              category: 'destination',
              backgroundImage: InsightBanner?.HomeAndamanInsight
            }}
            desktopProps={{
              lightHead: "Handpicked Destination ",
              darkHead: "in Havelock Island",
              button: { name: "All Destination", slug: haveLock?.slug || "/island/havelock-island" },
              backgroundImage: InsightBanner.HomeAndamanInsight,
              category: 'destination',
              sliderContent: haveLock?.data
            }}
          />


          <AdaptiveCarousel
            mobileProps={{
              lightHead: "Handpicked Destination in Neil Island",
              button: { name: "All Destination", slug: neilIsland?.slug || "/island/Neil-Island" },
              sliderContent: neilIsland?.data,
              category: 'destination',
              backgroundImage: InsightBanner?.HomeAndamanInsight
            }}
            desktopProps={{
              lightHead: "Handpicked Destination ",
              darkHead: "in Neil Island",
              button: { name: "All Destination", slug: neilIsland?.slug || "/island/Neil-Island" },
              backgroundImage: InsightBanner.HomeAndamanInsight,
              category: 'destination',
              sliderContent: neilIsland?.data
            }}
          />


          <AdaptiveCarousel
            mobileProps={{
              lightHead: "Luxury Cruises In Andaman",
              button: { name: "All Cruises", slug: "#" },
              sliderContent: ferryData,
              category: 'cruise',
              backgroundImage: InsightBanner?.HomeCruizeInsight
            }}
            desktopProps={{
              lightHead: "Luxury Cruises",
              darkHead: " In Andaman",
              button: { name: "All Cruises", slug: "/cruises" },
              backgroundImage: InsightBanner.HomeCruizeInsight,
              sliderContent: ferryData,
              category: 'cruise'
            }}
          />

          <DivCarousel2 title={"Popular Activities in Andaman"} sliderContent={activityDataAndaman} backgroundImage={InsightBanner.HomeAndamanInsight} />
        </div>

        {/* <Activities/> */}

        <Journey youtube={tarvelJourney} />

        {/* <Counter /> */}
        <Testimonials testimonialsData={testimonials} />

        <WhatTheySay />
        <FerryPartners />
        <Authorities />


      </div>


    </main>

  )
}


