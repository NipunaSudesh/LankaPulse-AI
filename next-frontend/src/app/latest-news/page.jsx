"use client";

import React, { useEffect, useState } from "react";
import { fetchNews as getNews } from "@/lib/api";
import Header from "@/components/ui/Header";

export default function LatestNewsPage() {
const [articles, setArticles] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
async function loadNews() {
try {
const data = await fetchNews();

    setArticles(Array.isArray(data) ? data : []);
    console.log("Fetched articles:", data);
  } catch (error) {
    console.error("Unable to load news:", error);
    setError("Unable to load news. Please try again later.");
  } finally {
    setLoading(false);
  }
}

loadNews();

}, []);

  return (
    <div className='flex flex-col mt-10 container-custom'>
        <Header
        sub="LANKA NEWS INTELLIGENCE"
        title="Latest News"
        description="Stay up to date with the latest stories, breaking news, and important developments from Sri Lanka and around the world. Get timely updates and discover the stories that matter most."
        />
    </div>
  )
}
