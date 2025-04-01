import React from 'react'

export default async function GetPackageData() {
   
      const res = await db.collection(`packageAndaman`).get()
      // console.log(res)
  
      const entry = res.docs.map((entry) => {
          return ({ id: entry.id, ...entry.data() })
      });
      let allData = []
      for (let i = 0; i < entry.length; i++) {
          const getData = await db.doc(`packageAndaman/${entry[i].id}`).collection("singlePackage").where("status", "==", "published").get()
          const data = getData.docs.map((d) => ({ id: d.id, ...d.data() }))
          allData.push({ parentID: entry[i].id, childData: data })
      }
  
      const bannerAndaman = (await db.doc(`pages/allPageBanner`).get()).data().PackageAndamanPage;
  
      console.log(allData)
  return (
    <div>getPackageData</div>
  )
}
