import React from 'react'
import { fetchNews } from "@/lib/api";
import Header from '@/components/ui/Header';

export default function page() {

  return (
    <div>
        <Header
        sub="LANKA NEWS INTELLIGENCE"
        title="Latest News"
        description="Stay up to date with the latest stories, breaking news, and important developments from Sri Lanka and around the world. Get timely updates and discover the stories that matter most."
        />
    </div>
  )
}
