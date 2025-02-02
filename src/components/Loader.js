import '../css/loader.css'
import { RotatingLines } from "react-loader-spinner"
const Loader = () => {
    return (
        <div className="loader">
            <RotatingLines
                strokeColor="midnightblue"
                strokeWidth="4"
                animationDuration="0.75"
                width="30"
                visible={true}
            /> Loading...
        </div>
    )

}

export default Loader