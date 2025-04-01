import React from "react";
import Image from "next/image";


export default function MegaMenu({ content = [] }) {

  return (
    <ul className=" list-none">
      <li className="auto-columns">
        <div className="content">
          {content.map((item, i) => (
            <div key={i} className="hover:bg-cyan-200">
              <a href={item.slug == undefined ? "javascript:void(0)" : item.slug} className="flex gap-2 bg-slate-200 hover:bg-cyan-300 p-3">
                <div className="relative h-[30px] w-[30px]">
                  <Image src={item.thumbnail} fill className="object-cover" />
                </div>
                <p className=" font-bold">{item.name}</p>
              </a>
              {item.data.map((itm, index) => (
                <a href={itm.slug} key={index} className="flex gap-2 mb-2 hover:bg-cyan-100">
                  <div className="relative h-[30px] w-[30px]">
                    <Image src={itm.thumbnail} fill className="object-cover" />
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

