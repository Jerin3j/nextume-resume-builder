import Banner from "../components/home/Banner";
import CallToAction from "../components/home/CallToAction";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import Testimonials from "../components/home/Testimonials";

const Home = () => {
  return (
    <div>
      <Banner />
      <Hero />
      <Features/>
      <Testimonials/>
      <CallToAction/>
      <Footer/>
    </div>
  );
};

export default Home;
