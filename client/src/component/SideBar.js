import React, { useState } from 'react';
import { IoIosCreate } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import {
    FiGrid,
    FiUser,
    FiPieChart,
    FiShoppingCart,
    FiHeart,
    FiSettings,
} from "react-icons/fi";
import { AiOutlineBank } from "react-icons/ai";
import '../assesst/SideBar.css';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom'

// Define the sidebar links for teachers and students
const allLinks = {
    teacher: [
        {
            title: "Dashboard",
            icon: <FiGrid />,
            link: "/"
        },
        {
            title: "User",
            icon: <FiUser />,
            link: `/userprofile/${localStorage.getItem("id")}`
        },
        {
            title: "Create New Assessment",
            icon: <IoIosCreate />,
            link: "/createAssessment"
        },
        {
            title: "Student List",
            icon: <FiPieChart />,
            link: "/studentList"
        }, {
            title: "Question Bank",
            icon: <AiOutlineBank />,
            link: "/question-category"
        }
    ],
    student: [
        {
            title: "Dashboard",
            icon: <FiGrid />,
            link: "/"
        },
        {
            title: "Assignments History",
            icon: <FaHistory />,
            link: `/assessmentHistory/${localStorage.getItem("id")}`
        },
        {
            title: "User",
            icon: <FiUser />,
            link: `/userprofile/${localStorage.getItem("id")}`
        }
    ]
};


function BreakWord(name) {

    if (name.length > 10) {
        var words = name.split(' '); // Split the name into words
        return (
            <>

                {words.map((word, index) => (
                    <span key={index}>
                        {word}
                        {index < words.length - 1 && <br />}
                    </span>
                ))}
            </>
        );
    }
    return name;
}
const SideBar = () => {
    const [activeBar, setActiveBar] = useState(false);
    const nevigate = useNavigate();
    // Get user role from localStorage
    const UserRole = localStorage.getItem('role');

    // Determine the links based on user role
    const links = allLinks[UserRole] || [];

    const fullName = localStorage.getItem('fullName');
    const newName = fullName ? fullName.toLocaleUpperCase() : '';
    const handleLogout = () => {
        localStorage.clear();
        nevigate("/login");
    }
    return (
        <aside className={`sidebar ${activeBar ? "active" : ""}`}>

            <header className="header">
                <div className='user-name-wrapper'>
                    <img src="logo.png" style={{ width: '50px' }} />
                </div>
                <button
                    className="toggle-sidebar-btn"
                    onClick={() => setActiveBar(!activeBar)}
                >
                    |||
                </button>
            </header>

            <ul className="list-items">
                {Array.isArray(links) && links.map(({ title, icon, link }, index) => (
                    <li key={index} className="item">
                        <Link className="link" to={link}>
                            <figure className="link-icon">{icon}</figure>
                            <span className="link-name">{title}</span>
                        </Link>
                        <span className="tooltip">{title}</span>

                    </li>
                ))}
            </ul>
            <button className="logout-btn" >
                <Tooltip className='text-sm' title="Logout">
                    <span className="link-name" onClick={handleLogout}><CiLogout size={30} /></span>
                </Tooltip>
                <span className='user-name-wrapper'>{BreakWord(newName)}</span>
            </button>
        </aside>
    );
};

export default SideBar;
