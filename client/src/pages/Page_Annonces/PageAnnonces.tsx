import "./PageAnnonces.css";
import { UserProvider } from "../../Context/UserContext";
import Annonces from "../../composants/Annonces/Annonces";
import Navbar from "../../composants/NavBar/NavBar";

export default function PageAnnonces() {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Annonces />
      </UserProvider>
    </>
  );
}
