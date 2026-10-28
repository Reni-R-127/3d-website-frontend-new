import HomeBulkOrders from "../components/HomePage/HomeBulkOrders/HomeBulkOrders";
import HomeContactCTA from "../components/HomePage/HomeContactCTA/HomeContactCTA";
import HomeCustomPrinting from "../components/HomePage/HomeCustomPrinting/HomeCustomPrinting";
import HomeFAQ from "../components/HomePage/HomeFAQ/HomeFAQ";
import HomeFeaturedProducts from "../components/HomePage/HomeFeaturedProducts/HomeFeaturedProducts";
import HomeHero from "../components/HomePage/HomeHero/HomeHero";
import HomeKidsCreativeKits from "../components/HomePage/HomeKidsCreativeKits/HomeKidsCreativeKits";
import HomePersonalizedGifts from "../components/HomePage/HomePersonalizedGifts/HomePersonalizedGifts";
import HomePhotoTo3D from "../components/HomePage/HomePhotoTo3D/HomePhotoTo3D";
import HomeProductCategories from "../components/HomePage/HomeProductCategories/HomeProductCategories";
import HomeReviews from "../components/HomePage/HomeReviews/HomeReviews";
import HomeServices from "../components/HomePage/HomeServices/HomeServices";
import HomeWhoWeAre from "../components/HomePage/HomeWhoWeAre/HomeWhoWeAre";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeWhoWeAre />
      <HomeServices />
      <HomeProductCategories />
      <HomePersonalizedGifts />
      <HomeCustomPrinting />
      <HomePhotoTo3D />
      <HomeBulkOrders />
      <HomeKidsCreativeKits />
      <HomeFeaturedProducts />
      <HomeReviews />
      <HomeFAQ />
      <HomeContactCTA />
    </>
  );
}