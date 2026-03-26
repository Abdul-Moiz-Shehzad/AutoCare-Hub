import { useNavigate } from "react-router-dom";
function Sidebar() {
    const navigate = useNavigate();
    return (
        <div className="sidebar">
            <div className="sidebar-nav">
                <ul>
                    <li><a href="/" onClick={() => navigate("/")}>Home</a></li>
                    <li><a href="/about" onClick={() => navigate("/about")}>About</a></li>
                    <li><a href="/contact" onClick={() => navigate("/contact")}>Contact</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;