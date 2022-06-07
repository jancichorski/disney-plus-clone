import React from "react";
import './Header.css';
import {auth, provider, authWithPopup} from '../firebase';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {selectUserName, selectUserPhoto, setSignoutState, setUserLoginDetails} from '../features/user/userSlice';
import { useEffect } from "react";

function Header(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if(user){
                setUser(user)
                navigate('/home', {replace: true})
            }
        })
    }, [username])

    const setUser = (user) => {
        dispatch(setUserLoginDetails({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
        }))
    }


    const handleAuth = () => {
        if(!username){
            authWithPopup().then((result) => {
            setUser(result.user);
            })
            .catch((err) => {
                alert(err)
            })
        } else {
            auth.signOut().then(() => {
                dispatch(setSignoutState())
                navigate('/', {replace: true})
            })
            .catch((err) => {
                alert(err.message)
            })
        }
    }

    const scrollToElement = (element) => {
        const scrollTo = document.getElementById(element);
        scrollTo.scrollIntoView();
    }

    return(
        <div className="header">
            <img className="header__logo" src="/images/logo.svg" alt=""/>
            { username? 
                <>
                    <div className="header__menu">
                        <a className="header__menuObject" id="home" href="/home">
                            <img className="header__menuObjectIcon" src="/images/home-icon.svg" alt=""/>
                            <p>MENU</p>
                        </a>
                        <div className="header__menuObject" onClick={() => scrollToElement('originals')}>
                            <img className="header__menuObjectIcon" src="/images/original-icon.svg" alt=""/>
                            <p>ORIGINALS</p>
                        </div>
                        <div className="header__menuObject" onClick={() => scrollToElement('movies')}>
                            <img className="header__menuObjectIcon" src="/images/movie-icon.svg" alt=""/>
                            <p>MOVIES</p>
                        </div>
                    </div>
                    <div className="header__signOut">
                        <img className="header__photo" src={userPhoto} alt={username}/>
                        <div className="header__signOutDropdown">
                            <span onClick={handleAuth}>Sign Out</span>
                        </div>
                    </div>
                </>
                    :
                <button onClick={handleAuth} className="header__signIn">LOG IN</button>
            }            
        </div>
    )
}

export default Header;