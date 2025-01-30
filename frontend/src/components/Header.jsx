import react from 'react';
import Searchbar from './Searchbar';
import '../css/main.css';

function Header(){
    return(
        <div className="header">
            <Searchbar/>
        </div>
    )
}

export default Header;