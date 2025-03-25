import "./PageAnnonces.css";
import Annonces from "../../composants/Annonces/Annonces";
import Navbar from "../../composants/NavBar/NavBar";
import { UserProvider } from "../../Context/UserContext";

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
