import React from "react";
import Image from "next/image";


export default function MegaMenu({ content = [] }) {
  // console.log(content)
  return (
    <ul className=" list-none">
      <li className="auto-columns">
        <div className="content">
          {content.map((item, i) => (
            <div key={i} className="hover:bg-cyan-200 rounded-2xl">
              <a href={"javascript:void(0)"} className="flex gap-2 bg-slate-200 hover:bg-cyan-300 p-3 rounded-2xl">
                <div className="relative h-[30px] w-[30px] flex-shrink-0 items-center">
                  <Image src={item.thumbnail} fill className="object-cover rounded-lg" alt={item.name} />
                </div>
                <p className=" font-bold">{item.name}</p>
              </a>
              {item.data.map((itm, index) => (
                <a href={itm.slug} key={index} className="flex gap-2 mb-2 hover:bg-cyan-100 rounded-l-3xl">
                  <div className="relative h-[30px] w-[30px] flex-shrink-0">
                    <Image src={itm.thumbnail} fill className="object-cover rounded-lg" alt={itm.title} />
                  </div>
                  {itm.title}</a>
              ))}
            </div>
          ))}
        </div>
      </li>
    </ul>
  );
};

