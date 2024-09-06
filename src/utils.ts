import { Request } from "express";
import dotenv from 'dotenv';

dotenv.config();

const USER_API_URL = process.env["USER_API_URL"] ?? 'http://localhost:8001';
const VIDEO_API_URL = process.env["VIDEO_API_URL"] ?? 'http://localhost:8002';
const ADMIN_API_URL = process.env["ADMIN_API_URL"] ?? 'http://localhost:8080';

const getUrl = (req: Request) => {
    const parts = req.url.split('?');
    const partsUrl = req.baseUrl.split('/');
    const baseUrl = req.baseUrl.replace("/" + partsUrl[1], '');

    const queryString = parts[1];
    const updatedPath = parts[0];
    return baseUrl + updatedPath + (queryString ? '?' + queryString : '');
}

const videoServiceRegex = /\/videoservice/;
const userServiceRegex = /\/userservice/;
const adminServiceRegex = /\/adminservice/;

const getHost = (req: Request) => {
    if (videoServiceRegex.exec(req.baseUrl)) {
        console.log("VIDEO CALLED");
        return VIDEO_API_URL;
    } else if (userServiceRegex.exec(req.baseUrl)) {
        console.log("USER CALLED");
        return USER_API_URL;
    } else if (adminServiceRegex.exec(req.baseUrl)) {
        console.log("ADMIN CALLED");
        return ADMIN_API_URL;
    } else {
        return '';
    }
}

export { getHost, getUrl }