import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}


const NavBarLoggedOutview = ({onSignUpClicked, onLoginClicked} : NavBarLoggedOutViewProps) => {
    return ( 
        <>
        <Button onClick={onSignUpClicked}>Sign Up</Button>
        <Button onClick={onLoginClicked}>Login</Button>
        </>
     );
}
 
export default NavBarLoggedOutview;