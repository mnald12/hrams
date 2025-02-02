
import '../css/modal.css'
import '../css/profile.css'
import { AiOutlineCloseCircle } from "react-icons/ai"
import { BiUserCircle } from 'react-icons/bi'

const Profile = () => {
    return (
        <div className="modal" id="profile">
            <div className="modal-content">
                <button className='modal-close-btn' onClick={() => document.getElementById('profile').style.display = 'none'}>
                    <AiOutlineCloseCircle color='red' />
                </button>
                <div className='content-body'>
                    <h3><BiUserCircle /> <span>Account</span></h3>
                </div>
            </div>
        </div>
    )
}

export default Profile