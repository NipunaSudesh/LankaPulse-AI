import Image from 'next/image'
import React from 'react'

export default function CategoriesCard({ category }) {
  return (
<div className="group relative h-56 overflow-hidden rounded-xl cursor-pointer  transition-all duration-300  hover:shadow-[0_0_25px_rgba(0,230,184,0.45)]  hover:ring-1 hover:ring-[#00e6b8]/50">

      <Image
        src={category.imgURL}
        alt={`${category.name} category`}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-12 translate-y-full p-4 transition-transform duration-300 ease-out group-hover:translate-y-6">
        <h2 className="text-xl font-bold text-white">
          {category.name}
        </h2>
        <p className="text-white">
          {category.description}
        </p>
      </div>

    </div>
  )
}