import { QueryClient, QueryClientProvider } from "react-query";
import { HomePage } from "../components/home";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  );
};
export default Home;
