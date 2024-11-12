import React, {useEffect, useState} from "react";
import { textarea } from "@material-tailwind/react";
export default function OCRTextView(props: {fileID: string}) {
    const [textBoxData, setTextBoxData] = useState('');
    useEffect(() => {
        //pull OCRed data from fileID
        setTextBoxData('MAINTENANCE RECORD DATE TOTAL TIME IN SERVICE HOURS 10THS DESCRIPTION OF THE WORK PERFORMED AUTHORIZED SIGNATURE< CERTIFICATE TYPE & NUMBER Belle Aircraft Maintenance 20 Lindbergh Ln, Fletcher, NC 28732 828684-9191 10/3/22 N262CP 182T SN:18283017 Tac:1384.8 Aftt: 1384.8 Hobbs: 1659.1 Performed an annual inspection\n' +
            'IAW FAR 43 Appendix D and Belle Aircraft Maintenance Inspection Guide. ELT tested IAW FAR 91.207 (d). ELT battery expired May 2027, Reconnected fuel cap chains. Removed and replace right tire and tube. Tightened loose ignition switch. Lubricated trim wheel and pulleys in cockpit. Resecured several wire holders in both leading edge access panels. I certify that this aircraft has been inspected IAW an annual inspection and determined to be in an airworthy condition. A&P 3598992 IA David G. Phillips');
    }, []);

    const handleTextBoxChange = (event) => {
        setTextBoxData(event.target.value);
    };
    return (
        <>
            <div
                className="container h-full w-1/2 p-2 flex flex-1">
                <textarea
                    className="flex-grow p-2 m-2 w-1/2 h-[750px] resize-none rounded-lg"
                    value={textBoxData}
                    onChange={handleTextBoxChange}
                    placeholder=""
                ></textarea>
            </div>
        </>
    )
}
