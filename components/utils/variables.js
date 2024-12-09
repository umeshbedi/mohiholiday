export function mobile() {
    if (typeof window !== "undefined") {
      const { innerWidth: width } = window;
      if (width < 991) {
        return true
      } else {
        return false
      }
    }
  
  }

  export const boxShadow = '0 0 30px 0 rgba(0, 0, 0, 0.15)'
  export const textShadow = "2px 2px 4px #000000"

  export const IncludesIconName = [
    {name:"Breakfast", icon:"/icons/bREAKFAST.png"},
    {name:"Best Price", icon:"/icons/BEST PRICE.png"},
    {name:"Best Seller-2", icon:"/icons/BEST SELLER (2).png"},
    {name:"Best Seller", icon:"/icons/BEST SELLER.png"},
    {name:"Cab", icon:"/icons/CAB.png"},
    {name:"Candle Light Dinner", icon:"/icons/CANDLE LIGHT DINNER.png"},
    {name:"Co-ordinator", icon:"/icons/CORDINATOR.png"},
    {name:"Customer Happiness", icon:"/icons/CUSTOMER HAPPINESS.png"},
    {name:"Ferry", icon:"/icons/FERRY.png"},
    {name:"Hotel", icon:"/icons/HOTEL.png"},
    {name:"Jetski", icon:"/icons/JETSKI.png"},
    {name:"Local Expertys", icon:"/icons/LOCAL EXPERTYS.png"},
    {name:"No Hidden cost", icon:"/icons/NO HIDDEN COST.png"},
    {name:"ParaSailing", icon:"/icons/PARASAILING.png"},
    {name:"Scuba", icon:"/icons/SCUBA.png"},
    {name:"Sea Walk", icon:"/icons/SEA WALK dIVING.png"},
    {name:"Sight Seeing", icon:"/icons/SIGHTSEEING.png"},
    {name:"SnorKelling", icon:"/icons/SNORKELLING.png"},
    {name:"Tailor Made Packages", icon:"/icons/TAILOR MADE PACKAGES.png"},
    {name:"Water Sports", icon:"/icons/WATER SPORTS.png"},
    {name:"Accommodation", icon:"/icons/Accommodation Icon.png"},
    
  ]