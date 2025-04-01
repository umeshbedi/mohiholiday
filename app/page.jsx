import dynamic from 'next/dynamic'
import { mobile } from '@/components/utils/variables'
import SHome from '@/components/skeleton/SHome'
import { db } from '@/firebase'
import Activities from '@/components/homepage/Activities'



const DivCarousel = dynamic(() => import("@/components/homepage/DivCarousel"), { ssr: true, loading: () => <SHome /> })
const DivCarousel2 = dynamic(() => import('@/components/homepage/DivCarousel2'), { ssr: true, loading: () => <SHome /> })
const DivCarouselMobile = dynamic(() => import('@/components/homepage/DivCarouselMobile'), { ssr: true, loading: () => <SHome /> })
const Menu = dynamic(() => import("@/components/master/header"))
const Slider = dynamic(() => import("@/components/homepage/Slider"), { ssr: true, loading: () => <SHome /> })
const Journey = dynamic(() => import('@/components/homepage/Journey'), { ssr: true, loading: () => <SHome /> })
// const Counter = dynamic(() => import('@/components/homepage/Counter'), { ssr: false, loading: () => <SHome /> })
const Testimonials = dynamic(() => import('@/components/homepage/Testimonials'), { ssr: true, loading: () => <SHome /> })
const Authorities = dynamic(() => import("@/components/homepage/Authorities"), { ssr: true, loading: () => <SHome /> })
const WhatTheySay = dynamic(() => import("@/components/homepage/WhatSay"), { ssr: true, loading: () => <SHome /> })


export default async function Home() {

  const res = await db.doc(`pages/homepage`).get();

  const InsightBanner = (await db.doc(`pages/allPageBanner`).get()).data();

  const desAndaman = await db.collection('destinationAndaman').get()

  const desEntryAndaman = desAndaman.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  //Getting Activity
  const actvtyAndaman = await db.collection("activity").get();
  const activityDataAndaman = actvtyAndaman.docs.map((act) => {
    const data = act.data()
    return { name: data.name, thumbnail: data.headerImage, slug: data.slug, count:data.data.length }
  })


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

  const portBlair = entryIsland.filter(e=>e.slug=="/island/Port-Blair")[0]
  const haveLock = entryIsland.filter(e=>e.slug=="/island/Havelock-Island")[0]
  const neilIsland = entryIsland.filter(e=>e.slug=="/island/Neil-Island")[0]

  //Getting Testimonials
  const testimonials = (await db.doc(`pages/testimonials`).get()).data().testimonials

  //Getting Travel Journey
  const tarvelJourney = (await db.doc(`pages/travelJourney`).get()).data()




  return (

    <main>
      <Menu />

      <div >
        <Slider sliderData={res.data().banner} />

        <div style={{ marginTop: "3rem" }}>
          {mobile() ? (
            <DivCarouselMobile
              lightHead={"Handpicked Destination in Port Blair"}
              // darkHead={"in Bali"}
              button={{ name: "All Destination", slug: "/island/Port-Blair" }}
              sliderContent={portBlair.data}
              category={'destination'}
            />
          ) : (
            <DivCarousel
              lightHead={"Handpicked Destination "}
              darkHead={"in Port Blair"}
              button={{ name: "All Destination", slug: "/island/Port-Blair" }}
              backgroundImage={InsightBanner.HomeBaliInsight}
              category={'destination'}
              sliderContent={portBlair.data}
            />

          )}


          {mobile() ? (
            <DivCarouselMobile
              lightHead={"Handpicked Destination in Havelock Island"}
              // darkHead={"in Bali"}
              button={{ name: "All Destination", slug: "/island/Havelock-Island" }}
              sliderContent={haveLock.data}
              category={'destination'}
            />
          ) : (
            <DivCarousel
              lightHead={"Handpicked Destination "}
              darkHead={"in Havelock Island"}
              button={{ name: "All Destination", slug: "/island/Havelock-Island" }}
              backgroundImage={InsightBanner.HomeAndamanInsight}
              category={'destination'}
              sliderContent={haveLock.data}
            />

          )}


          {mobile() ? (
            <DivCarouselMobile
              lightHead={"Handpicked Destination in Neil Island"}
              // darkHead={"in Bali"}
              button={{ name: "All Destination", slug: "/island/Neil-Island" }}
              sliderContent={neilIsland.data}
              category={'destination'}
            />
          ) : (
            <DivCarousel
              lightHead={"Handpicked Destination "}
              darkHead={"in Neil Island"}
              button={{ name: "All Destination", slug: "/island/Neil-Island" }}
              backgroundImage={InsightBanner.HomeAndamanInsight}
              category={'destination'}
              sliderContent={neilIsland.data}
            />

          )}


          {mobile() ? (
            <DivCarouselMobile
              lightHead={"Luxury Cruises In Andaman"}
              // darkHead={"in Bali"}
              button={{ name: "All Cruises", slug: "#" }}
              sliderContent={ferryData}
              category={'cruise'}
            />
          ) : (
            <DivCarousel
              lightHead={"Luxury Cruises"}
              darkHead={" In Andaman"}
              button={{ name: "All Cruises", slug: "/cruises" }}
              backgroundImage={InsightBanner.HomeCruizeInsight}
              sliderContent={ferryData}
              category={'cruise'}
            />

          )}

          <DivCarousel2 title={"Activities in Andaman (India)"} sliderContent={activityDataAndaman} />
        </div>

        {/* <Activities/> */}

        <Journey youtube={tarvelJourney} />

        {/* <Counter /> */}
        <Testimonials testimonialsData={testimonials} />

        <WhatTheySay />
        <Authorities />


      </div>


    </main>

  )
}


