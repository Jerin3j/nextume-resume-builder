"use client"

import axiosInstance from "@/app/utils/axiosInstance";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function PublicPortfolio() {

    const { id } = useParams();

    const [html, setHtml] = useState("");
    console.log(html);


    useEffect(() => {

        if (!id) return;


        axiosInstance
            .get(`/ai/portfolio/${id}`)
            .then(res => {
                setHtml(res.data.html);
            })
            .catch(err => {
                console.log(err);
            });


    }, [id]);


    return (
        <div
            dangerouslySetInnerHTML={{
                __html: html
            }}
        />
    )

}