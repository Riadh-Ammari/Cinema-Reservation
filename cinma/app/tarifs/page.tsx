import TarifFetcher from "../_components/TarifFetcher"; // Adjust path as needed

const TarifPage = () => {
  return (
    <div style={{ color: "black", backgroundColor: "white", padding: "20px" }}>
      <TarifFetcher filmId={1} />
      <TarifFetcher filmId={5} />
      <TarifFetcher filmId={8} />
      <TarifFetcher filmId={3} />
      <TarifFetcher filmId={4} />
      <TarifFetcher filmId={6} />
    </div>
  );
};

export default TarifPage;
