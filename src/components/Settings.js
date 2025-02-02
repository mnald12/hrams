import '../css/modal.css'
import '../css/settings.css'
import { AiOutlineCloseCircle } from "react-icons/ai"
import { FaCogs } from "react-icons/fa"

const Settings = () => {
    return (
        <div className="modal" id="settings">
            <div className="modal-content">
                <button className='modal-close-btn' onClick={() => document.getElementById('settings').style.display = 'none'}>
                    <AiOutlineCloseCircle color='red' />
                </button>
                <div className='content-body'>
                    <h3><FaCogs /> <span>Settings</span></h3>
                </div>
            </div>
        </div>
    )
}

export default Settings