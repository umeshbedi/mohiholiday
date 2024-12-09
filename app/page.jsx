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

  const desBali = await db.collection('destinationBali').get()
  const desEntryBali = desBali.docs.map((entry) => {
    return ({ id: entry.id, ...entry.data() })
  });

  //Getting Activity
  const actvtyAndaman = await db.collection("activityAndaman").get();
  const activityDataAndaman = actvtyAndaman.docs.map((act) => {
    const data = act.data()
    return { name: data.name, thumbnail: data.thumbnail, slug: data.slug }
  })

  const actvtyBali = await db.collection("activityBali").get();
  const activityDataBali = actvtyBali.docs.map((act) => {
    const data = act.data()
    return { name: data.name, thumbnail: data.thumbnail, slug: data.slug }
  })

  //Getting Ferry
  const ferry = await db.collection("ferry").get();
  const ferryData = ferry.docs.map((fer) => {
    const data = fer.data()
    return { name: data.name, thumbnail: data.image, slug: data.slug }
  })

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
              button={{ name: "All Destination", slug: "/destination/port-blair" }}
              sliderContent={desEntryBali}
              category={'destination'}
            />
          ) : (
            <DivCarousel
              lightHead={"Handpicked Destination "}
              darkHead={"in Port Blair"}
              button={{ name: "All Destination", slug: "/destination/port-blair" }}
              backgroundImage={InsightBanner.HomeBaliInsight}
              category={'destination'}
              sliderContent={desEntryBali}
            />

          )}


          {mobile() ? (
            <DivCarouselMobile
              lightHead={"Handpicked Destination in Havelock Island"}
              // darkHead={"in Bali"}
              button={{ name: "All Destination", slug: "/destination/havelock" }}
              sliderContent={desEntryAndaman}
              category={'destination'}
            />
          ) : (
            <DivCarousel
              lightHead={"Handpicked Destination "}
              darkHead={"in Havelock Island"}
              button={{ name: "All Destination", slug: "/destination//havelock" }}
              backgroundImage={InsightBanner.HomeAndamanInsight}
              category={'destination'}
              sliderContent={desEntryAndaman}
            />

          )}


          {mobile() ? (
            <DivCarouselMobile
              lightHead={"Handpicked Destination in Neil Island"}
              // darkHead={"in Bali"}
              button={{ name: "All Destination", slug: "/destination/neil" }}
              sliderContent={desEntryAndaman}
              category={'destination'}
            />
          ) : (
            <DivCarousel
              lightHead={"Handpicked Destination "}
              darkHead={"in Neil Island"}
              button={{ name: "All Destination", slug: "/destination/neil" }}
              backgroundImage={InsightBanner.HomeAndamanInsight}
              category={'destination'}
              sliderContent={desEntryAndaman}
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


