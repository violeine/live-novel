import { QueryClient, QueryClientProvider } from "react-query";
import { HomePage } from "../components/home";

const queryClient = new QueryClient();

const Home = () => {
  // And your own state logic to persist state

  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  );
};
export default Home;
