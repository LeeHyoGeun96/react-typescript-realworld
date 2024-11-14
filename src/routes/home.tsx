import PagenatedAticles from '../components/PagenatedAticles';

interface HomePageProps {}

const HomePage = ({}: HomePageProps) => {
  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <PagenatedAticles />
    </div>
  );
};

export default HomePage;
