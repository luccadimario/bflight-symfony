import React, {useEffect, useRef, useState} from 'react';
import { useInView } from 'react-intersection-observer';
import Navbar from "../Navbar/Navbar";
import NavbarHelper from "../Navbar/NavbarHelper";
import Cropper from "./Cropper";
import LogSpreadsheet from "./LogSpreadsheet";



function OCR(){


    return (
        <>
        <div>
            <Navbar pageTitle={"OCR"}/>
            <NavbarHelper/>
        </div>
        <div className={"flex overflow-hidden"}>
            <Cropper/>
            <LogSpreadsheet/>
        </div>
        </>
    );
};

export default OCR;

