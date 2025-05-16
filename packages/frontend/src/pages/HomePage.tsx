import { useQuery, gql } from "@apollo/client";

const GET_HELLO = gql`
  query GetHello {
    hello
  }
`;

type HelloData = {
  hello: string;
};

const HomePage = () => {
  const { loading, error, data } = useQuery<HelloData>(GET_HELLO);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="home-page">
      <h1>Bienvenido a la Aplicación Monorepo</h1>
      <p>Mensaje del servidor: {data?.hello}</p>
    </div>
  );
};

export default HomePage;
