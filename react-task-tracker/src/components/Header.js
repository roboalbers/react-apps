import PropTypes from "prop-types";
import Button from "./Button";
import { useLocation } from 'react-router-dom';
//De-structure props.title to {title}
const Header = ({ title, onAdd, showAdd }) => {
	const location = useLocation();
	return (
		<header className="header">
			<h1>{title}</h1>
			{location.pathname === "/" && <Button onClick={onAdd} text={showAdd ? "Close" : "Add"} color={showAdd ? "red" : "green"} />}
		</header >
	);
};

//If no prop is provided this will be default
Header.defaultProps = {
	title: "Task Tracker",
};

//Proptypes used to define what type of prop is coming.
//Use isRequired for required props.
Header.propTypes = {
	title: PropTypes.string,
};

export default Header;
